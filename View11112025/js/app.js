import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { heritageSites, latLonTo3D } from './data.js';

// Global variables
let scene, camera, renderer, controls;
let markers = [];
let selectedSite = null;
let is3DView = true;
let leafletMap = null;
let itinerary = [];
let particles = [];
let autoTourActive = false;
let autoTourIndex = 0;
let karnatakaBorder = null;
let districtBorders = [];
let cityMarkers = [];

// Initialize the application
function init() {
    // Show landing page first
    initLandingPage();
}

// Initialize landing page with animations
function initLandingPage() {
    // Animate landing page elements
    anime({
        targets: '#landingTitle',
        opacity: [0, 1],
        translateY: [-30, 0],
        duration: 1000,
        easing: 'easeOutExpo'
    });

    anime({
        targets: '#landingSubtitle',
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 1000,
        delay: 300,
        easing: 'easeOutExpo'
    });

    anime({
        targets: '#startExploration',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 800,
        delay: 600,
        easing: 'easeOutElastic(1, .8)'
    });

    // Populate site chips
    populateLandingChips();
    
    // Initialize landing map
    initLandingMap();
    
    // Setup timeline filtering
    setupTimelineFilters();
    
    // Setup chip click handlers
    setupChipHandlers();
    
    // Setup itinerary buttons
    setupLandingItineraryButtons();

    // Start exploration button
    document.getElementById('startExploration').addEventListener('click', () => {
        startExploration();
    });
}

// Populate landing page chips
function populateLandingChips() {
    const unescoChips = document.getElementById('unescoChips');
    const proposedChips = document.getElementById('proposedChips');
    const heritageChips = document.getElementById('heritageChips');
    
    // Get sites by category
    const unescoSites = heritageSites.filter(s => s.category === 'UNESCO');
    const proposedSites = heritageSites.filter(s => s.category === 'Proposed UNESCO');
    const heritageSitesList = heritageSites.filter(s => s.category === 'Heritage');
    
    // Map site keys to display names
    const siteDisplayNames = {
        'hampi': 'Hampi',
        'pattadakal': 'Pattadakal',
        'western_ghats': 'Western Ghats (KA)',
        'belur': 'Belur',
        'halebidu': 'Halebidu',
        'somanathapura': 'Somanathapura',
        'badami': 'Badami',
        'aihole': 'Aihole',
        'bidar': 'Bidar',
        'banavasi': 'Banavasi',
        'mirjan': 'Mirjan Fort',
        'balligave': 'Balligave',
        'brahmagiri': 'Brahmagiri',
        'kurudumale': 'Kurudumale',
        'belur-halebidu': 'Belur & Halebidu',
        'badami-aihole-pattadakal': 'Badami-Aihole-Pattadakal'
    };
    
    // Create UNESCO chips
    unescoSites.forEach(site => {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.dataset.key = site.key;
        chip.textContent = siteDisplayNames[site.key] || site.name.split('(')[0].trim();
        chip.style.opacity = '0.35';
        unescoChips.appendChild(chip);
    });
    
    // Create Proposed UNESCO chips
    proposedSites.forEach(site => {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.dataset.key = site.key;
        chip.textContent = siteDisplayNames[site.key] || site.name.split('(')[0].trim();
        chip.style.opacity = '0.35';
        proposedChips.appendChild(chip);
    });
    
    // Create Heritage chips (first 6)
    heritageSitesList.slice(0, 6).forEach(site => {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.dataset.key = site.key;
        chip.textContent = siteDisplayNames[site.key] || site.name.split('(')[0].trim();
        chip.style.opacity = '0.35';
        heritageChips.appendChild(chip);
    });
}

// Initialize landing map
let landingMapInstance = null;

function initLandingMap() {
    const mapContainer = document.getElementById('landingMap');
    if (!mapContainer || landingMapInstance) return;
    
    try {
        landingMapInstance = L.map('landingMap').setView([15.3173, 75.7139], 7);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(landingMapInstance);
        
        // Add markers
        heritageSites.forEach(site => {
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${getCategoryColorHex(site.category)}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; cursor: pointer;"></div>`,
                iconSize: [16, 16]
            });
            
            const marker = L.marker(site.coords, { icon }).addTo(landingMapInstance);
            marker.bindPopup(`<b>${site.name}</b><br>${site.category}`);
            marker.on('click', () => {
                navigateToSite(site.key);
            });
        });
    } catch (error) {
        console.error('Error initializing landing map:', error);
    }
}

// Setup timeline filters
function setupTimelineFilters() {
    const timelineButtons = document.querySelectorAll('.tick');
    timelineButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            timelineButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            const era = btn.dataset.era;
            filterChipsByEra(era);
        });
    });
}

// Filter chips by era
function filterChipsByEra(era) {
    const allChips = document.querySelectorAll('.chip');
    allChips.forEach(chip => {
        const siteKey = chip.dataset.key;
        const site = heritageSites.find(s => s.key === siteKey);
        if (!site) {
            chip.style.opacity = '0.35';
            return;
        }
        
        // Map era to site era
        const siteEra = site.era.toLowerCase();
        let matches = false;
        
        if (era === 'Prehistory/Mauryan' && (siteEra.includes('prehistoric') || siteEra.includes('mauryan'))) matches = true;
        else if (era === 'Kadamba/Ancient' && (siteEra.includes('kadamba') || siteEra.includes('ancient'))) matches = true;
        else if (era === 'Early Chalukya' && siteEra.includes('chalukya') && siteEra.includes('6th')) matches = true;
        else if (era === 'Western Chalukya' && siteEra.includes('chalukya') && siteEra.includes('7th')) matches = true;
        else if (era === 'Hoysala' && siteEra.includes('hoysala')) matches = true;
        else if (era === 'Vijayanagara' && siteEra.includes('vijayanagara')) matches = true;
        else if (era === 'Bahmani/Adil Shahi' && (siteEra.includes('bahmani') || siteEra.includes('adil shahi'))) matches = true;
        else if (era === 'Medieval/Maritime' && (siteEra.includes('medieval') || siteEra.includes('maritime'))) matches = true;
        else if (era === 'Natural' && siteEra.includes('natural')) matches = true;
        
        chip.style.opacity = matches ? '1' : '0.35';
    });
}

// Setup chip click handlers
function setupChipHandlers() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('chip')) {
            const siteKey = e.target.dataset.key;
            navigateToSite(siteKey);
        }
    });
}

// Navigate to specific site
function navigateToSite(siteKey) {
    // First, start exploration if not already started
    if (!document.getElementById('mainContainer').style.display || 
        document.getElementById('mainContainer').style.display === 'none') {
        startExploration();
        
        // Wait for app to initialize, then navigate
        setTimeout(() => {
            navigateToSiteAfterInit(siteKey);
        }, 1500);
    } else {
        navigateToSiteAfterInit(siteKey);
    }
}

// Navigate to site after app is initialized
function navigateToSiteAfterInit(siteKey) {
    const site = heritageSites.find(s => s.key === siteKey);
    if (!site) return;
    
    const marker = markers.find(m => m.userData.site.key === siteKey);
    if (marker) {
        selectSite(site, marker);
    }
}

// Setup landing itinerary buttons
function setupLandingItineraryButtons() {
    document.getElementById('viewItinerary')?.addEventListener('click', () => {
        startExploration();
        setTimeout(() => {
            document.getElementById('itinerarySidebar').style.transform = 'translateX(0)';
        }, 1500);
    });
    
    document.getElementById('clearItinerary')?.addEventListener('click', () => {
        itinerary = [];
        updateItineraryBadge();
        document.getElementById('circuitCount').textContent = '0';
    });
    
    // Update circuit count
    setInterval(() => {
        document.getElementById('circuitCount').textContent = itinerary.length;
    }, 500);
}

// Create mini 3D preview for landing page
function createLandingPreview() {
    const container = document.getElementById('landingPreview');
    const previewScene = new THREE.Scene();
    const previewCamera = new THREE.PerspectiveCamera(50, 400/300, 0.1, 1000);
    const previewRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    previewRenderer.setSize(400, 300);
    previewRenderer.setClearColor(0x000000, 0);
    container.appendChild(previewRenderer.domElement);

    previewCamera.position.set(0, 30, 50);
    previewCamera.lookAt(0, 0, 0);

    // Add simple terrain
    const shape = new THREE.Shape();
    shape.moveTo(-10, 10);
    shape.lineTo(10, 10);
    shape.lineTo(15, 0);
    shape.lineTo(10, -10);
    shape.lineTo(-10, -10);
    shape.lineTo(-15, 0);
    shape.lineTo(-10, 10);

    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: true });
    const material = new THREE.MeshStandardMaterial({ color: 0x4a7c59 });
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    previewScene.add(terrain);

    // Add some markers
    for (let i = 0; i < 5; i++) {
        const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshStandardMaterial({ 
                color: [0xff6b6b, 0x4ecdc4, 0xffe66d][i % 3],
                emissive: [0xff6b6b, 0x4ecdc4, 0xffe66d][i % 3],
                emissiveIntensity: 0.8
            })
        );
        marker.position.set(
            (Math.random() - 0.5) * 20,
            1,
            (Math.random() - 0.5) * 20
        );
        previewScene.add(marker);
    }

    // Add light
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(10, 20, 10);
    previewScene.add(light);
    previewScene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Animate preview
    function animatePreview() {
        requestAnimationFrame(animatePreview);
        previewCamera.position.x = Math.sin(Date.now() * 0.0005) * 30;
        previewCamera.position.z = Math.cos(Date.now() * 0.0005) * 30;
        previewCamera.lookAt(0, 0, 0);
        previewRenderer.render(previewScene, previewCamera);
    }
    animatePreview();
}

// Start exploration - transition from landing to main app
function startExploration() {
    // Animate landing page out
    gsap.to('#landingPage', {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
            document.getElementById('landingPage').classList.add('hidden');
            document.getElementById('mainContainer').style.display = 'block';
            initMainApp();
        }
    });
}

// Initialize main application
function initMainApp() {
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0f3460, 50, 200);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 60, 80);
    camera.lookAt(0, 0, 0);

    // Create renderer
    const container = document.getElementById('threejs-container');
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Add controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 30;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI / 2.2;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x8b7355, 0.5);
    scene.add(hemisphereLight);

    // Create Karnataka terrain
    createKarnatakaTerrain();

    // Load KML borders and cities
    loadKMLBorders();

    // Create heritage markers
    createHeritageMarkers();

    // Add starfield
    createStarfield();

    // Add particles
    createParticles();

    // Scene intro animation
    showSceneIntro();

    // Hide loading overlay
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }, 1000);

    // Event listeners
    setupEventListeners();

    // Initialize 2D map (hidden)
    initLeafletMap();

    // Initialize UI counts
    updateVisibleSitesCount();
    updateItineraryBadge();

    // Start animation loop
    animate();
}

// Show scene intro animation
function showSceneIntro() {
    const intro = document.getElementById('sceneIntro');
    gsap.fromTo(intro, 
        { opacity: 0, scale: 0.8 },
        { 
            opacity: 1, 
            scale: 1,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(intro, {
                    opacity: 0,
                    duration: 1,
                    delay: 2,
                    ease: "power2.in"
                });
            }
        }
    );
}

// Load KML borders and cities
async function loadKMLBorders() {
    try {
        // Load state border
        await loadKMZFile('kml/State_MapToKML.kmz', 'state');
        // Load district borders
        await loadKMZFile('kml/District_MapToKML.kmz', 'districts');
    } catch (error) {
        console.error('Error loading KML files:', error);
        // Fallback to simplified border
        createSimplifiedBorder();
    }
}

// Load and parse KMZ file
async function loadKMZFile(url, type) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        
        // Find KML file in KMZ
        const kmlFile = Object.keys(zip.files).find(name => name.endsWith('.kml'));
        if (!kmlFile) {
            console.warn('No KML file found in KMZ');
            return;
        }
        
        const kmlContent = await zip.files[kmlFile].async('text');
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlContent, 'text/xml');
        
        if (type === 'state') {
            createStateBorderFromKML(kmlDoc);
        } else if (type === 'districts') {
            createDistrictBordersFromKML(kmlDoc);
        }
    } catch (error) {
        console.error(`Error loading ${type} KML:`, error);
    }
}

// Create state border from KML
function createStateBorderFromKML(kmlDoc) {
    const placemarks = kmlDoc.querySelectorAll('Placemark');
    
    placemarks.forEach((placemark, index) => {
        const coordinates = placemark.querySelector('coordinates');
        if (!coordinates) return;
        
        const coordText = coordinates.textContent.trim();
        const coordPairs = coordText.split(/\s+/).filter(c => c.trim());
        
        if (coordPairs.length === 0) return;
        
        // Parse coordinates (KML format: lon,lat,alt)
        const points = coordPairs.map(coord => {
            const [lon, lat, alt] = coord.split(',').map(Number);
            return { lat, lon, alt: alt || 0 };
        });
        
        // Create 3D border line
        const borderPoints = points.map(p => {
            const [x, y, z] = latLonTo3D(p.lat, p.lon);
            return new THREE.Vector3(x, y + 0.5, z);
        });
        
        // Create animated border with drawing effect
        const curve = new THREE.CatmullRomCurve3(borderPoints, true);
        const geometry = new THREE.TubeGeometry(curve, borderPoints.length * 2, 0.3, 8, true);
        const material = new THREE.MeshStandardMaterial({
            color: 0x4ecdc4,
            emissive: 0x4ecdc4,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.7
        });
        
        const border = new THREE.Mesh(geometry, material);
        border.rotation.x = 0;
        scene.add(border);
        karnatakaBorder = border;
        
        // Animate border appearance with scale
        border.scale.set(0, 0, 0);
        gsap.to(border.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 2,
            delay: index * 0.1,
            ease: "back.out(1.7)"
        });
        
        // Add pulsing animation
        animateBorderPulse(border);
        
        // Add drawing line effect
        createBorderDrawingEffect(borderPoints, index * 0.1);
    });
}

// Create drawing effect for border
function createBorderDrawingEffect(points, delay) {
    if (points.length < 2) return;
    
    // Create a line that draws progressively
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        linewidth: 2
    });
    
    const line = new THREE.Line(geometry, material);
    line.position.y = 0.6; // Slightly above the border
    scene.add(line);
    
    // Animate drawing
    let currentIndex = 0;
    const drawInterval = setInterval(() => {
        if (currentIndex >= points.length) {
            clearInterval(drawInterval);
            // Fade out the drawing line
            gsap.to(material, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => scene.remove(line)
            });
            return;
        }
        
        // Add next point
        const point = points[currentIndex];
        positions[currentIndex * 3] = point.x;
        positions[currentIndex * 3 + 1] = point.y;
        positions[currentIndex * 3 + 2] = point.z;
        
        geometry.setDrawRange(0, currentIndex + 1);
        geometry.attributes.position.needsUpdate = true;
        currentIndex++;
    }, 20);
    
    // Start after delay
    setTimeout(() => {
        // Animation will start
    }, delay * 1000);
}

// Create district borders from KML
function createDistrictBordersFromKML(kmlDoc) {
    const placemarks = kmlDoc.querySelectorAll('Placemark');
    
    placemarks.forEach((placemark, index) => {
        const name = placemark.querySelector('name')?.textContent || `District ${index}`;
        const coordinates = placemark.querySelector('coordinates');
        if (!coordinates) return;
        
        const coordText = coordinates.textContent.trim();
        const coordPairs = coordText.split(/\s+/).filter(c => c.trim());
        
        if (coordPairs.length === 0) return;
        
        // Parse coordinates
        const points = coordPairs.map(coord => {
            const [lon, lat, alt] = coord.split(',').map(Number);
            return { lat, lon, alt: alt || 0 };
        });
        
        // Create 3D district border
        const borderPoints = points.map(p => {
            const [x, y, z] = latLonTo3D(p.lat, p.lon);
            return new THREE.Vector3(x, y + 0.3, z);
        });
        
        if (borderPoints.length < 3) return;
        
        // Create line geometry
        const geometry = new THREE.BufferGeometry().setFromPoints(borderPoints);
        const material = new THREE.LineBasicMaterial({
            color: 0x95e1d3,
            transparent: true,
            opacity: 0.4,
            linewidth: 2
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        districtBorders.push({ line, name });
        
        // Animate appearance with wave effect
        line.material.opacity = 0;
        gsap.to(line.material, {
            opacity: 0.4,
            duration: 1,
            delay: index * 0.05,
            ease: "power2.out"
        });
        
        // Add subtle animation
        const animateDistrict = () => {
            const time = Date.now() * 0.0005;
            line.material.opacity = 0.3 + Math.sin(time + index) * 0.1;
        };
        line.userData.animate = animateDistrict;
        
        // Extract city center from polygon (centroid)
        const centroid = calculateCentroid(points);
        if (centroid) {
            createCityMarker(centroid, name);
        }
    });
}

// Calculate centroid of polygon
function calculateCentroid(points) {
    if (points.length === 0) return null;
    
    let sumLat = 0, sumLon = 0;
    points.forEach(p => {
        sumLat += p.lat;
        sumLon += p.lon;
    });
    
    return {
        lat: sumLat / points.length,
        lon: sumLon / points.length
    };
}

// Create city marker
function createCityMarker(center, cityName) {
    const [x, y, z] = latLonTo3D(center.lat, center.lon);
    
    // Create city marker (small glowing sphere)
    const geometry = new THREE.SphereGeometry(0.4, 8, 8);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffd93d,
        emissive: 0xffd93d,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9
    });
    
    const cityMarker = new THREE.Mesh(geometry, material);
    cityMarker.position.set(x, y + 1, z);
    scene.add(cityMarker);
    
    // Add pulsing ring
    const ringGeometry = new THREE.RingGeometry(0.5, 0.7, 16);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd93d,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, y + 0.5, z);
    scene.add(ring);
    
    // Animate city marker
    const animateCity = () => {
        const time = Date.now() * 0.002;
        cityMarker.scale.setScalar(1 + Math.sin(time) * 0.2);
        cityMarker.material.emissiveIntensity = 0.6 + Math.sin(time * 2) * 0.4;
        
        ring.scale.setScalar(1 + Math.sin(time * 1.5) * 0.5);
        ring.material.opacity = 0.3 + Math.sin(time * 2) * 0.3;
    };
    
    cityMarker.userData.animate = animateCity;
    ring.userData.animate = animateCity;
    
    // Animate appearance
    cityMarker.scale.set(0, 0, 0);
    ring.scale.set(0, 0, 0);
    gsap.to(cityMarker.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        delay: Math.random() * 0.5,
        ease: "back.out(2)"
    });
    gsap.to(ring.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        delay: Math.random() * 0.5 + 0.2,
        ease: "back.out(2)"
    });
    
    cityMarkers.push({ marker: cityMarker, ring, name: cityName, center });
}

// Animate border pulse
function animateBorderPulse(border) {
    const pulseAnimation = () => {
        const time = Date.now() * 0.001;
        border.material.emissiveIntensity = 0.6 + Math.sin(time * 2) * 0.3;
        border.material.opacity = 0.6 + Math.sin(time * 2) * 0.2;
    };
    
    // Store animation function
    border.userData.animate = pulseAnimation;
}

// Create simplified border as fallback
function createSimplifiedBorder() {
    const shape = new THREE.Shape();
    shape.moveTo(-15, 20);
    shape.lineTo(15, 20);
    shape.lineTo(25, 10);
    shape.lineTo(20, -15);
    shape.lineTo(-10, -20);
    shape.lineTo(-20, -10);
    shape.lineTo(-25, 5);
    shape.lineTo(-15, 20);
    
    const points = shape.getPoints(50);
    const borderPoints = points.map(p => new THREE.Vector3(p.x, 0.5, p.y));
    
    const curve = new THREE.CatmullRomCurve3(borderPoints, true);
    const geometry = new THREE.TubeGeometry(curve, 100, 0.5, 8, true);
    const material = new THREE.MeshStandardMaterial({
        color: 0x4ecdc4,
        emissive: 0x4ecdc4,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.7
    });
    
    const border = new THREE.Mesh(geometry, material);
    scene.add(border);
    karnatakaBorder = border;
    animateBorderPulse(border);
}

// Create simplified Karnataka terrain
function createKarnatakaTerrain() {
    const shape = new THREE.Shape();
    shape.moveTo(-15, 20);
    shape.lineTo(15, 20);
    shape.lineTo(25, 10);
    shape.lineTo(20, -15);
    shape.lineTo(-10, -20);
    shape.lineTo(-20, -10);
    shape.lineTo(-25, 5);
    shape.lineTo(-15, 20);

    const extrudeSettings = {
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.5,
        bevelSegments: 3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({
        color: 0x4a7c59,
        roughness: 0.8,
        metalness: 0.2,
        flatShading: false
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -1;
    terrain.receiveShadow = true;
    
    // Animate terrain appearance
    terrain.scale.set(0, 0, 0);
    gsap.to(terrain.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.5,
        ease: "back.out(1.7)"
    });
    
    scene.add(terrain);

    // Western Ghats elevation with animation
    const ghatsGeometry = new THREE.BoxGeometry(30, 3, 8);
    const ghatsMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d5a3d,
        roughness: 0.9
    });
    const ghats = new THREE.Mesh(ghatsGeometry, ghatsMaterial);
    ghats.rotation.x = -Math.PI / 2;
    ghats.position.set(-10, 1, 0);
    
    // Animate ghats appearance
    ghats.scale.set(0, 0, 0);
    gsap.to(ghats.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.5,
        delay: 0.3,
        ease: "back.out(1.7)"
    });
    
    scene.add(ghats);
}

// Create 3D monument icon based on site
function createMonumentIcon(site) {
    const iconGroup = new THREE.Group();
    const color = getCategoryColor(site.category);
    
    // Create different icons based on site key
    if (site.key === 'hampi') {
        // Mini stone chariot for Hampi
        const base = new THREE.BoxGeometry(1, 0.3, 1);
        const baseMesh = new THREE.Mesh(base, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 }));
        iconGroup.add(baseMesh);
        
        const wheel1 = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
        const wheelMesh1 = new THREE.Mesh(wheel1, new THREE.MeshStandardMaterial({ color, emissive: color }));
        wheelMesh1.rotation.z = Math.PI / 2;
        wheelMesh1.position.set(-0.4, 0.15, 0);
        iconGroup.add(wheelMesh1);
        
        const wheel2 = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
        const wheelMesh2 = new THREE.Mesh(wheel2, new THREE.MeshStandardMaterial({ color, emissive: color }));
        wheelMesh2.rotation.z = Math.PI / 2;
        wheelMesh2.position.set(0.4, 0.15, 0);
        iconGroup.add(wheelMesh2);
        
        const top = new THREE.ConeGeometry(0.4, 0.8, 8);
        const topMesh = new THREE.Mesh(top, new THREE.MeshStandardMaterial({ color, emissive: color }));
        topMesh.position.y = 0.7;
        iconGroup.add(topMesh);
    } else if (site.key === 'pattadakal' || site.key === 'belur' || site.key === 'halebidu') {
        // Temple dome
        const base = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 8);
        const baseMesh = new THREE.Mesh(base, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 }));
        iconGroup.add(baseMesh);
        
        const dome = new THREE.SphereGeometry(0.4, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMesh = new THREE.Mesh(dome, new THREE.MeshStandardMaterial({ color, emissive: color }));
        domeMesh.position.y = 0.3;
        iconGroup.add(domeMesh);
    } else {
        // Generic temple/palace shape
        const base = new THREE.BoxGeometry(0.8, 0.2, 0.8);
        const baseMesh = new THREE.Mesh(base, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 }));
        iconGroup.add(baseMesh);
        
        const roof = new THREE.ConeGeometry(0.5, 0.6, 4);
        const roofMesh = new THREE.Mesh(roof, new THREE.MeshStandardMaterial({ color, emissive: color }));
        roofMesh.position.y = 0.5;
        roofMesh.rotation.y = Math.PI / 4;
        iconGroup.add(roofMesh);
    }
    
    return iconGroup;
}

// Create heritage site markers
function createHeritageMarkers() {
    heritageSites.forEach((site, index) => {
        const [x, y, z] = latLonTo3D(site.coords[0], site.coords[1]);
        
        const markerGroup = new THREE.Group();
        markerGroup.position.set(x, y + 2, z);
        markerGroup.userData = { site: site };

        // Pulsating ring
        const ringGeometry = new THREE.RingGeometry(1.5, 2, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: getCategoryColor(site.category),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2;
        markerGroup.add(ring);

        const ringAnimation = () => {
            const scale = 1 + Math.sin(Date.now() * 0.003 + index) * 0.3;
            ring.scale.set(scale, scale, 1);
            ringMaterial.opacity = 0.4 + Math.sin(Date.now() * 0.003 + index) * 0.3;
        };

        // Add 3D monument icon
        const monumentIcon = createMonumentIcon(site);
        monumentIcon.position.y = 0.5;
        // Animate pop-up
        monumentIcon.scale.set(0, 0, 0);
        gsap.to(monumentIcon.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1,
            delay: index * 0.1,
            ease: "back.out(1.7)"
        });
        markerGroup.add(monumentIcon);

        // Glowing sphere (smaller, as base)
        const sphereGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: getCategoryColor(site.category),
            emissive: getCategoryColor(site.category),
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.9
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.y = -0.2;
        markerGroup.add(sphere);

        // Point light
        const light = new THREE.PointLight(getCategoryColor(site.category), 1, 10);
        light.position.set(0, 1, 0);
        markerGroup.add(light);

        // Label sprite
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, 256, 64);
        context.fillStyle = '#ffffff';
        context.font = 'Bold 20px Arial';
        context.textAlign = 'center';
        context.fillText(site.name, 128, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.y = 3;
        sprite.scale.set(8, 2, 1);
        markerGroup.add(sprite);

        markerGroup.userData.animate = ringAnimation;
        scene.add(markerGroup);
        markers.push(markerGroup);
    });
    
    // Create light trails between connected sites
    createLightTrails();
}

// Create particle system
function createParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = Math.random() * 50;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;

        const color = new THREE.Color();
        color.setHSL(0.6, 0.8, 0.6 + Math.random() * 0.4);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    particles.push(particleSystem);
}

// Get color based on category
function getCategoryColor(category) {
    const colors = {
        'UNESCO': 0xff6b6b,
        'Proposed UNESCO': 0x4ecdc4,
        'Heritage': 0xffe66d,
        'Prehistoric': 0x95e1d3
    };
    return colors[category] || 0xffffff;
}

// Create starfield background
function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 500;
        const y = (Math.random() - 0.5) * 500;
        const z = (Math.random() - 0.5) * 500;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Create light trails between connected heritage sites
function createLightTrails() {
    // Connect UNESCO sites with light trails
    const unescoSites = markers.filter(m => m.userData.site.category === 'UNESCO');
    
    for (let i = 0; i < unescoSites.length; i++) {
        for (let j = i + 1; j < unescoSites.length; j++) {
            const start = unescoSites[i].position;
            const end = unescoSites[j].position;
            
            // Create curve
            const curve = new THREE.QuadraticBezierCurve3(
                start,
                new THREE.Vector3(
                    (start.x + end.x) / 2,
                    (start.y + end.y) / 2 + 10,
                    (start.z + end.z) / 2
                ),
                end
            );
            
            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: 0x4ecdc4,
                transparent: true,
                opacity: 0.3,
                linewidth: 2
            });
            
            const line = new THREE.Line(geometry, material);
            scene.add(line);
        }
    }
}

// Global variable for Leaflet markers
let leafletMarkers = [];
let leafletMarkersCluster = null;

// Initialize Leaflet 2D map with marker clusters
function initLeafletMap() {
    leafletMap = L.map('leaflet-map').setView([15.3173, 75.7139], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMap);

    // Load KML borders on Leaflet map
    loadKMLOnLeaflet();

    // Create marker cluster group
    leafletMarkersCluster = L.markerClusterGroup();
    leafletMap.addLayer(leafletMarkersCluster);

    // Add markers to cluster group
    heritageSites.forEach(site => {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${getCategoryColorHex(site.category)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20]
        });
        
        const marker = L.marker(site.coords, { icon });
        marker.bindPopup(`<b>${site.name}</b><br>${site.category}<br>${site.era}`);
        marker.on('click', () => {
            const threeMarker = markers.find(m => m.userData.site.key === site.key);
            if (threeMarker) {
                selectSite(site, threeMarker);
            }
        });
        
        marker.userData = { site: site };
        leafletMarkers.push(marker);
        leafletMarkersCluster.addLayer(marker);
    });
}

// Load KML on Leaflet map
async function loadKMLOnLeaflet() {
    try {
        // Load state border
        await loadKMZOnLeaflet('kml/State_MapToKML.kmz', {
            style: {
                color: '#4ecdc4',
                weight: 3,
                opacity: 0.8,
                fillColor: '#4a7c59',
                fillOpacity: 0.2
            }
        });
        
        // Load district borders
        await loadKMZOnLeaflet('kml/District_MapToKML.kmz', {
            style: {
                color: '#95e1d3',
                weight: 2,
                opacity: 0.6,
                fillOpacity: 0.1
            }
        });
    } catch (error) {
        console.error('Error loading KML on Leaflet:', error);
    }
}

// Load KMZ on Leaflet
async function loadKMZOnLeaflet(url, options) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        
        const kmlFile = Object.keys(zip.files).find(name => name.endsWith('.kml'));
        if (!kmlFile) return;
        
        const kmlContent = await zip.files[kmlFile].async('text');
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlContent, 'text/xml');
        
        // Parse KML manually for better control
        const placemarks = kmlDoc.querySelectorAll('Placemark');
        const geoJsonLayers = [];
        
        placemarks.forEach((placemark, index) => {
            const name = placemark.querySelector('name')?.textContent || `Area ${index}`;
            const coordinates = placemark.querySelector('coordinates');
            if (!coordinates) return;
            
            const coordText = coordinates.textContent.trim();
            const coordPairs = coordText.split(/\s+/).filter(c => c.trim());
            
            if (coordPairs.length === 0) return;
            
            // Parse coordinates
            const points = coordPairs.map(coord => {
                const [lon, lat, alt] = coord.split(',').map(Number);
                return [lat, lon];
            });
            
            // Create polygon
            const polygon = L.polygon(points, options.style);
            polygon.bindTooltip(name, { permanent: false, direction: 'center' });
            polygon.addTo(leafletMap);
            
            // Animate appearance
            polygon.setStyle({ opacity: 0, fillOpacity: 0 });
            gsap.to({ opacity: 0, fillOpacity: 0 }, {
                opacity: options.style?.opacity || 0.8,
                fillOpacity: options.style?.fillOpacity || 0.2,
                duration: 1,
                delay: index * 0.05,
                onUpdate: function() {
                    const target = this.targets()[0];
                    polygon.setStyle({ 
                        opacity: target.opacity,
                        fillOpacity: target.fillOpacity
                    });
                }
            });
            
            // Add hover effect
            polygon.on('mouseover', function() {
                this.setStyle({ 
                    weight: (options.style?.weight || 2) + 1,
                    opacity: 1,
                    fillOpacity: (options.style?.fillOpacity || 0.2) + 0.1
                });
            });
            polygon.on('mouseout', function() {
                this.setStyle(options.style);
            });
            
            geoJsonLayers.push(polygon);
            
            // If districts, add city marker
            if (url.includes('District')) {
                const centroid = calculateCentroid(coordPairs.map(coord => {
                    const [lon, lat, alt] = coord.split(',').map(Number);
                    return { lat, lon, alt: alt || 0 };
                }));
                
                if (centroid) {
                    const cityIcon = L.divIcon({
                        className: 'city-marker',
                        html: `<div class="city-marker-dot"></div>`,
                        iconSize: [12, 12],
                        iconAnchor: [6, 6]
                    });
                    
                    const cityMarker = L.marker([centroid.lat, centroid.lon], { icon: cityIcon });
                    cityMarker.bindTooltip(name, { permanent: false });
                    cityMarker.addTo(leafletMap);
                    
                    // Animate city marker
                    cityMarker.setOpacity(0);
                    gsap.to({ opacity: 0 }, {
                        opacity: 1,
                        duration: 0.8,
                        delay: index * 0.05 + 0.5,
                        onUpdate: function() {
                            cityMarker.setOpacity(this.targets()[0].opacity);
                        }
                    });
                }
            }
        });
        
        return geoJsonLayers;
    } catch (error) {
        console.error('Error loading KMZ on Leaflet:', error);
        return [];
    }
}

// Get color hex for Leaflet (moved earlier for landing page use)
function getCategoryColorHex(category) {
    const colors = {
        'UNESCO': '#ff6b6b',
        'Proposed UNESCO': '#4ecdc4',
        'Heritage': '#ffe66d',
        'Prehistoric': '#95e1d3'
    };
    return colors[category] || '#ffffff';
}

// Setup event listeners
function setupEventListeners() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(markers, true);

        if (intersects.length > 0) {
            const marker = intersects[0].object.parent;
            if (marker.userData.site) {
                selectSite(marker.userData.site, marker);
            }
        }
    });

    renderer.domElement.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(markers, true);

        markers.forEach(m => {
            m.children.forEach(child => {
                if (child.material) {
                    child.material.emissiveIntensity = 0.8;
                }
            });
        });

        if (intersects.length > 0) {
            const marker = intersects[0].object.parent;
            marker.children.forEach(child => {
                if (child.material) {
                    child.material.emissiveIntensity = 1.5;
                }
            });
            renderer.domElement.style.cursor = 'pointer';
        } else {
            renderer.domElement.style.cursor = 'default';
        }
    });

    // Toggle view button
    document.getElementById('toggleView').addEventListener('click', () => {
        toggleView();
    });

    // Reset camera
    document.getElementById('resetCamera').addEventListener('click', () => {
        resetCamera();
    });

    // Auto tour
    document.getElementById('autoTour').addEventListener('click', () => {
        startAutoTour();
    });

    // Search functionality - integrated with filters
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Show/hide clear button
        clearSearchBtn.style.display = searchTerm ? 'flex' : 'none';
        
        // Apply all filters including search
        applyFilters();
    });
    
    // Clear search
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        // Apply filters (will respect category and era filters)
        applyFilters();
    });
    
    // Toggle itinerary sidebar
    document.getElementById('toggleItinerary')?.addEventListener('click', () => {
        const sidebar = document.getElementById('itinerarySidebar');
        const isVisible = sidebar.style.transform === 'translateX(0px)' || sidebar.style.transform === '';
        sidebar.style.transform = isVisible ? 'translateX(-100%)' : 'translateX(0)';
    });

    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        applyFilters();
    });

    // Era filter
    document.getElementById('eraFilter').addEventListener('change', (e) => {
        applyFilters();
    });

    // Watch video button
    document.getElementById('watchVideo')?.addEventListener('click', () => {
        if (selectedSite && selectedSite.videoUrl) {
            window.open(selectedSite.videoUrl, '_blank');
        } else {
            alert('Video not available for this site yet.');
        }
    });

    // Sort by geography
    document.getElementById('sortGeography')?.addEventListener('click', () => {
        sortItineraryByGeography();
    });

    // Export PDF
    document.getElementById('exportPDF')?.addEventListener('click', () => {
        exportItineraryPDF();
    });

    // Close sidebar
    document.getElementById('closeSidebar')?.addEventListener('click', () => {
        document.getElementById('infoSidebar').classList.remove('show');
    });

    // Itinerary buttons
    document.getElementById('addToCircuit')?.addEventListener('click', () => {
        if (selectedSite) {
            addToItinerary(selectedSite);
        }
    });

    document.getElementById('clearCircuit')?.addEventListener('click', () => {
        clearItinerary();
    });

    document.getElementById('exportCircuit')?.addEventListener('click', () => {
        exportItinerary();
    });

    // Window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('threejs-container');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        
        if (leafletMap) {
            leafletMap.invalidateSize();
        }
    });
}

// Toggle between 3D and 2D views
function toggleView() {
    is3DView = !is3DView;
    const canvasContainer = document.getElementById('canvasContainer');
    const mapContainer = document.getElementById('mapContainer');
    const toggleBtn = document.getElementById('toggleView');
    const toggleIcon = toggleBtn.querySelector('.nav-btn-icon');
    const toggleText = toggleBtn.querySelector('.nav-btn-text');

    if (is3DView) {
        canvasContainer.classList.remove('d-none');
        mapContainer.classList.add('d-none');
        toggleIcon.textContent = '🌐';
        toggleText.textContent = '3D View';
    } else {
        canvasContainer.classList.add('d-none');
        mapContainer.classList.remove('d-none');
        toggleIcon.textContent = '🗺️';
        toggleText.textContent = '2D Map';
        if (leafletMap) {
            setTimeout(() => leafletMap.invalidateSize(), 100);
        }
    }
}

// Reset camera to default position
function resetCamera() {
    gsap.to(camera.position, {
        x: 0,
        y: 60,
        z: 80,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.lookAt(0, 0, 0);
        }
    });
    controls.target.set(0, 0, 0);
}

// Update visible sites count
function updateVisibleSitesCount() {
    const visibleCount = markers.filter(m => m.visible).length;
    document.getElementById('visibleSitesCount').textContent = visibleCount;
}

// Update itinerary badge
function updateItineraryBadge() {
    const badge = document.getElementById('itineraryBadge');
    if (badge) {
        badge.textContent = itinerary.length;
        badge.style.display = itinerary.length > 0 ? 'inline-block' : 'none';
    }
}

// Auto tour through all sites
function startAutoTour() {
    const tourBtn = document.getElementById('autoTour');
    const tourIcon = tourBtn.querySelector('.nav-btn-icon');
    const tourText = tourBtn.querySelector('.nav-btn-text');
    
    if (autoTourActive) {
        autoTourActive = false;
        tourIcon.textContent = '▶';
        tourText.textContent = 'Tour';
        return;
    }

    autoTourActive = true;
    autoTourIndex = 0;
    tourIcon.textContent = '⏸';
    tourText.textContent = 'Stop';

    function tourNext() {
        if (!autoTourActive || autoTourIndex >= markers.length) {
            autoTourActive = false;
            const tourBtn = document.getElementById('autoTour');
            tourBtn.querySelector('.nav-btn-icon').textContent = '▶';
            tourBtn.querySelector('.nav-btn-text').textContent = 'Tour';
            return;
        }

        const marker = markers[autoTourIndex];
        const site = marker.userData.site;
        selectSite(site, marker);

        autoTourIndex++;
        setTimeout(tourNext, 5000);
    }

    tourNext();
}

// Select a site and show details
function selectSite(site, marker) {
    selectedSite = site;

    const targetPosition = marker.position.clone();
    targetPosition.y += 20;
    targetPosition.z += 15;

    gsap.to(camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.lookAt(marker.position);
        }
    });

    showSiteModal(site);
}

// Apply filters (category and era) - works for both 3D and 2D views
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const era = document.getElementById('eraFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter 3D markers
    markers.forEach(marker => {
        const site = marker.userData.site;
        const categoryMatch = category === 'all' || site.category === category;
        const eraMatch = era === 'all' || getEraFromSite(site) === era;
        const searchMatch = searchTerm === '' || 
                          site.name.toLowerCase().includes(searchTerm) ||
                          site.era.toLowerCase().includes(searchTerm);
        marker.visible = categoryMatch && eraMatch && searchMatch;
    });
    
    // Filter 2D Leaflet markers
    if (leafletMarkersCluster && leafletMarkers.length > 0) {
        leafletMarkersCluster.clearLayers();
        
        leafletMarkers.forEach(marker => {
            const site = marker.userData.site;
            const categoryMatch = category === 'all' || site.category === category;
            const eraMatch = era === 'all' || getEraFromSite(site) === era;
            const searchMatch = searchTerm === '' || 
                              site.name.toLowerCase().includes(searchTerm) ||
                              site.era.toLowerCase().includes(searchTerm);
            
            if (categoryMatch && eraMatch && searchMatch) {
                leafletMarkersCluster.addLayer(marker);
            }
        });
    }
    
    updateVisibleSitesCount();
}

// Get era from site (simplified)
function getEraFromSite(site) {
    const era = site.era.toLowerCase();
    if (era.includes('prehistoric') || era.includes('ancient')) return 'Prehistoric';
    if (era.includes('medieval') || era.includes('chalukya') || era.includes('hoysala')) return 'Medieval';
    if (era.includes('empire') || era.includes('vijayanagara') || era.includes('adil shahi')) return 'Empire';
    if (era.includes('20th') || era.includes('wodeyar') || era.includes('modern')) return 'Modern';
    return 'Medieval'; // Default
}

// Generate QR code for site
function generateQRCode(site) {
    const container = document.getElementById('qrCodeContainer');
    container.innerHTML = '';
    
    const url = `${window.location.origin}${window.location.pathname}?site=${site.key}`;
    new QRCode(container, {
        text: url,
        width: 150,
        height: 150,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Show site information in modal
function showSiteModal(site) {
    const modal = new bootstrap.Modal(document.getElementById('siteModal'));
    const modalElement = document.getElementById('siteModal');
    
    // Update hero section
    document.getElementById('modalTitle').textContent = site.name;
    const heroBadges = document.getElementById('heroBadges');
    heroBadges.innerHTML = `
        <span class="hero-badge" style="background: ${getCategoryColorHex(site.category)}80; backdrop-filter: blur(10px);">
            ${site.category}
        </span>
        <span class="hero-badge" style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);">
            ${site.era}
        </span>
    `;
    
    // Update hero background gradient based on category
    const modalHero = document.getElementById('modalHero');
    const categoryGradients = {
        'UNESCO': 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        'Proposed UNESCO': 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
        'Heritage': 'linear-gradient(135deg, #ffe66d 0%, #ffd93d 100%)',
        'Prehistoric': 'linear-gradient(135deg, #95e1d3 0%, #7dd3c1 100%)'
    };
    modalHero.style.background = categoryGradients[site.category] || categoryGradients['Heritage'];
    
    // Build creative modal content
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <!-- Highlights Section -->
        <div class="content-section text-reveal">
            <div class="section-header">
                <div class="section-icon">⭐</div>
                <h3 class="section-title">Key Highlights</h3>
            </div>
            <div class="highlights-grid">
                ${site.highlights.map((h, i) => `
                    <div class="highlight-item text-reveal" style="animation-delay: ${i * 0.1}s">
                        <strong>${h}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- History Section -->
        <div class="content-section text-reveal">
            <div class="section-header">
                <div class="section-icon">📜</div>
                <h3 class="section-title">Historical Background</h3>
            </div>
            <p class="text-content">${site.description.history}</p>
        </div>
        
        <!-- Architecture Section -->
        <div class="content-section text-reveal">
            <div class="section-header">
                <div class="section-icon">🏛️</div>
                <h3 class="section-title">Architectural Marvel</h3>
            </div>
            <p class="text-content">${site.description.architecture}</p>
        </div>
        
        <!-- Timeline Section -->
        <div class="content-section text-reveal">
            <div class="section-header">
                <div class="section-icon">⏳</div>
                <h3 class="section-title">Historical Timeline</h3>
            </div>
            <div class="timeline-container">
                ${site.description.timeline.map((t, i) => `
                    <div class="timeline-item text-reveal" style="animation-delay: ${i * 0.1}s">
                        <span class="timeline-year">${t.year}</span>
                        <p class="timeline-event">${t.event}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Generate QR code
    generateQRCode(site);

    // Animate modal entrance
    modalElement.addEventListener('shown.bs.modal', function() {
        // Animate hero
        anime({
            targets: '.hero-title',
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 800,
            easing: 'easeOutExpo'
        });
        
        anime({
            targets: '.hero-badge',
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 600,
            delay: anime.stagger(100),
            easing: 'easeOutElastic(1, .8)'
        });
        
        // Animate content sections
        anime({
            targets: '.text-reveal',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: anime.stagger(150),
            easing: 'easeOutExpo'
        });
        
        // Animate timeline items
        anime({
            targets: '.timeline-item',
            opacity: [0, 1],
            translateX: [-30, 0],
            duration: 600,
            delay: anime.stagger(100),
            easing: 'easeOutExpo'
        });
    }, { once: true });

    // Focus button handler
    document.getElementById('focusSite').onclick = () => {
        const marker = markers.find(m => m.userData.site.key === site.key);
        if (marker) {
            selectSite(site, marker);
            modal.hide();
        }
    };

    modal.show();
}

// Add site to itinerary
function addToItinerary(site) {
    if (itinerary.find(s => s.key === site.key)) {
        return; // Already in itinerary
    }

    itinerary.push(site);
    updateItineraryDisplay();
    updateItineraryBadge();
    
    // Show itinerary sidebar
    document.getElementById('itinerarySidebar').style.transform = 'translateX(0)';

    // Animate addition
    anime({
        targets: '#itinerarySidebar',
        scale: [0.95, 1],
        duration: 300,
        easing: 'easeOutElastic(1, .8)'
    });
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Calculate total distance of itinerary
function calculateTotalDistance() {
    if (itinerary.length < 2) return 0;
    
    let total = 0;
    for (let i = 0; i < itinerary.length - 1; i++) {
        const site1 = itinerary[i];
        const site2 = itinerary[i + 1];
        total += calculateDistance(
            site1.coords[0], site1.coords[1],
            site2.coords[0], site2.coords[1]
        );
    }
    return Math.round(total);
}

// Sort itinerary by geography (nearest neighbor)
function sortItineraryByGeography() {
    if (itinerary.length < 2) return;
    
    const sorted = [itinerary[0]];
    const remaining = [...itinerary.slice(1)];
    
    while (remaining.length > 0) {
        let nearestIndex = 0;
        let nearestDistance = Infinity;
        const current = sorted[sorted.length - 1];
        
        for (let i = 0; i < remaining.length; i++) {
            const distance = calculateDistance(
                current.coords[0], current.coords[1],
                remaining[i].coords[0], remaining[i].coords[1]
            );
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = i;
            }
        }
        
        sorted.push(remaining[nearestIndex]);
        remaining.splice(nearestIndex, 1);
    }
    
    itinerary = sorted;
    updateItineraryDisplay();
}

// Update itinerary display with drag & drop
function updateItineraryDisplay() {
    const list = document.getElementById('itineraryList');
    list.innerHTML = '';

    if (itinerary.length === 0) {
        list.innerHTML = '<p class="text-muted">No sites added yet. Click "Add to Circuit" on any site.</p>';
        document.getElementById('totalDistance').textContent = '0';
        document.getElementById('siteCount').textContent = '0';
        return;
    }

    document.getElementById('totalDistance').textContent = calculateTotalDistance();
    document.getElementById('siteCount').textContent = itinerary.length;

    itinerary.forEach((site, index) => {
        const item = document.createElement('div');
        item.className = 'itinerary-item';
        item.draggable = true;
        item.dataset.index = index;
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                    <strong>${index + 1}. ${site.name}</strong>
                    <br><small class="text-muted">${site.category}</small>
                    ${index < itinerary.length - 1 ? `<br><small class="text-info">→ ${Math.round(calculateDistance(site.coords[0], site.coords[1], itinerary[index + 1].coords[0], itinerary[index + 1].coords[1]))} km</small>` : ''}
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeFromItinerary(${index})">×</button>
            </div>
        `;
        
        // Drag and drop handlers
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(list, e.clientY);
            if (afterElement == null) {
                list.appendChild(item);
            } else {
                list.insertBefore(item, afterElement);
            }
        });
        
        item.addEventListener('dragend', (e) => {
            item.classList.remove('dragging');
            // Reorder itinerary based on new positions
            const newOrder = Array.from(list.children).map(child => 
                itinerary[parseInt(child.dataset.index)]
            );
            itinerary = newOrder;
            updateItineraryDisplay();
        });
        
        list.appendChild(item);
    });
}

// Helper for drag and drop
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.itinerary-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Remove from itinerary
window.removeFromItinerary = function(index) {
    itinerary.splice(index, 1);
    updateItineraryDisplay();
    updateItineraryBadge();
};

// Clear itinerary
function clearItinerary() {
    itinerary = [];
    updateItineraryDisplay();
    updateItineraryBadge();
}

// Export itinerary as JSON
function exportItinerary() {
    const exportData = {
        itinerary: itinerary,
        totalDistance: calculateTotalDistance(),
        createdAt: new Date().toISOString()
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'karnataka-heritage-circuit.json';
    link.click();
}

// Export itinerary as PDF
function exportItineraryPDF() {
    if (itinerary.length === 0) {
        alert('No sites in itinerary to export.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Karnataka Heritage Circuit', 105, 20, { align: 'center' });
    
    // Stats
    doc.setFontSize(12);
    doc.text(`Total Sites: ${itinerary.length}`, 20, 35);
    doc.text(`Total Distance: ${calculateTotalDistance()} km`, 20, 42);
    doc.text(`Created: ${new Date().toLocaleDateString()}`, 20, 49);
    
    // Sites list
    let y = 60;
    itinerary.forEach((site, index) => {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        
        doc.setFontSize(14);
        doc.text(`${index + 1}. ${site.name}`, 20, y);
        y += 7;
        
        doc.setFontSize(10);
        doc.text(`Category: ${site.category}`, 25, y);
        y += 6;
        doc.text(`Era: ${site.era}`, 25, y);
        y += 6;
        
        if (index < itinerary.length - 1) {
            const distance = calculateDistance(
                site.coords[0], site.coords[1],
                itinerary[index + 1].coords[0], itinerary[index + 1].coords[1]
            );
            doc.text(`Distance to next: ${Math.round(distance)} km`, 25, y);
            y += 6;
        }
        
        y += 5;
    });
    
    doc.save('karnataka-heritage-circuit.pdf');
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Animate markers
    markers.forEach(marker => {
        if (marker.userData.animate) {
            marker.userData.animate();
        }
    });

    // Animate particles
    particles.forEach(particle => {
        particle.rotation.y += 0.001;
    });
    
    // Animate border pulse
    if (karnatakaBorder && karnatakaBorder.userData.animate) {
        karnatakaBorder.userData.animate();
    }
    
    // Animate district borders
    districtBorders.forEach(({ line }) => {
        if (line.userData.animate) {
            line.userData.animate();
        }
    });
    
    // Animate city markers
    cityMarkers.forEach(({ marker, ring }) => {
        if (marker.userData.animate) {
            marker.userData.animate();
        }
        if (ring && ring.userData.animate) {
            ring.userData.animate();
        }
    });

    controls.update();
    renderer.render(scene, camera);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

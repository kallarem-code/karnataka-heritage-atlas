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
        targets: '#landingPreview',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 1000,
        delay: 600,
        easing: 'easeOutExpo'
    });

    anime({
        targets: '#startExploration',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 800,
        delay: 900,
        easing: 'easeOutElastic(1, .8)'
    });

    anime({
        targets: '.landing-tagline',
        opacity: [0, 0.8],
        duration: 800,
        delay: 1200
    });

    // Create mini 3D preview in landing page
    createLandingPreview();

    // Start exploration button
    document.getElementById('startExploration').addEventListener('click', () => {
        startExploration();
    });
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
    scene.add(terrain);

    // Western Ghats elevation
    const ghatsGeometry = new THREE.BoxGeometry(30, 3, 8);
    const ghatsMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d5a3d,
        roughness: 0.9
    });
    const ghats = new THREE.Mesh(ghatsGeometry, ghatsMaterial);
    ghats.rotation.x = -Math.PI / 2;
    ghats.position.set(-10, 1, 0);
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

// Get color hex for Leaflet
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

    controls.update();
    renderer.render(scene, camera);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

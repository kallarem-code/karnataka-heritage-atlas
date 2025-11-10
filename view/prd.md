Karnataka Heritage Navigator (3D Edition)
Using Three.js + Bootstrap + Leaflet + Anime.js
1. Product Vision

Create the world’s first 3D heritage atlas for Karnataka, where users can explore UNESCO, Proposed, and Prehistoric heritage sites through:

A 3D Karnataka Globe/Model

Animated monuments rising from the surface

Clickable 3D hotspots leading to story panels

Bootstrap-powered responsive UI

Interactive travel circuits

Deep cultural timelines

This experience should feel like:

🌀 “Google Earth + Heritage Storytelling + Game-like exploration”

2. Key Objectives
✅ 1. Provide a highly visual, intuitive 3D exploration

View Karnataka in a rotating 3D map

Hover/click to highlight sites

Dynamic camera movement on selection

✅ 2. Offer rich site information

History

Architecture

Timeline

Stories

Videos / QR

✅ 3. Blend immersive 3D with a clean Bootstrap UI

Responsive

Fast loading

Friendly for students, tourists, researchers

✅ 4. Gamify exploration

Discover sites

Build your circuit

Earn badges (Phase 2)

3. Target Users
Primary

Tourists exploring Karnataka

Students & teachers

Cultural departments

Heritage enthusiasts

Secondary

Researchers

Travel planners

Documentarians

4. Core Features
A. 3D INTERACTIVE EXPERIENCE (Three.js)
1. 3D Karnataka Terrain Model

Low-poly but detailed Karnataka shape

Subtle elevation representing Western Ghats

PBR textures (stone, earth, greenery)

Optional enhancements: fog, starfield, topo lines

2. 3D Heritage Hotspots

Each heritage site becomes:

A glowing 3D marker (pulsating ring + billboard icon)

Upon hover:

Marker expands

Label pops out

Upon click:

Camera flies to location

Highlight animation triggers

Bootstrap modal opens

3. 3D Animated Site Icons

Two types:

A. Stylized Icons

3D simple shape (like flat temple silhouette)

Light glows from base

B. Monument Pops (optional)

Small geometry representing the site

Grows out of ground with animation

Example:

Hampi: Mini stone chariot

Pattadakal: Mini temple dome

Western Ghats: 3D tree cluster

4. 3D Camera Navigation

Drag to rotate map

Zoom in/out

Smooth camera transitions (GSAP or Three.js tween)

Auto-tour mode

5. 3D Particle/Glow Animations

Particles flow between connected heritage clusters

Light trails indicating “Heritage Circuits”

Star-like particles over iconic monuments

B. MAP & 2D EXPLORATION (Leaflet.js)

Even with 3D view, users should have:

A 2D map mode

Marker clusters

Filter system

Search

Circuits

Switching view:

Toggle Button → “3D View” / “Map View”

C. CONTENT EXPERIENCE (Bootstrap)
1. Story Panels / Modals

Each site includes:

Title + era

3 key highlights

“Focus” / “Watch Video” buttons

Timeline view

Architecture breakdown

Galleries (Phase 2)

QR deep link

Add to Circuit

2. Categories

UNESCO

Proposed UNESCO

Heritage / Prehistoric

Displayed as colored chips.

3. Filters

Era

Category

Prehistoric / Medieval / Empire

Search

D. ITINERARY BUILDER
Features:

Add site to itinerary

Drag & drop order

Autosort by geography

Distance estimation

Export JSON

Print / PDF

Add animation:

When user adds a site, it flies from 3D map into sidebar (GSAP motion path).

E. ANIMATIONS (Three.js + GSAP + Anime.js)
1. Three.js Animations

Camera transitions

Marker pulsating shader

Site pop-up effects

Hover glow with emissive material

3D particle movement

2. GSAP Animations

Scene intro

Camera tours

Scroll-trigger text

Motion path animation for itinerary

3. Anime.js

UI micro-animations

Button ripple

Text reveal

Chip hover

5. Technical Architecture
A. Frontend
Framework

Bootstrap 5 (UI responsiveness)

Three.js (3D scene)

Leaflet.js (2D map)

GSAP (camera + parallax + smooth transitions)

Anime.js (UI elements)

Optional

Vite / Webpack bundler

B. 3D Engine Details
Scene components:

Scene

PerspectiveCamera

Terrain mesh (extruded Karnataka map)

Heritage marker meshes (sprites/meshes)

Hemisphere light + directional light

Fog / atmospheric viewpoint

Starfield plane

OrbitControls for manual rotation

Performance requirements:

Target: 60fps on modern mobiles

Raycasting for hotspot clicks

Lazy loading monument icons

C. Backend (Phase 2)
Optional:

Headless CMS (Strapi/Sanity)

API:

/sites

/circuits

/media

/videos

6. Data Model
{
  "key": "hampi",
  "name": "Hampi (Group of Monuments)",
  "category": "UNESCO",
  "era": "Vijayanagara (14th–16th c.)",
  "coords": [15.335, 76.462],
  "3dPosition": [x,y,z],
  "highlights": [
    "Virupaksha & Vittala complexes",
    "Royal enclosures & tanks"
  ],
  "videoUrl": "",
  "description": {
    "history": "",
    "architecture": "",
    "timeline": []
  }
}

7. User Flow
1. Landing

Hero → rotating 3D Karnataka → “Start Exploration”

2. Main Interaction

3D view → markers → click → camera moves → modal opens

3. Explore more

User selects more sites, builds circuit

4. Plan Trip

User exports PDF/JSON

5. Share

Deep link for each site

8. Success Metrics (KPIs)

3D interaction time ≥ 3 minutes

10+ site clicks per session

200+ itineraries per month

90% of pages responsive score > 90 Lighthouse

Smooth performance on mobiles

9. Risks & Mitigation
Risk	Severity	Mitigation
3D model heavy for low-end mobiles	High	Provide fallback to 2D mode
Too many markers reduces FPS	Med	Use instancing + LOD
Asset loading time high	High	Preload textures + lazy load
Touch controls hard	Med	Optimize OrbitControls
10. Roadmap
Phase 1: 3D MVP

3D Karnataka map

Heritage markers

Camera interactions

Basic modals

Bootstrap UI

Phase 2: Enhanced Storytelling

3D monument icons

Animated storylines

3D particle circuits

Phase 3: Gamification

Achievements

Quests

Explore-to-unlock system

Phase 4: School Platform

Worksheets

AR mode

Lesson modules

✅ READY TO PROCEED

I can now create:

✔ Full 3D Three.js code template
✔ Bootstrap + Three.js page skeleton
✔ 3D Karnataka model (SVG → 3D extrude)
✔ Clickable 3D markers
✔ GSAP camera transitions
✔ Animated UI
✔ Project folder structure
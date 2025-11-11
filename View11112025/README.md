# Karnataka Heritage Navigator - 3D Edition

A 3D interactive heritage atlas for exploring Karnataka's UNESCO and heritage sites using Three.js, Bootstrap, and modern web technologies.

## Features

- **3D Karnataka Terrain**: Interactive 3D map with elevation and terrain details
- **Heritage Markers**: Glowing, pulsating markers for each heritage site
- **Interactive Camera**: Smooth camera transitions and orbit controls
- **Site Information**: Detailed modals with history, architecture, and timelines
- **Search & Filter**: Find sites by name, era, or category
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Three.js** - 3D graphics and scene rendering
- **Bootstrap 5** - Responsive UI framework
- **GSAP** - Smooth animations and camera transitions
- **Anime.js** - UI micro-animations
- **Vite** - Build tool and dev server

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
Karnataka/
├── index.html          # Main HTML file
├── styles.css          # Custom styles
├── js/
│   ├── app.js         # Main Three.js application
│   └── data.js        # Heritage sites data
├── package.json       # Dependencies
└── README.md          # This file
```

## Heritage Sites Included

- Hampi (UNESCO)
- Pattadakal (UNESCO)
- Badami Cave Temples
- Belur Chennakeshava Temple
- Halebidu Hoysaleswara Temple
- Mysore Palace
- Shravanabelagola
- Bijapur Gol Gumbaz

## Usage

1. **Explore**: Click and drag to rotate the 3D map
2. **Zoom**: Use mouse wheel or pinch to zoom
3. **Select Sites**: Click on glowing markers to view details
4. **Search**: Use the search bar to find specific sites
5. **Filter**: Use the category dropdown to filter by type

## Roadmap

### Phase 1 (MVP) - ✅ Current
- 3D Karnataka map
- Heritage markers
- Camera interactions
- Basic modals
- Bootstrap UI

### Phase 2 - Enhanced Storytelling
- 3D monument icons
- Animated storylines
- 3D particle circuits
- Leaflet 2D map integration

### Phase 3 - Gamification
- Achievements
- Quests
- Explore-to-unlock system

### Phase 4 - School Platform
- Worksheets
- AR mode
- Lesson modules

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with WebGL support

## Performance

- Target: 60fps on modern devices
- Optimized for mobile with fallback options
- Lazy loading for assets

## License

This project is created for educational and cultural preservation purposes.


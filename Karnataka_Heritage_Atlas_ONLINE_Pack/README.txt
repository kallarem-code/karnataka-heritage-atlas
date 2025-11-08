Karnataka Heritage Atlas – ONLINE PACK (Leaflet, no API key)

Files:
- index.html                  → Open in a browser (works online); for GitHub Pages/Netlify, just deploy this folder.
- karnataka_districts.geojson → District polygons (GeoJSON, lon/lat).

Deploy to GitHub Pages (free):
1) Create a new repo on GitHub (e.g., `karnataka-heritage-atlas`).
2) Upload `index.html` and `karnataka_districts.geojson` to the repo root.
3) Settings → Pages → Source: `Deploy from a branch`, Branch: `main` (root), Save.
4) After it builds, the site will be at https://<your-username>.github.io/karnataka-heritage-atlas/

Deploy to Netlify (free, fastest):
1) Drag-drop this folder onto https://app.netlify.com/drop
2) Netlify gives you a live URL instantly.

Notes:
- If you rename the GeoJSON, update the `fetch('karnataka_districts.geojson')` line in index.html.
- You can add images & richer popups later by extending the STORIES object and HTML content.

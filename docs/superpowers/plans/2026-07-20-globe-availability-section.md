# Sección "Disponibilidad Remota" con globo 3D — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "disponibilidad remota" section to the portfolio, between Hero and About, featuring a rotating 3D wireframe globe (D3 `geoOrthographic` on `<canvas>`) with a highlighted pin on Ecuador.

**Architecture:** A self-contained `RotatingEarth.jsx` canvas component (no external UI framework, plain D3 + React hooks) rendered inside a new `Availability.jsx` section component, which follows the same visual patterns already used by `Hero.jsx` and `Contact.jsx` (framer-motion entrance animations, `glass` cards, `lime`/`cyan` accents on the dark `base` background).

**Tech Stack:** React 19 (JSX, no TypeScript), Vite, Tailwind CSS 3, `d3` (new dependency), `framer-motion` (already installed), `lucide-react` (already installed).

## Global Constraints

- No TypeScript — plain JSX, no type annotations, no `"use client"` directives (this is Vite, not Next.js).
- Colors must use the project's existing Tailwind palette (`tailwind.config.js`): base `#0B0D10`, ink `#F3F4F0`, muted `#8B9097`, lime `#C6FF3D`. Do not introduce shadcn CSS variables (`--card`, `--primary`, etc.) — none exist in this project.
- No new files under `components/ui` — this project does not use the shadcn folder convention; new components go directly in `src/components/`.
- GeoJSON land data is served from this project's own `public/data/land-110m.json`, not fetched from `raw.githubusercontent.com` at runtime.
- Only one pin on the globe (Ecuador). No arcs, no additional markers (per approved design).
- Respect `prefers-reduced-motion`: when set, the globe must not auto-rotate (static until the user drags it).
- Spanish UI copy throughout (e.g. "Arrastra para rotar • Scroll para zoom", not the original English text).
- No automated test framework exists in this repo (`package.json` has no `test` script). Verification is manual: `npm run build` must succeed, and the dev server must render the section correctly (checked here with a headless Playwright screenshot since interactive browser testing isn't available to the plan executor).
- Only `d3` is a new npm dependency. Do not add any other packages.

---

## File Structure

- Create: `public/data/land-110m.json` — static GeoJSON asset (land polygons, Natural Earth 110m resolution)
- Create: `src/components/RotatingEarth.jsx` — reusable rotating globe canvas component
- Create: `src/components/Availability.jsx` — new section using `RotatingEarth`
- Modify: `src/App.jsx` — import and render `Availability` between `Hero` and `About`
- Modify: `package.json` / `package-lock.json` — add `d3` dependency (via `npm install`, not manual edit)

---

### Task 1: Add local GeoJSON map data asset

**Files:**
- Create: `public/data/land-110m.json`

**Interfaces:**
- Produces: a static file served at runtime from `/data/land-110m.json`, containing a GeoJSON `FeatureCollection` of land polygons. Consumed by `RotatingEarth.jsx` (Task 3) via `fetch("/data/land-110m.json")`.

- [ ] **Step 1: Create the data directory and download the file**

Run:
```bash
mkdir -p public/data
curl -s -o public/data/land-110m.json "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
```

- [ ] **Step 2: Verify the file is valid, non-trivial JSON**

Run:
```bash
node -e "const d = require('./public/data/land-110m.json'); console.log(d.type, d.features.length)"
```
Expected output: `FeatureCollection 127` (or another non-zero feature count — exact count may vary slightly by data source revision, but it must be `FeatureCollection` with more than 100 features, not an HTML error page or empty object).

- [ ] **Step 3: Commit**

```bash
git add public/data/land-110m.json
git commit -m "feat: add local land GeoJSON data for globe component"
```

---

### Task 2: Install d3 dependency

**Files:**
- Modify: `package.json`, `package-lock.json`

**Interfaces:**
- Produces: the `d3` package available for import as `import * as d3 from "d3"` in Task 3.

- [ ] **Step 1: Install d3**

Run:
```bash
npm install d3
```

- [ ] **Step 2: Verify it installed and the dev server still starts cleanly**

Run:
```bash
node -e "console.log(require('./node_modules/d3/package.json').version)"
```
Expected: prints a version string (e.g. `7.9.0`) with no error.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add d3 dependency for globe component"
```

---

### Task 3: Create `RotatingEarth.jsx` component

**Files:**
- Create: `src/components/RotatingEarth.jsx`

**Interfaces:**
- Consumes: `public/data/land-110m.json` (Task 1) via `fetch("/data/land-110m.json")`; `d3` (Task 2).
- Produces: `export default function RotatingEarth({ width = 800, height = 600, className = "" })` — a React component rendering a `<canvas>` with an interactive, auto-rotating globe. Consumed by `Availability.jsx` (Task 4) as `<RotatingEarth width={480} height={480} className="w-full" />`.

- [ ] **Step 1: Write the component**

Create `src/components/RotatingEarth.jsx`:

```jsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const ECUADOR_COORDS = [-79.2, -0.25];

export default function RotatingEarth({ width = 800, height = 600, className = "" }) {
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const containerWidth = Math.min(width, window.innerWidth - 40);
    const containerHeight = Math.min(height, window.innerHeight - 100);
    const radius = Math.min(containerWidth, containerHeight) / 2.5;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    const pointInPolygon = (point, polygon) => {
      const [x, y] = point;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    };

    const pointInFeature = (point, feature) => {
      const geometry = feature.geometry;

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates;
        if (!pointInPolygon(point, coordinates[0])) return false;
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false;
        }
        return true;
      }

      if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) return true;
          }
        }
        return false;
      }

      return false;
    };

    const generateDotsInPolygon = (feature, dotSpacing = 16) => {
      const dots = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;
      const stepSize = dotSpacing * 0.08;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point = [lng, lat];
          if (pointInFeature(point, feature)) {
            dots.push(point);
          }
        }
      }
      return dots;
    };

    const allDots = [];
    let landFeatures = null;
    let pulseElapsed = 0;

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;

      context.beginPath();
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI);
      context.fillStyle = "#0B0D10";
      context.fill();
      context.globalAlpha = 0.4;
      context.strokeStyle = "#F3F4F0";
      context.lineWidth = 2 * scaleFactor;
      context.stroke();
      context.globalAlpha = 1;

      if (!landFeatures) return;

      const graticule = d3.geoGraticule();
      context.beginPath();
      path(graticule());
      context.globalAlpha = 0.15;
      context.strokeStyle = "#F3F4F0";
      context.lineWidth = 1 * scaleFactor;
      context.stroke();
      context.globalAlpha = 1;

      context.beginPath();
      landFeatures.features.forEach((feature) => path(feature));
      context.globalAlpha = 0.5;
      context.strokeStyle = "#F3F4F0";
      context.lineWidth = 1 * scaleFactor;
      context.stroke();
      context.globalAlpha = 1;

      allDots.forEach((dot) => {
        const projected = projection([dot[0], dot[1]]);
        if (
          projected &&
          projected[0] >= 0 &&
          projected[0] <= containerWidth &&
          projected[1] >= 0 &&
          projected[1] <= containerHeight
        ) {
          context.beginPath();
          context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI);
          context.fillStyle = "#8B9097";
          context.fill();
        }
      });

      const pinProjected = projection(ECUADOR_COORDS);
      if (
        pinProjected &&
        pinProjected[0] >= 0 &&
        pinProjected[0] <= containerWidth &&
        pinProjected[1] >= 0 &&
        pinProjected[1] <= containerHeight
      ) {
        const pulseRadius = (3 + Math.sin(pulseElapsed / 300) * 1.5) * scaleFactor;

        context.beginPath();
        context.arc(pinProjected[0], pinProjected[1], pulseRadius * 2.2, 0, 2 * Math.PI);
        context.globalAlpha = 0.35;
        context.strokeStyle = "#C6FF3D";
        context.lineWidth = 1.5 * scaleFactor;
        context.stroke();
        context.globalAlpha = 1;

        context.beginPath();
        context.arc(pinProjected[0], pinProjected[1], 2.5 * scaleFactor, 0, 2 * Math.PI);
        context.fillStyle = "#C6FF3D";
        context.fill();
      }
    };

    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/data/land-110m.json");
        if (!response.ok) throw new Error("Failed to load land data");

        landFeatures = await response.json();

        landFeatures.features.forEach((feature) => {
          generateDotsInPolygon(feature, 16).forEach((dot) => allDots.push(dot));
        });

        render();
        setIsLoading(false);
      } catch {
        setError("No se pudo cargar el mapa mundial");
        setIsLoading(false);
      }
    };

    const rotation = [0, 0];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let autoRotate = !prefersReducedMotion;
    const rotationSpeed = 0.5;

    const tick = (elapsed) => {
      pulseElapsed = elapsed;
      if (autoRotate) {
        rotation[0] += rotationSpeed;
        projection.rotate(rotation);
      }
      render();
    };

    const rotationTimer = d3.timer(tick);

    const handleMouseDown = (event) => {
      autoRotate = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation = [...rotation];

      const handleMouseMove = (moveEvent) => {
        const sensitivity = 0.5;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        rotation[0] = startRotation[0] + dx * sensitivity;
        rotation[1] = Math.max(-90, Math.min(90, startRotation[1] - dy * sensitivity));

        projection.rotate(rotation);
        render();
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        if (!prefersReducedMotion) {
          setTimeout(() => {
            autoRotate = true;
          }, 10);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleWheel = (event) => {
      event.preventDefault();
      const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
      const newRadius = Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * zoomFactor));
      projection.scale(newRadius);
      render();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    loadWorldData();

    return () => {
      rotationTimer.stop();
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [width, height]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-surface rounded-2xl p-8 ${className}`}>
        <p className="text-muted text-sm text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-surface animate-pulse" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-2xl"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <div className="absolute bottom-4 left-4 text-xs text-muted px-2 py-1 rounded-md glass">
        Arrastra para rotar • Scroll para zoom
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it builds with no syntax/lint errors**

Run:
```bash
npm run build
```
Expected: build completes successfully (exit code 0), no errors mentioning `RotatingEarth.jsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/RotatingEarth.jsx
git commit -m "feat: add RotatingEarth globe component"
```

---

### Task 4: Create `Availability.jsx` section

**Files:**
- Create: `src/components/Availability.jsx`

**Interfaces:**
- Consumes: `RotatingEarth` default export from `./RotatingEarth` (Task 3); `motion` from `framer-motion`; `ArrowRight` from `lucide-react`.
- Produces: `export default function Availability()` — a `<section id="disponibilidad">`. Consumed by `App.jsx` (Task 5).

- [ ] **Step 1: Write the component**

Create `src/components/Availability.jsx`:

```jsx
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import RotatingEarth from "./RotatingEarth";

export default function Availability() {
  return (
    <section id="disponibilidad" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-mono text-xs text-lime tracking-widest uppercase mb-5"
            >
              // disponible para trabajar remoto
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-semibold text-3xl sm:text-4xl tracking-tight"
            >
              Trabajo remoto, sin fronteras.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-muted text-base sm:text-lg max-w-md"
            >
              Estoy basado en Ecuador (UTC-5), lo que me da buen solape
              horario con Latinoamérica y gran parte de Estados Unidos, y
              me permite coordinar sin problema de forma asíncrona con
              equipos en Europa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-5"
            >
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs text-muted">
                <span className="w-2 h-2 rounded-full bg-lime" />
                UTC-5 · Ecuador
              </span>

              <a
                href="#contacto"
                className="group flex items-center gap-2 font-medium text-ink"
              >
                Hablemos de tu proyecto
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="glass rounded-2xl p-4 max-w-md mx-auto w-full"
          >
            <RotatingEarth width={480} height={480} className="w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify it builds with no syntax/lint errors**

Run:
```bash
npm run build
```
Expected: build completes successfully (exit code 0), no errors mentioning `Availability.jsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Availability.jsx
git commit -m "feat: add Availability section component"
```

---

### Task 5: Wire `Availability` into `App.jsx`

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `Availability` default export from `./components/Availability` (Task 4).

- [ ] **Step 1: Add the import and render it between Hero and About**

In `src/App.jsx`, change:

```jsx
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
```

to:

```jsx
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Availability from "./components/Availability";
import About from "./components/About";
```

And change:

```jsx
      <main>
        <Hero />
        <About />
```

to:

```jsx
      <main>
        <Hero />
        <Availability />
        <About />
```

- [ ] **Step 2: Verify the build still succeeds**

Run:
```bash
npm run build
```
Expected: exit code 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: render Availability section in App"
```

---

### Task 6: Manual visual verification

No automated test suite exists in this repo. This task confirms the feature actually renders correctly in a real page load — not just that it builds — using a headless browser screenshot, since the plan executor cannot open a real browser window for the user.

**Files:** none (verification only, no code changes)

- [ ] **Step 1: Start the dev server**

Run (in the background, since it doesn't exit on its own):
```bash
npm run dev
```
Expected: prints `VITE ... ready in ...ms` and `Local: http://localhost:5173/` with no errors.

- [ ] **Step 2: Load the page in a headless browser and check for runtime errors**

Using Playwright (or an equivalent headless browser tool), navigate to `http://localhost:5173/`, wait for network idle, and capture:
- Any `console` messages of type `error`
- Any `pageerror` events (uncaught JS exceptions)
- Any `requestfailed` events (e.g. a 404 on `/data/land-110m.json`)

Expected: none of the above. If `/data/land-110m.json` 404s, re-check Task 1 — the file must be at `public/data/land-110m.json` so Vite serves it at `/data/land-110m.json`.

- [ ] **Step 3: Confirm the section renders with expected content**

In the same browser session, evaluate `document.getElementById('disponibilidad')` and confirm:
- It exists (the section mounted)
- It contains the text "Trabajo remoto, sin fronteras."
- It contains a `<canvas>` element with non-zero `width`/`height` attributes (the globe actually drew something, not a blank 0×0 canvas)

- [ ] **Step 4: Take a screenshot for visual confirmation**

Capture a screenshot of the `#disponibilidad` section specifically and inspect it: the globe should show a dark sphere with a white/light dotted outline of continents and a small lime-green pin roughly over South America (Ecuador). Confirm nothing looks broken (no giant unstyled text, no overlapping elements, no missing canvas).

- [ ] **Step 5: Stop the dev server**

Terminate the background `npm run dev` process started in Step 1.

No commit for this task — it's verification only.

# Sección "Disponibilidad Remota" con globo 3D — Design

**Fecha:** 2026-07-20
**Estado:** Aprobado

## Contexto

Erick quiere reforzar en su portfolio el mensaje de que está disponible para
trabajar remoto con clientes/equipos de cualquier parte del mundo, no solo en
Ecuador. Se integrará un componente de globo 3D rotatorio (basado en D3
`geoOrthographic`, dibujado en `<canvas>`) como pieza visual central de una
nueva sección dedicada a esto.

El punto de partida fue un prompt de integración de componente estilo
shadcn/v0 (`RotatingEarth`, en TSX, pensado para Next.js + Tailwind 4 +
shadcn). El proyecto actual es Vite + React con JSX plano (no TypeScript),
Tailwind 3, y un sistema de diseño propio (paleta lime/cyan sobre fondo
oscuro `#0B0D10`), sin shadcn. El diseño de abajo adapta el componente a
esas convenciones en vez de copiarlo tal cual.

## Alcance

1. Componente `RotatingEarth.jsx` reutilizable.
2. Nueva sección `Availability.jsx` que lo usa.
3. Inserción de la sección en `App.jsx` entre `Hero` y `About`.
4. Datos del mapa mundial servidos localmente desde `public/data`.

Fuera de alcance: cambios a otras secciones existentes, i18n, modo claro.

## Componente `RotatingEarth.jsx`

Ubicación: `src/components/RotatingEarth.jsx` (junto a los demás
componentes — el proyecto no usa la carpeta `components/ui` de shadcn, así
que no se crea).

Adaptaciones respecto al componente original pegado por el usuario:

- Se quita `"use client"` (no aplica fuera de Next.js).
- Se convierte de TSX a JSX: se eliminan las anotaciones de tipos
  (`RotatingEarthProps`, genéricos, `: any`, etc.). Las props siguen siendo
  `width`, `height`, `className` con los mismos valores por defecto
  (800×600).
- Colores recalculados sobre la paleta del proyecto
  (`tailwind.config.js`) en vez del blanco/negro puro del original:
  - Fondo del globo (océano): `#0B0D10` (`base`)
  - Borde del globo y contorno de tierra: `#F3F4F0` (`ink`) a opacidad baja
  - Graticule (líneas de latitud/longitud): `#F3F4F0` a ~15% opacidad
  - Puntos halftone sobre tierra: `#8B9097` (`muted`)
  - Pin de Ecuador: `#C6FF3D` (`lime`), con un anillo pulsante alrededor
    dibujado con el mismo `d3.timer` que maneja la auto-rotación (sin
    dependencias nuevas)
- El pin de Ecuador se ubica en las coordenadas aproximadas de Santo
  Domingo/Quito (`lng: -79.2, lat: -0.25`) y solo se dibuja cuando el punto
  está en el hemisferio visible (mismo chequeo de bounds que ya usa el
  componente para los dots).
- Se elimina el bloque de error/loading con clases `dark` hardcodeadas del
  original (el sitio entero es dark-only, no hace falta ese wrapper
  condicional). En su lugar, mientras carga se muestra un placeholder
  simple (círculo con `animate-pulse` de Tailwind) y en error un mensaje
  de texto discreto con `text-muted`, ambos ya coherentes con el resto del
  sitio.
- Fetch del GeoJSON: en vez de `fetch("https://raw.githubusercontent.com/...")`
  en cada carga, se hace `fetch("/data/land-110m.json")` contra el propio
  dominio. El archivo se descarga una vez durante esta tarea y se guarda en
  `public/data/land-110m.json`.
- Se mantiene toda la lógica de interacción sin cambios: arrastrar con el
  mouse para rotar, scroll para zoom, auto-rotación (`rotationSpeed = 0.5`)
  cuando no se está interactuando, `devicePixelRatio` para nitidez.
- Se eliminan los `console.log` de depuración (`[v0] ...`) del original —
  no correspondientes a producción.

## Componente `Availability.jsx`

Ubicación: `src/components/Availability.jsx`.

Sigue el mismo patrón visual que `Hero.jsx` y `Contact.jsx`: eyebrow en
`font-mono` mayúsculas con color `lime`, heading en `font-display`, párrafo
en `text-muted`, animaciones de entrada con `framer-motion`
(`whileInView`, `viewport={{ once: true }}`, mismo timing que el resto del
sitio: `duration: 0.6-0.7`, `y` entre 10-30px).

Layout: `<section>` con `grid lg:grid-cols-2 gap-16 items-center` (mismo
grid que Hero, pero con el texto a la izquierda y el globo a la derecha —
invertido respecto al Hero, que tiene el Terminal a la derecha).

Contenido:
- Eyebrow: `// disponible para trabajar remoto`
- Heading (`h2`, mismo tamaño que en Contact: `text-3xl sm:text-4xl`):
  "Trabajo remoto, sin fronteras."
- Párrafo: explica que Erick está en Ecuador (UTC-5), lo que da buen
  solape horario con Latinoamérica y buena parte de EE. UU., y que
  trabaja bien de forma asíncrona con equipos en Europa.
- Badge inline estilo los `stats` del Hero (mismo componente visual, no
  reutiliza código de Hero, solo el patrón): `UTC-5 · Ecuador`.
- CTA: enlace `Hablemos de tu proyecto` con `ArrowRight` de `lucide-react`
  apuntando a `#contacto`, mismo estilo que el CTA secundario del Hero.
- A la derecha: `<RotatingEarth className="w-full max-w-md mx-auto" />`
  dentro de un contenedor `glass rounded-2xl p-4` para que combine con las
  demás tarjetas del sitio (Hero stats, Contact card).

Sin marcadores adicionales ni arcos hacia otras regiones — solo el pin de
Ecuador (decisión ya tomada en brainstorming).

## Integración en `App.jsx`

```jsx
import Hero from "./components/Hero";
import Availability from "./components/Availability";
import About from "./components/About";
```

Se inserta `<Availability />` entre `<Hero />` y `<About />` en el orden de
renderizado de `<main>`.

## Dependencias

- `d3` (nueva, npm): usada para `geoOrthographic`, `geoPath`, `geoGraticule`,
  `geoBounds`, `timer`. Es la única dependencia nueva — `framer-motion` y
  `lucide-react` ya están instaladas.
- No se toca `tailwind.config.js` ni `index.css`: no hace falta ningún
  theme de shadcn/CSS variables (`--card`, `--primary`, etc.) porque el
  componente usa colores hardcodeados que ya corresponden a la paleta
  Tailwind existente del proyecto, no clases utilitarias `bg-primary`, etc.

## Datos

`public/data/land-110m.json`: GeoJSON de tierra emergida a 110m de
resolución (Natural Earth), descargado una sola vez desde
`raw.githubusercontent.com/martynafford/natural-earth-geojson` y commiteado
al repo como asset estático.

## Responsive / accesibilidad

- El `<canvas>` ya es responsive vía el cálculo de `containerWidth`/
  `containerHeight` basado en `window.innerWidth` — se mantiene igual.
- Se respeta la preferencia `prefers-reduced-motion` ya definida
  globalmente en `index.css` para transiciones CSS/Framer Motion, pero la
  auto-rotación del globo (animada por `d3.timer`, no CSS) no se ve
  afectada por esa media query. Se añade un chequeo:
  `window.matchMedia("(prefers-reduced-motion: reduce)").matches` para
  desactivar la auto-rotación (dejar el globo estático hasta que el
  usuario interactúe) cuando el usuario tiene esa preferencia activada.
- El texto "Drag to rotate • Scroll to zoom" del original se traduce a
  "Arrastra para rotar • Scroll para zoom".

## Testing

No hay suite de tests automatizados en este proyecto (`package.json` no
define `test`). Verificación manual: `npm run dev`, revisar la sección en
viewport desktop y mobile, confirmar drag/zoom, confirmar que el pin de
Ecuador aparece al rotar, y confirmar que `npm run build` no falla.

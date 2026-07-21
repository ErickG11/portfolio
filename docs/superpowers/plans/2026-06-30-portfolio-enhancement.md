# Portfolio Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich the portfolio with real CV data, new Certifications section, categorized Skills tabs, Anfibius experience card, languages card, and a tech ticker animation — keeping 100% of the existing dark-glass visual design.

**Architecture:** All changes are React component-level (JSX + Tailwind + Framer Motion + GSAP). No new dependencies. New components are isolated files; existing components receive targeted edits only. The order of implementation goes bottom-up: CSS globals → shared atoms → section components → App wiring.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 3, Framer Motion 12, GSAP 3, Lucide React, no test suite (visual portfolio — verification is `npm run dev` + browser check).

## Global Constraints

- Never use `any` or remove TypeScript types (project is JSX, so no TS — maintain PropTypes-style discipline with clearly named props)
- Preserve existing Tailwind color tokens: `lime` = #C6FF3D, `cyan` = #3DE8FF, `violet` = #9B6BFF, `coral` = #FF6B6B
- Preserve `.glass` utility class for all cards
- All new sections must use the existing `SectionHeading` component from `About.jsx`
- Framer Motion `whileInView` must use `viewport={{ once: true }}` to avoid re-animating on scroll-up
- No new npm packages — use only installed deps (framer-motion, gsap, lucide-react)
- Real email: `grandaerick.m@gmail.com` · Real GitHub: `ErickG11`

---

### Task 1: CSS marquee animation + tailwind config

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: CSS class `.animate-marquee` usable in any component

- [ ] **Step 1: Add keyframe + utility to index.css**

Open `src/index.css` and add after the existing `@tailwind utilities;` block:

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 28s linear infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.animate-blink {
  animation: blink 1s step-end infinite;
}
```

> Note: `.animate-blink` already exists via Tailwind's `animate-pulse` variant in the Terminal component — check if removing the duplicate causes issues. If `animate-blink` was defined in CSS before, it stays; if not, add it here. Either way do not remove `animate-blob` — that class is used in Contact and Terminal.

- [ ] **Step 2: Verify dev server compiles with no errors**

```bash
npm run dev
```

Expected: No CSS errors in terminal. Browser shows portfolio unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style: add marquee and blink keyframe animations"
```

---

### Task 2: Ticker component (infinite tech marquee)

**Files:**
- Create: `src/components/Ticker.jsx`
- Modify: `src/components/Hero.jsx`

**Interfaces:**
- Produces: `<Ticker />` — zero props, self-contained
- Consumes: `.animate-marquee` CSS class from Task 1

- [ ] **Step 1: Create `src/components/Ticker.jsx`**

```jsx
const techs = [
  "JavaScript", ".NET", "Flutter", "Python",
  "Java", "Dart", "Supabase", "SQL Server",
  "MongoDB", "Power BI", "Git", "Scrum",
  "HTML / CSS", "React", "C",
];

export default function Ticker() {
  const items = [...techs, ...techs]; // duplicate for seamless loop

  return (
    <div className="relative overflow-hidden mt-10 py-4 border-y border-border">
      {/* fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to right, #0B0D10, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to left, #0B0D10, transparent)" }} />

      <div className="flex animate-marquee w-max gap-0">
        {items.map((tech, i) => (
          <span
            key={i}
            className="font-mono text-xs text-muted uppercase tracking-widest px-6 border-r border-border last:border-none whitespace-nowrap"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add Ticker to Hero.jsx**

In `src/components/Hero.jsx`:

1. Import at top: `import Ticker from "./Ticker";`
2. Update the stats value for technologies: change `"6+"` → `"10+"` in the `stats` array
3. Add `<Ticker />` immediately after the closing `</motion.div>` of the stats block (before the closing `</div>` of `mx-auto max-w-6xl`):

```jsx
// After the stats motion.div, before </div> that closes max-w-6xl:
<Ticker />
```

The final bottom of the Hero JSX should look like:

```jsx
        </motion.div>

        <Ticker />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Expected: Ticker renders below the stats bar, tech names scroll infinitely left, fade masks hide edges cleanly.

- [ ] **Step 4: Commit**

```bash
git add src/components/Ticker.jsx src/components/Hero.jsx
git commit -m "feat: add infinite tech ticker to Hero section"
```

---

### Task 3: About — Anfibius card + Idiomas card + contact fixes

**Files:**
- Modify: `src/components/About.jsx`

**Interfaces:**
- Consumes: existing `BentoCard` component (already in About.jsx)
- Consumes: Framer Motion `motion` (already imported)
- Consumes: `MapPin`, `Mail` from lucide-react (already imported)
- Consumes: `GithubIcon` from `./Icons` (already imported)

- [ ] **Step 1: Replace the full About.jsx content**

Replace `src/components/About.jsx` with:

```jsx
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { GithubIcon } from "./Icons";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show:  { opacity: 1, y: 0  },
};

function BentoCard({ dot, label, className = "", children, delay = 0 }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={`glass rounded-2xl p-6 flex flex-col ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="font-medium text-sm">{label}</span>
      </div>
      {children}
    </motion.div>
  );
}

function LanguageBar({ lang, level, flag }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-sm">
        <span>{flag} {lang}</span>
        <span className="text-muted font-mono text-xs">{level}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: level === "Nativo" ? "100%" : "65%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full bg-cyan"
        />
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="// sobre-mi" title="Quién está detrás del código" />

        <div className="grid md:grid-cols-3 gap-5 mt-12">

          {/* About me */}
          <BentoCard dot="bg-lime" label="About me" className="md:col-span-2" delay={0}>
            <p className="text-ink/90 text-lg leading-relaxed">
              22 años, basado en Quito, Ecuador. Estudiante de Ingeniería de Software
              próximo a graduarme. Me apasiona convertir ideas en productos digitales
              funcionales — desde sitios institucionales hasta apps móviles completas
              con backend propio.
            </p>
            <p className="text-muted text-sm mt-4">
              Cuando no estoy programando, probablemente esté en el gym
              entrenando calistenia o revisando gráficos de inversión.
            </p>
          </BentoCard>

          {/* Ubicación */}
          <BentoCard dot="bg-cyan" label="Ubicación" delay={0.05}>
            <div className="flex items-center gap-2 text-ink/90">
              <MapPin className="w-4 h-4 text-cyan" />
              <span>Quito, Ecuador</span>
            </div>
            <p className="text-muted text-sm mt-3">
              Disponible para trabajo remoto en cualquier zona horaria.
            </p>
          </BentoCard>

          {/* Anfibius — experiencia */}
          <BentoCard dot="bg-violet" label="Experiencia" className="md:col-span-2" delay={0.1}>
            <div className="flex gap-4">
              {/* timeline line */}
              <div className="flex flex-col items-center pt-1">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="w-2.5 h-2.5 rounded-full bg-violet ring-4 ring-violet/20"
                />
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5, transformOrigin: "top" }}
                  className="w-px flex-1 bg-violet/30 mt-2 origin-top"
                />
                <div className="w-1.5 h-1.5 rounded-full bg-violet/30 mt-2" />
              </div>

              <div>
                <p className="font-semibold text-ink">Anfibius</p>
                <p className="text-violet text-sm font-medium">Pasante — Desarrollo Móvil</p>
                <p className="text-muted text-xs mt-1">Santo Domingo, Ecuador</p>
                <p className="text-ink/80 text-sm mt-3 leading-relaxed">
                  Desarrollo de aplicación móvil multiplataforma con .NET MAUI,
                  integrando funcionalidades de negocio para el área interna de la empresa.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {[".NET MAUI", "C#", ".NET"].map((t) => (
                    <span key={t} className="font-mono text-xs px-3 py-1 rounded-full border border-violet/30 text-violet">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Idiomas */}
          <BentoCard dot="bg-cyan" label="Idiomas" delay={0.15}>
            <div className="flex flex-col gap-4">
              <LanguageBar lang="Español" level="Nativo" flag="🇪🇨" />
              <LanguageBar lang="Inglés" level="Intermedio" flag="🇺🇸" />
            </div>
          </BentoCard>

          {/* Actualmente */}
          <BentoCard dot="bg-violet" label="Actualmente" delay={0.2}>
            <p className="text-ink/90">
              Construyendo <span className="text-violet font-medium">NEON</span>,
              una app de productividad y finanzas en Flutter + Supabase.
            </p>
          </BentoCard>

          {/* Disponibilidad */}
          <BentoCard dot="bg-coral" label="Disponibilidad" delay={0.25}>
            <p className="text-ink/90">
              Abierto a <span className="text-coral font-medium">empleo full-time</span>{" "}
              y proyectos <span className="text-coral font-medium">freelance</span>.
            </p>
            <span className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border border-coral/40 text-coral">
              ● Disponible ahora
            </span>
          </BentoCard>

          {/* Contacto */}
          <BentoCard dot="bg-lime" label="Contacto" delay={0.3}>
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:grandaerick.m@gmail.com" className="flex items-center gap-2 hover:text-lime transition-colors">
                <Mail className="w-4 h-4" /> grandaerick.m@gmail.com
              </a>
              <a href="https://github.com/ErickG11" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-lime transition-colors">
                <GithubIcon className="w-4 h-4" /> github.com/ErickG11
              </a>
            </div>
          </BentoCard>

          {/* Descargar CV */}
          <a
            href="#contacto"
            className="glass rounded-2xl p-6 flex flex-col justify-between hover:bg-lime/10 transition-colors group"
          >
            <span className="font-medium text-sm text-muted">CV / Currículum</span>
            <div className="flex items-center justify-between mt-6">
              <span className="font-display text-xl font-semibold">Descargar CV</span>
              <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title }) {
  return (
    <div>
      <p className="font-mono text-xs text-lime tracking-widest uppercase">{eyebrow}</p>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-3 tracking-tight">
        {title}
      </h2>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Expected:
- About section shows 8 cards in bento grid
- Anfibius card has animated vertical timeline line on scroll
- Idiomas card shows two animated progress bars
- Contact info shows real email and ErickG11 GitHub link

- [ ] **Step 3: Commit**

```bash
git add src/components/About.jsx
git commit -m "feat: expand About bento grid with Anfibius experience and languages cards"
```

---

### Task 4: Skills — category tabs with GSAP ring re-animation

**Files:**
- Modify: `src/components/Skills.jsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger` (already installed)
- Consumes: `SectionHeading` from `./About`
- Produces: `<Skills />` — same export name, same section id `#skills`

- [ ] **Step 1: Replace Skills.jsx with tabbed version**

Replace `src/components/Skills.jsx` with:

```jsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "./About";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    label: "Lenguajes",
    skills: [
      { name: "JavaScript", level: 85, color: "#C6FF3D" },
      { name: "Dart",       level: 75, color: "#3DE8FF" },
      { name: ".NET",       level: 70, color: "#9B6BFF" },
      { name: "Python",     level: 65, color: "#FF6B6B" },
      { name: "Java",       level: 65, color: "#C6FF3D" },
      { name: "C",          level: 60, color: "#3DE8FF" },
    ],
  },
  {
    label: "Web & DB",
    skills: [
      { name: "HTML / CSS", level: 90, color: "#C6FF3D" },
      { name: "Supabase",   level: 70, color: "#3DE8FF" },
      { name: "SQL Server", level: 65, color: "#9B6BFF" },
      { name: "MongoDB",    level: 60, color: "#FF6B6B" },
    ],
  },
  {
    label: "Herramientas",
    skills: [
      { name: "Git",      level: 78, color: "#C6FF3D" },
      { name: "Power BI", level: 65, color: "#3DE8FF" },
      { name: "Excel",    level: 60, color: "#9B6BFF" },
    ],
  },
  {
    label: "Metodologías",
    skills: [
      { name: "Scrum", level: 75, color: "#C6FF3D" },
    ],
  },
];

const RADIUS = 36;
const CIRC = 2 * Math.PI * RADIUS;

function SkillRing({ name, level, color, index, animate }) {
  const circleRef = useRef(null);

  useEffect(() => {
    if (!animate) return;
    const el = circleRef.current;
    if (!el) return;
    const offset = CIRC - (level / 100) * CIRC;

    gsap.set(el, { strokeDashoffset: CIRC });
    gsap.to(el, {
      strokeDashoffset: offset,
      duration: 1.4,
      delay: index * 0.08,
      ease: "power3.out",
    });
  }, [animate, level, index]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" className="-rotate-90">
          <circle cx="48" cy="48" r={RADIUS} stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
          <circle
            ref={circleRef}
            cx="48" cy="48" r={RADIUS}
            stroke={color} strokeWidth="6" fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display font-semibold text-sm">
          {level}%
        </div>
      </div>
      <span className="text-sm text-muted font-medium text-center">{name}</span>
    </div>
  );
}

export default function Skills() {
  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(true);
  const sectionRef = useRef(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => setSectionVisible(true),
    });
    return () => trigger.kill();
  }, []);

  const handleTab = (i) => {
    setAnimate(false);
    setActive(i);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(sectionVisible));
    });
  };

  return (
    <section id="skills" ref={sectionRef} className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="// stack" title="Con qué construyo" />

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-10">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => handleTab(i)}
              className={`font-mono text-xs px-4 py-2 rounded-full border transition-all duration-200 ${
                active === i
                  ? "border-lime text-lime bg-lime/10"
                  : "border-border text-muted hover:border-lime/40 hover:text-ink"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Ring grid */}
        <div className="mt-8 glass rounded-2xl p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
          {categories[active].skills.map((s, i) => (
            <SkillRing
              key={`${active}-${s.name}`}
              index={i}
              animate={animate && sectionVisible}
              {...s}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Expected:
- 4 tab buttons render above the rings grid
- Active tab has lime border + background tint
- Clicking a tab swaps the skills and re-animates rings from 0
- Section still animates on first scroll-into-view

- [ ] **Step 3: Commit**

```bash
git add src/components/Skills.jsx
git commit -m "feat: add category tabs to Skills section with GSAP re-animation"
```

---

### Task 5: Certifications section

**Files:**
- Create: `src/components/Certifications.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `SectionHeading` from `./About`
- Consumes: `motion` from `framer-motion`
- Consumes: `ArrowUpRight` from `lucide-react`
- Produces: `<Certifications />` — default export, section id `#certificaciones`

- [ ] **Step 1: Create `src/components/Certifications.jsx`**

```jsx
import { motion } from "framer-motion";
import { SectionHeading } from "./About";

const certs = [
  {
    title: "Generative AI Foundation",
    issuer: "Pearson / Certiport",
    date: "Dic 2025",
    accent: "cyan",
    accentHex: "#3DE8FF",
    icon: "🤖",
  },
  {
    title: "Analista de Datos con Power BI",
    issuer: "Udemy + Microsoft",
    date: "Dic 2025",
    accent: "violet",
    accentHex: "#9B6BFF",
    icon: "📊",
  },
  {
    title: "Software Processes & Agile Practices",
    issuer: "University of Alberta · Coursera",
    date: "Jun 2022",
    accent: "lime",
    accentHex: "#C6FF3D",
    icon: "🎓",
  },
  {
    title: "Design Thinking",
    issuer: "CIMA · Colombia",
    date: "Nov 2025",
    accent: "coral",
    accentHex: "#FF6B6B",
    icon: "💡",
  },
  {
    title: "Master ASP.NET MVC (.NET 8 y 9)",
    issuer: "Udemy",
    date: "2025",
    accent: "lime",
    accentHex: "#C6FF3D",
    icon: "⚡",
  },
];

const accentBorder = {
  lime:   "hover:border-lime/60   hover:shadow-lime/10",
  cyan:   "hover:border-cyan/60   hover:shadow-cyan/10",
  violet: "hover:border-violet/60 hover:shadow-violet/10",
  coral:  "hover:border-coral/60  hover:shadow-coral/10",
};

const accentText = {
  lime:   "text-lime",
  cyan:   "text-cyan",
  violet: "text-violet",
  coral:  "text-coral",
};

export default function Certifications() {
  return (
    <section id="certificaciones" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="// certificaciones" title="Lo que he aprendido" />

        <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {certs.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`glass rounded-2xl p-6 flex flex-col border border-transparent transition-all duration-300 hover:shadow-xl ${accentBorder[c.accent]}`}
              style={{ "--glow": c.accentHex }}
            >
              {/* icon + date row */}
              <div className="flex items-start justify-between">
                <span className="text-3xl">{c.icon}</span>
                <span className="font-mono text-xs text-muted">{c.date}</span>
              </div>

              {/* title */}
              <h3 className="font-display font-semibold text-lg mt-4 leading-snug">
                {c.title}
              </h3>

              {/* issuer badge */}
              <div className="mt-auto pt-5 flex items-center justify-between">
                <span className={`font-mono text-xs px-2 py-1 rounded-full border ${
                  c.accent === "lime"   ? "border-lime/30 text-lime" :
                  c.accent === "cyan"   ? "border-cyan/30 text-cyan" :
                  c.accent === "violet" ? "border-violet/30 text-violet" :
                                         "border-coral/30 text-coral"
                }`}>
                  {c.issuer}
                </span>
              </div>
            </motion.div>
          ))}

          {/* placeholder CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl border border-dashed border-border p-6 flex flex-col justify-center items-center text-center gap-2 hover:border-lime/40 transition-colors"
          >
            <span className="text-2xl">📚</span>
            <p className="font-medium text-muted text-sm">Siempre aprendiendo</p>
            <p className="text-xs text-muted/60">Más certificaciones en camino</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire Certifications into App.jsx**

In `src/App.jsx`:
1. Add import: `import Certifications from "./components/Certifications";`
2. Add `<Certifications />` between `<Skills />` and `<Projects />`:

```jsx
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Certifications from "./components/Certifications";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="bg-base min-h-screen font-body text-ink">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Certifications />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Add Certificaciones link to Navbar**

In `src/components/Navbar.jsx`, update the `links` array:

```jsx
const links = [
  { label: "Sobre mí",        href: "#about"           },
  { label: "Skills",          href: "#skills"          },
  { label: "Certificaciones", href: "#certificaciones" },
  { label: "Proyectos",       href: "#proyectos"       },
  { label: "Contacto",        href: "#contacto"        },
];
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected:
- Certifications section renders between Skills and Projects
- 5 cert cards + 1 "siempre aprendiendo" card
- Hovering card lifts and shows colored border glow
- Navbar has new Certificaciones link that scrolls correctly

- [ ] **Step 5: Commit**

```bash
git add src/components/Certifications.jsx src/App.jsx src/components/Navbar.jsx
git commit -m "feat: add Certifications section with animated glass cards"
```

---

### Task 6: Contact section — update placeholder info

**Files:**
- Modify: `src/components/Contact.jsx`

**Interfaces:**
- No interface changes — cosmetic data update only

- [ ] **Step 1: Replace placeholder email and GitHub in Contact.jsx**

In `src/components/Contact.jsx`, replace:
- `tu-correo@gmail.com` → `grandaerick.m@gmail.com` (both the `href` and the visible text)
- `https://github.com/tu-usuario` → `https://github.com/ErickG11`
- `https://linkedin.com/in/tu-usuario` → keep as-is (user didn't provide LinkedIn)

Final Contact.jsx:

```jsx
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export default function Contact() {
  return (
    <section id="contacto" className="px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime/20 rounded-full blur-3xl animate-blob" />

          <p className="font-mono text-xs text-lime tracking-widest uppercase relative">
            // contacto
          </p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4 tracking-tight relative">
            ¿Hablamos de tu próximo proyecto?
          </h2>
          <p className="text-muted mt-4 max-w-md mx-auto relative">
            Disponible para empleo full-time y proyectos freelance.
            Respondo en menos de 24 horas.
          </p>

          <a
            href="mailto:grandaerick.m@gmail.com"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-lime text-base font-semibold px-7 py-3.5 hover:scale-105 transition-transform"
          >
            <Mail className="w-4 h-4" />
            grandaerick.m@gmail.com
          </a>

          <div className="relative flex items-center justify-center gap-5 mt-8">
            <a href="https://github.com/ErickG11" target="_blank" rel="noreferrer" className="text-muted hover:text-ink transition-colors">
              <GithubIcon className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/tu-usuario" target="_blank" rel="noreferrer" className="text-muted hover:text-ink transition-colors">
              <LinkedinIcon className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Expected: Contact section shows real email and ErickG11 GitHub link.

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.jsx
git commit -m "fix: update contact section with real email and GitHub ErickG11"
```

---

## Self-Review

**Spec coverage:**
- [x] Hero ticker → Task 2
- [x] Hero stat `10+ Tecnologías` → Task 2
- [x] About Anfibius card → Task 3
- [x] About Idiomas card → Task 3
- [x] About real contact info → Task 3
- [x] Skills category tabs → Task 4
- [x] Skills GSAP re-animation on tab switch → Task 4
- [x] Certifications section (5 certs) → Task 5
- [x] Certifications in Navbar → Task 5
- [x] Contact real email/github → Task 6
- [x] CSS marquee animation → Task 1

**Placeholder scan:** No TBDs. All code blocks complete. No "similar to Task N" references.

**Type consistency:** `SectionHeading` export used consistently from `./About` across Skills, Certifications. `animate` prop in `SkillRing` is boolean, passed consistently. `BentoCard` props unchanged from original.

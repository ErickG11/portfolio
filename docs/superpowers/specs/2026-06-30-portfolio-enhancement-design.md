# Portfolio Enhancement Design
**Date:** 2026-06-30  
**Status:** Approved

## Goal
Enrich the existing portfolio with real CV data, a new Certifications section, reorganized Skills by category, an Anfibius work experience card inside About, and a tech ticker animation. Keep 100% of the current visual design (dark theme, lime/cyan accents, glassmorphism).

---

## 1. Hero — Ticker de tecnologías

- Update stat `"6+ Tecnologías"` → `"10+ Tecnologías"`
- Add infinite horizontal marquee below the stats block with tech names: JavaScript · .NET · Flutter · Python · Java · Dart · Supabase · SQL Server · MongoDB · Power BI · Git · Scrum
- Marquee uses CSS `@keyframes marquee` (duplicated list for seamless loop), fade masks on both edges via `mask-image: linear-gradient`
- No new dependencies needed

## 2. About — Bento grid expanded (8 cards)

Grid stays `md:grid-cols-3`. Cards:

| # | Label | Content | Size |
|---|-------|---------|------|
| 1 | About me | Updated description (próximo a graduarse) | col-span-2 |
| 2 | Ubicación | Quito, Ecuador + remoto | 1 col |
| 3 | Anfibius *(new)* | Pasante dev móvil · .NET MAUI · Santo Domingo. Mini vertical timeline with animated pulsing dot. dot color: violet | col-span-2 |
| 4 | Idiomas *(new)* | Español 🇪🇨 nativo · Inglés 🇺🇸 intermedio. Progress bars animated on scroll. | 1 col |
| 5 | Actualmente | NEON app in Flutter + Supabase | 1 col |
| 6 | Disponibilidad | full-time + freelance badge | 1 col |
| 7 | Contacto | grandaerick.m@gmail.com + github.com/ErickG11 | 1 col |
| 8 | Descargar CV | Arrow link | 1 col |

Fix placeholder emails to `grandaerick.m@gmail.com` and GitHub to `ErickG11`.

## 3. Skills — Category tabs

4 tabs: `Lenguajes` · `Web & DB` · `Herramientas` · `Metodologías`

Tab content:
- **Lenguajes:** JavaScript 85%, Dart 75%, .NET 70%, Python 65%, Java 65%, C 60%
- **Web & DB:** HTML/CSS 90%, Supabase 70%, SQL Server 65%, MongoDB 60%
- **Herramientas:** Git 78%, Power BI 65%, Excel 60%
- **Metodologías:** Scrum 75%

Tab switching triggers GSAP stagger re-animation on the rings. Active tab indicator: lime underline.

## 4. Certifications — New section (between Skills and Projects)

Section eyebrow: `// certificaciones` · title: `Lo que he aprendido`

Grid `md:grid-cols-3`, 5 cards:

| Cert | Issuer | Date | Badge color |
|------|--------|------|-------------|
| Generative AI Foundation | Pearson / Certiport | Dic 2025 | cyan |
| Analista de Datos con Power BI | Udemy + Microsoft | Dic 2025 | violet |
| Software Processes & Agile Practices | University of Alberta (Coursera) | Jun 2022 | lime |
| Design Thinking | CIMA · Colombia | Nov 2025 | coral |
| Master ASP.NET MVC (.NET 8 y 9) | Udemy | — | lime |

Card anatomy: issuer badge (colored dot + name) · cert title · date chip · hover: scale-105 + border color glow.

## 5. Contact + Footer

- Update all placeholder emails → `grandaerick.m@gmail.com`
- Update GitHub links → `github.com/ErickG11`
- LinkedIn: keep placeholder (not provided)
- Footer: no changes

---

## Animation summary

| Element | Animation |
|---------|-----------|
| Tech ticker | CSS infinite marquee, fade edges |
| Anfibius timeline | Framer Motion vertical line draw + pulsing dot |
| Language bars | GSAP width tween on ScrollTrigger enter |
| Skills tabs | GSAP stagger ring re-animation on tab change |
| Cert cards | Framer Motion whileHover scale + box-shadow glow |
| All new sections | Existing scroll fade-up pattern (motion.div whileInView) |

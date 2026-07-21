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
    const el = circleRef.current;
    if (!el) return;

    gsap.set(el, { strokeDashoffset: CIRC });

    if (!animate) return;

    gsap.to(el, {
      strokeDashoffset: CIRC - (level / 100) * CIRC,
      duration: 1.4,
      delay: index * 0.08,
      ease: "power3.out",
    });
  }, [animate, level, index]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" className="-rotate-90">
          <circle
            cx="48" cy="48" r={RADIUS}
            stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none"
          />
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
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => setAnimate(true),
    });
    return () => trigger.kill();
  }, []);

  const handleTab = (i) => {
    setAnimate(false);
    setActive(i);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true))
    );
  };

  return (
    <section id="skills" ref={sectionRef} className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="// stack" title="Con qué construyo" />

        <div className="flex flex-wrap gap-2 mt-10">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => handleTab(i)}
              className={`font-mono text-xs px-4 py-2 rounded-full border transition-all duration-200 ${
                active === i
                  ? "border-lime text-lime-ink bg-lime/10"
                  : "border-border text-muted hover:border-lime/40 hover:text-ink"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mt-8 glass rounded-2xl p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
          {categories[active].skills.map((s, i) => (
            <SkillRing
              key={`${active}-${s.name}`}
              index={i}
              animate={animate}
              {...s}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

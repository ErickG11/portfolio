import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const links = [
  { label: "Sobre mí",        href: "#about"           },
  { label: "Skills",          href: "#skills"          },
  { label: "Certificaciones", href: "#certificaciones" },
  { label: "Proyectos",       href: "#proyectos"       },
  { label: "Contacto",        href: "#contacto"        },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <nav
        className={`mx-auto max-w-5xl flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${
          scrolled ? "glass shadow-lg shadow-black/40" : ""
        }`}
      >
        <a href="#hero" className="font-display font-semibold text-lg tracking-tight">
          erick<span className="text-lime">.</span>dev
        </a>

        <ul className="hidden md:flex items-center gap-8 font-body text-sm text-muted">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-ink transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contacto"
          className="rounded-full bg-lime text-base font-semibold text-sm px-5 py-2 hover:scale-105 transition-transform"
        >
          Hablemos
        </a>
      </nav>
    </motion.header>
  );
}

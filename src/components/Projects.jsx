import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./About";

const projects = [
  {
    name: "Gas Solutions",
    role: "Sitio web institucional",
    description:
      "Sitio web de 3 páginas para una empresa de equipos petroleros en Santo Domingo, Ecuador. Construido con HTML/CSS puro, con mapa interactivo y catálogo de productos.",
    tags: ["HTML", "CSS", "Leaflet.js", "cPanel"],
    link: "https://gassolpro.com",
    linkLabel: "Ver sitio en vivo",
    accent: "lime",
  },
  {
    name: "NEON",
    role: "App de productividad y finanzas",
    description:
      "Aplicación Flutter multiplataforma (móvil y escritorio) con seguimiento de gastos, hábitos y tareas. Autenticación y almacenamiento de datos con Supabase.",
    tags: ["Flutter", "Dart", "Supabase"],
    link: null,
    linkLabel: "En desarrollo",
    accent: "cyan",
  },
];

export default function Projects() {
  return (
    <section id="proyectos" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="// proyectos" title="Lo que he construido" />

        <div className="mt-14 flex flex-col gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-8 md:p-10 grid md:grid-cols-[1fr,auto] gap-8 items-start"
            >
              <div>
                <p className={`font-mono text-xs uppercase tracking-widest ${
                  p.accent === "lime" ? "text-lime-ink" : "text-cyan-ink"
                }`}>
                  {p.role}
                </p>
                <h3 className="font-display font-semibold text-2xl sm:text-3xl mt-2">
                  {p.name}
                </h3>
                <p className="text-muted mt-4 max-w-xl leading-relaxed">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs px-3 py-1 rounded-full border border-border text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:self-center">
                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 rounded-full bg-lime text-base font-semibold px-5 py-3 hover:scale-105 transition-transform whitespace-nowrap"
                  >
                    {p.linkLabel}
                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  </a>
                ) : (
                  <span className="flex items-center gap-2 rounded-full border border-border text-muted px-5 py-3 whitespace-nowrap text-sm font-medium">
                    {p.linkLabel}
                  </span>
                )}
              </div>
            </motion.div>
          ))}

          {/* CTA card inviting the next project */}
          <motion.a
            href="#contacto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-dashed border-border p-8 md:p-10 flex items-center justify-between hover:border-lime/50 transition-colors group"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                // próximo proyecto
              </p>
              <h3 className="font-display font-semibold text-xl sm:text-2xl mt-2">
                ¿Tienes una idea? Construyámosla juntos.
              </h3>
            </div>
            <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform shrink-0" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}

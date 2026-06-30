import { motion } from "framer-motion";
import { SectionHeading } from "./About";

const certs = [
  {
    title: "Generative AI Foundation",
    issuer: "Pearson / Certiport",
    date: "Dic 2025",
    accent: "cyan",
    icon: "🤖",
  },
  {
    title: "Analista de Datos con Power BI",
    issuer: "Udemy + Microsoft",
    date: "Dic 2025",
    accent: "violet",
    icon: "📊",
  },
  {
    title: "Software Processes & Agile Practices",
    issuer: "University of Alberta · Coursera",
    date: "Jun 2022",
    accent: "lime",
    icon: "🎓",
  },
  {
    title: "Design Thinking",
    issuer: "CIMA · Colombia",
    date: "Nov 2025",
    accent: "coral",
    icon: "💡",
  },
  {
    title: "Master ASP.NET MVC (.NET 8 y 9)",
    issuer: "Udemy",
    date: "2025",
    accent: "lime",
    icon: "⚡",
  },
];

const accentClasses = {
  lime:   { border: "hover:border-lime/60",   badge: "border-lime/30 text-lime",   shadow: "hover:shadow-lime/10"   },
  cyan:   { border: "hover:border-cyan/60",   badge: "border-cyan/30 text-cyan",   shadow: "hover:shadow-cyan/10"   },
  violet: { border: "hover:border-violet/60", badge: "border-violet/30 text-violet", shadow: "hover:shadow-violet/10" },
  coral:  { border: "hover:border-coral/60",  badge: "border-coral/30 text-coral",  shadow: "hover:shadow-coral/10"  },
};

export default function Certifications() {
  return (
    <section id="certificaciones" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="// certificaciones" title="Lo que he aprendido" />

        <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {certs.map((c, i) => {
            const cls = accentClasses[c.accent];
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`glass rounded-2xl p-6 flex flex-col border border-transparent transition-all duration-300 hover:shadow-xl ${cls.border} ${cls.shadow}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{c.icon}</span>
                  <span className="font-mono text-xs text-muted">{c.date}</span>
                </div>

                <h3 className="font-display font-semibold text-lg mt-4 leading-snug">
                  {c.title}
                </h3>

                <div className="mt-auto pt-5">
                  <span className={`font-mono text-xs px-2 py-1 rounded-full border ${cls.badge}`}>
                    {c.issuer}
                  </span>
                </div>
              </motion.div>
            );
          })}

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

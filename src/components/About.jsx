import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { GithubIcon } from "./Icons";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0  },
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
      <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
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
              <MapPin className="w-4 h-4 text-cyan-ink" />
              <span>Quito, Ecuador</span>
            </div>
            <p className="text-muted text-sm mt-3">
              Disponible para trabajo remoto en cualquier zona horaria.
            </p>
          </BentoCard>

          {/* Anfibius — experiencia */}
          <BentoCard dot="bg-violet" label="Experiencia" className="md:col-span-2" delay={0.1}>
            <div className="flex gap-4">
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
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="w-px flex-1 bg-violet/30 mt-2 origin-top"
                />
                <div className="w-1.5 h-1.5 rounded-full bg-violet/30 mt-2" />
              </div>

              <div>
                <p className="font-semibold text-ink">Anfibius</p>
                <p className="text-violet-ink text-sm font-medium">Pasante — Desarrollo Móvil</p>
                <p className="text-muted text-xs mt-1">Santo Domingo, Ecuador</p>
                <p className="text-ink/80 text-sm mt-3 leading-relaxed">
                  Desarrollo de aplicación móvil multiplataforma con .NET MAUI,
                  integrando funcionalidades de negocio para el área interna de la empresa.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {[".NET MAUI", "C#", ".NET"].map((t) => (
                    <span key={t} className="font-mono text-xs px-3 py-1 rounded-full border border-violet/30 text-violet-ink">
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
              Construyendo <span className="text-violet-ink font-medium">NEON</span>,
              una app de productividad y finanzas en Flutter + Supabase.
            </p>
          </BentoCard>

          {/* Disponibilidad */}
          <BentoCard dot="bg-coral" label="Disponibilidad" delay={0.25}>
            <p className="text-ink/90">
              Abierto a <span className="text-coral-ink font-medium">empleo full-time</span>{" "}
              y proyectos <span className="text-coral-ink font-medium">freelance</span>.
            </p>
            <span className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border border-coral/40 text-coral-ink">
              ● Disponible ahora
            </span>
          </BentoCard>

          {/* Contacto */}
          <BentoCard dot="bg-lime" label="Contacto" delay={0.3}>
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:grandaerick.m@gmail.com" className="flex items-center gap-2 hover:text-lime-ink transition-colors">
                <Mail className="w-4 h-4" /> grandaerick.m@gmail.com
              </a>
              <a href="https://github.com/ErickG11" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-lime-ink transition-colors">
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
      <p className="font-mono text-xs text-lime-ink tracking-widest uppercase">{eyebrow}</p>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-3 tracking-tight">
        {title}
      </h2>
    </div>
  );
}

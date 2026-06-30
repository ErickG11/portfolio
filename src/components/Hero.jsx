import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Terminal from "./Terminal";
import Ticker from "./Ticker";

const stats = [
  { value: "2+",  label: "Años programando" },
  { value: "2",   label: "Proyectos en producción" },
  { value: "10+", label: "Tecnologías" },
  { value: "UIO", label: "Quito, Ecuador" },
];

export default function Hero() {
  return (
    <section id="hero" className="relative pt-40 pb-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-xs text-lime tracking-widest uppercase mb-5"
            >
              $ whoami
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-semibold text-5xl sm:text-6xl leading-[1.05] tracking-tight"
            >
              Construyo software
              <br />
              que la gente <span className="text-gradient">realmente usa.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-muted text-base sm:text-lg max-w-md"
            >
              Soy Erick, desarrollador web y mobile. Diseño y construyo
              productos digitales de principio a fin — desde la interfaz
              hasta el backend.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-5"
            >
              <a
                href="#proyectos"
                className="rounded-full bg-lime text-base font-semibold px-6 py-3 hover:scale-105 transition-transform"
              >
                Ver proyectos
              </a>
              <a
                href="#contacto"
                className="group flex items-center gap-2 font-medium text-ink"
              >
                Hablemos de tu proyecto
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Terminal />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass mt-20 rounded-2xl px-8 py-7 grid grid-cols-2 sm:grid-cols-4 gap-8"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display font-semibold text-2xl sm:text-3xl">
                {s.value}
              </p>
              <p className="text-muted text-xs sm:text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <Ticker />
      </div>
    </section>
  );
}

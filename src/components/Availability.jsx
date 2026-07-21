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
            <RotatingEarth className="w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

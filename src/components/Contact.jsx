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

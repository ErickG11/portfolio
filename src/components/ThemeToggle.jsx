import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const [theme, toggleTheme] = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
      className="glass relative w-9 h-9 rounded-full flex items-center justify-center overflow-hidden shrink-0"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isLight ? (
            <Sun className="w-4 h-4 text-lime-ink" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-ink" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

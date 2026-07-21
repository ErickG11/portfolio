/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0B0D10",
        page: "var(--color-page)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        lime: "#C6FF3D",
        cyan: "#3DE8FF",
        violet: "#9B6BFF",
        coral: "#FF6B6B",
        "lime-ink": "var(--color-lime-ink)",
        "cyan-ink": "var(--color-cyan-ink)",
        "violet-ink": "var(--color-violet-ink)",
        "coral-ink": "var(--color-coral-ink)",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(20px,-30px) scale(1.1)" },
          "66%": { transform: "translate(-15px,15px) scale(0.95)" },
        },
        blink: {
          "0%, 49%": { opacity: 1 },
          "50%, 100%": { opacity: 0 },
        },
      },
      animation: {
        blob: "blob 12s infinite ease-in-out",
        blink: "blink 1s step-start infinite",
      },
    },
  },
  plugins: [],
};

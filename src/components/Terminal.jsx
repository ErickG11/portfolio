import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const snippets = [
  {
    lang: "dart",
    lines: [
      "class HabitTracker extends StatelessWidget {",
      "  final Supabase db;",
      "",
      "  Future<void> markDone(String id) async {",
      "    await db.from('habits').update(",
      "      {'completed': true}",
      "    ).eq('id', id);",
      "  }",
      "}",
    ],
  },
  {
    lang: "javascript",
    lines: [
      "const deploy = async () => {",
      "  await git.pull('origin', 'main');",
      "  console.log('gassolpro.com ✓ live');",
      "};",
      "",
      "deploy();",
    ],
  },
];

export default function Terminal() {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const current = snippets[snippetIndex];

  useEffect(() => {
    const line = current.lines[visibleLines];
    if (line === undefined) {
      const timeout = setTimeout(() => {
        setSnippetIndex((i) => (i + 1) % snippets.length);
        setVisibleLines(0);
        setCharIndex(0);
      }, 2200);
      return () => clearTimeout(timeout);
    }

    if (charIndex < line.length) {
      const timeout = setTimeout(() => setCharIndex((c) => c + 1), 18);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setVisibleLines((v) => v + 1);
        setCharIndex(0);
      }, 120);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, visibleLines, current]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      className="relative w-full max-w-md"
    >
      {/* glow blobs behind */}
      <div className="absolute -top-10 -right-10 w-56 h-56 bg-lime/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-cyan/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="relative glass rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <span className="w-3 h-3 rounded-full bg-coral/70" />
          <span className="w-3 h-3 rounded-full bg-lime/70" />
          <span className="w-3 h-3 rounded-full bg-cyan/70" />
          <span className="ml-3 text-xs text-muted font-mono">
            {current.lang === "dart" ? "neon_app.dart" : "deploy.js"}
          </span>
        </div>
        <pre className="p-5 text-xs sm:text-sm font-mono leading-relaxed min-h-[220px] overflow-hidden">
          {current.lines.slice(0, visibleLines).map((l, i) => (
            <div key={i}>
              <Highlighted text={l} />
            </div>
          ))}
          {current.lines[visibleLines] !== undefined && (
            <div>
              <Highlighted text={current.lines[visibleLines].slice(0, charIndex)} />
              <span className="inline-block w-2 h-4 bg-lime align-middle ml-0.5 animate-blink" />
            </div>
          )}
        </pre>
      </div>
    </motion.div>
  );
}

function Highlighted({ text }) {
  const keywords = ["class", "const", "extends", "Future", "async", "await", "final"];
  const parts = text.split(/(\s+)/);
  return (
    <>
      {parts.map((p, i) =>
        keywords.includes(p) ? (
          <span key={i} className="text-violet-ink">{p}</span>
        ) : p.includes("'") ? (
          <span key={i} className="text-lime-ink">{p}</span>
        ) : (
          <span key={i} className="text-ink/80">{p}</span>
        )
      )}
    </>
  );
}

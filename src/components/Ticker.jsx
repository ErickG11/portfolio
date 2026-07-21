const techs = [
  "JavaScript", ".NET", "Flutter", "Python",
  "Java", "Dart", "Supabase", "SQL Server",
  "MongoDB", "Power BI", "Git", "Scrum",
  "HTML / CSS", "React", "C",
];

export default function Ticker() {
  const items = [...techs, ...techs];

  return (
    <div className="relative overflow-hidden mt-10 py-4 border-y border-border">
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--color-page), transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--color-page), transparent)" }}
      />

      <div className="flex animate-marquee w-max gap-0">
        {items.map((tech, i) => (
          <span
            key={i}
            className="font-mono text-xs text-muted uppercase tracking-widest px-6 border-r border-border last:border-none whitespace-nowrap"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

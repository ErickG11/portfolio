export default function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-border">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p className="font-mono">erick.dev — © {new Date().getFullYear()}</p>
        <p>Diseñado y construido por Erick en Quito, Ecuador 🇪🇨</p>
      </div>
    </footer>
  );
}

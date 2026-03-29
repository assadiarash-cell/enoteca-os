export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent-primary">404</h1>
        <p className="mt-4 text-lg text-text-secondary">Pagina non trovata</p>
        <a href="/" className="mt-6 inline-block text-accent-secondary hover:underline">
          Torna alla home
        </a>
      </div>
    </div>
  );
}

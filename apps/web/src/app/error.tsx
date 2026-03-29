'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-danger">500</h1>
        <p className="mt-4 text-lg text-text-secondary">Qualcosa è andato storto</p>
        <button
          onClick={() => reset()}
          className="mt-6 inline-block rounded-md bg-accent-primary px-6 py-2 text-white"
        >
          Riprova
        </button>
      </div>
    </div>
  );
}

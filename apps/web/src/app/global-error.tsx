'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="it">
      <body style={{ background: '#07070D', color: '#EEECE7', fontFamily: 'system-ui' }}>
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#DC4545' }}>Errore</h1>
            <p style={{ marginTop: '1rem', fontSize: '1.125rem', color: '#A09E96' }}>
              Qualcosa è andato storto
            </p>
            <button
              onClick={() => reset()}
              style={{
                marginTop: '1.5rem',
                padding: '0.5rem 1.5rem',
                background: '#C9843A',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Riprova
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

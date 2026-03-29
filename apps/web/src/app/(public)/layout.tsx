import Link from 'next/link';
import { Wine } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border-subtle glass-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-copper-gradient">
              <Wine className="h-4 w-4 text-white" />
            </div>
            <span className="text-body-lg font-semibold tracking-tight text-text-primary">
              ENOTECA OS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#come-funziona"
              className="text-body-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Come funziona
            </Link>
            <Link
              href="/valuta"
              className="text-body-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Valuta le tue bottiglie
            </Link>
            <Link
              href="/valuta"
              className="inline-flex h-10 items-center rounded-md bg-copper-gradient px-5 text-body-sm font-medium text-white transition-all hover:brightness-110"
            >
              Inizia ora
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pt-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-copper-gradient">
                  <Wine className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-body-sm font-semibold text-text-primary">
                  ENOTECA OS
                </span>
              </div>
              <p className="text-body-sm text-text-secondary max-w-[240px]">
                La piattaforma per dealer di bottiglie da collezione.
                Valutazione, gestione e vendita in un unico sistema.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-overline uppercase text-text-tertiary">
                Servizi
              </h4>
              <Link href="/valuta" className="text-body-sm text-text-secondary hover:text-text-primary transition-colors">
                Valutazione gratuita
              </Link>
              <Link href="/#come-funziona" className="text-body-sm text-text-secondary hover:text-text-primary transition-colors">
                Come funziona
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-overline uppercase text-text-tertiary">
                Categorie
              </h4>
              <span className="text-body-sm text-text-secondary">Vini pregiati</span>
              <span className="text-body-sm text-text-secondary">Whisky rari</span>
              <span className="text-body-sm text-text-secondary">Cognac & Armagnac</span>
              <span className="text-body-sm text-text-secondary">Rum da collezione</span>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-overline uppercase text-text-tertiary">
                Contatti
              </h4>
              <span className="text-body-sm text-text-secondary">info@enoteca-os.it</span>
              <span className="text-body-sm text-text-secondary">Milano, Italia</span>
            </div>
          </div>

          <div className="mt-10 border-t border-border-subtle pt-6 flex items-center justify-between">
            <span className="text-caption text-text-tertiary">
              &copy; {new Date().getFullYear()} ENOTECA OS. Tutti i diritti riservati.
            </span>
            <div className="flex gap-6">
              <Link href="#" className="text-caption text-text-tertiary hover:text-text-secondary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-caption text-text-tertiary hover:text-text-secondary transition-colors">
                Termini
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

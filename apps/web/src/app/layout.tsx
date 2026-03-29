import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ENOTECA OS — Piattaforma per Collezionisti e Dealer',
  description:
    'ENOTECA OS: la piattaforma SaaS per dealer di bottiglie da collezione. Valutazione AI, gestione inventario, CRM e analytics in un unico sistema.',
  keywords: [
    'vini pregiati',
    'bottiglie da collezione',
    'whisky raro',
    'enoteca',
    'valutazione bottiglie',
    'dealer vini',
  ],
  openGraph: {
    title: 'ENOTECA OS',
    description: 'La piattaforma per dealer di bottiglie da collezione',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="dark">
      <body className="bg-bg-primary text-text-primary font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

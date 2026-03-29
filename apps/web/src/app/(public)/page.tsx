import Link from 'next/link';
import { Camera, MessageSquare, Banknote, ArrowRight, Wine, Shield, Zap, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    title: 'Fotografa',
    description:
      'Scatta qualche foto alle tue bottiglie. La nostra AI le analizzerà in pochi secondi per identificare produttore, annata e condizioni.',
  },
  {
    icon: MessageSquare,
    title: 'Ricevi la valutazione',
    description:
      'Entro 24 ore ricevi una valutazione professionale basata su dati di mercato aggiornati e la nostra esperienza ventennale.',
  },
  {
    icon: Banknote,
    title: 'Vendi alle tue condizioni',
    description:
      'Accetta la nostra offerta, oppure scegli la formula di vendita che preferisci. Pagamento rapido e sicuro.',
  },
];

const stats = [
  { label: 'Bottiglie valutate', value: '12.400+' },
  { label: 'Valore medio deal', value: '€4.800' },
  { label: 'Tempo medio vendita', value: '< 7 giorni' },
  { label: 'Soddisfazione clienti', value: '98%' },
];

const features = [
  {
    icon: Shield,
    title: 'Valutazione certificata',
    description: 'Ogni bottiglia viene verificata da esperti con oltre 20 anni di esperienza nel settore.',
  },
  {
    icon: Zap,
    title: 'AI-powered',
    description: 'Tecnologia di riconoscimento avanzata per identificare istantaneamente le tue bottiglie.',
  },
  {
    icon: TrendingUp,
    title: 'Prezzi di mercato',
    description: 'Accesso a database internazionali per garantire il miglior prezzo possibile.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-32 md:py-44 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-accent-wine/5 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-accent-primary/5 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary/5 px-4 py-1.5">
            <Wine className="h-3.5 w-3.5 text-accent-primary" />
            <span className="text-caption text-accent-secondary">
              Piattaforma #1 in Italia per bottiglie da collezione
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-text-primary">
            Scopri quanto valgono{' '}
            <span className="text-copper-gradient">le tue bottiglie</span>
          </h1>

          <p className="text-body-lg text-text-secondary max-w-xl">
            Valutazione gratuita in 24 ore. Vini pregiati, whisky rari, cognac e rum da collezione.
            Tecnologia AI e 20 anni di esperienza al tuo servizio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/valuta"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-copper-gradient px-8 text-body-lg font-medium text-white transition-all hover:brightness-110 shadow-md"
            >
              Valuta le tue bottiglie
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#come-funziona"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border-medium px-8 text-body-lg font-medium text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
            >
              Come funziona
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border-subtle bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
                <span className="text-title-1 text-copper-gradient font-bold">
                  {stat.value}
                </span>
                <span className="text-caption text-text-tertiary uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="come-funziona" className="py-24 md:py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-overline uppercase text-accent-primary tracking-widest">
              Come funziona
            </span>
            <h2 className="mt-4 text-title-1 md:text-4xl font-bold text-text-primary">
              Tre semplici passaggi
            </h2>
            <p className="mt-4 text-body-lg text-text-secondary max-w-lg mx-auto">
              Dal tuo cellulare al pagamento. Semplice, veloce e trasparente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="group relative flex flex-col items-center gap-5 rounded-lg border border-border-subtle bg-bg-secondary p-8 text-center hover-lift"
              >
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-copper-gradient text-caption font-bold text-white">
                  {i + 1}
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent-primary/10 mb-2">
                  <step.icon className="h-7 w-7 text-accent-primary" />
                </div>
                <h3 className="text-title-3 text-text-primary">{step.title}</h3>
                <p className="text-body-sm text-text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-bg-secondary border-y border-border-subtle">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-wine/10">
                  <feature.icon className="h-6 w-6 text-accent-wine-light" />
                </div>
                <h3 className="text-title-3 text-text-primary">{feature.title}</h3>
                <p className="text-body-sm text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-title-1 md:text-4xl font-bold text-text-primary">
            Pronto a scoprire il valore della tua collezione?
          </h2>
          <p className="mt-4 text-body-lg text-text-secondary">
            Valutazione gratuita, senza impegno. Rispondiamo entro 24 ore.
          </p>
          <Link
            href="/valuta"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-copper-gradient px-8 text-body-lg font-medium text-white transition-all hover:brightness-110 shadow-md"
          >
            Inizia la valutazione
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Wine,
  Upload,
  Phone,
  Star,
  Sparkles,
  Camera,
  Bot,
  Banknote,
  ArrowRight,
  ChevronRight,
  MapPin,
  Mail,
  User,
  X,
} from 'lucide-react';

const steps = [
  {
    icon: Camera,
    emoji: '📸',
    title: 'Scatta una foto',
    description:
      'Fotografa le tue bottiglie con il cellulare. La nostra AI le riconosce in pochi secondi.',
  },
  {
    icon: Bot,
    emoji: '🤖',
    title: 'Valutazione AI',
    description:
      'Il nostro sistema analizza etichetta, annata, produttore e condizioni per darti un prezzo accurato.',
  },
  {
    icon: Banknote,
    emoji: '💰',
    title: 'Pagamento immediato',
    description:
      'Accetta l\'offerta e ricevi il pagamento entro 48 ore. Semplice e trasparente.',
  },
];

const testimonials = [
  {
    name: 'Marco R.',
    location: 'Milano',
    rating: 5,
    text: 'Ho venduto la mia collezione di Barolo in meno di una settimana. Servizio impeccabile e prezzi onesti.',
  },
  {
    name: 'Giulia T.',
    location: 'Roma',
    rating: 5,
    text: 'Avevo ereditato una cantina piena di bottiglie e non sapevo il loro valore. ENOTECA OS mi ha aiutato a capire tutto.',
  },
  {
    name: 'Alessandro B.',
    location: 'Firenze',
    rating: 5,
    text: 'La valutazione AI è incredibilmente precisa. Ho confrontato con altri esperti e i prezzi erano in linea.',
  },
];

const blogPosts = [
  {
    title: 'Come conservare il vino: guida completa',
    excerpt:
      'Scopri le migliori pratiche per conservare le tue bottiglie e mantenerne il valore nel tempo.',
    date: '15 Mar 2026',
    readTime: '5 min',
  },
  {
    title: 'I 10 vini italiani più ricercati nel 2026',
    excerpt:
      'Dal Sassicaia al Barolo Monfortino: ecco le bottiglie che i collezionisti cercano di più.',
    date: '10 Mar 2026',
    readTime: '8 min',
  },
  {
    title: 'Vendere vino online: cosa sapere',
    excerpt:
      'Normative, consigli e best practice per vendere le tue bottiglie in modo sicuro e legale.',
    date: '5 Mar 2026',
    readTime: '6 min',
  },
];

const provinces = [
  'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Arezzo', 'Ascoli Piceno',
  'Asti', 'Avellino', 'Bari', 'Belluno', 'Benevento', 'Bergamo', 'Biella',
  'Bologna', 'Bolzano', 'Brescia', 'Brindisi', 'Cagliari', 'Caltanissetta',
  'Campobasso', 'Caserta', 'Catania', 'Catanzaro', 'Chieti', 'Como',
  'Cosenza', 'Cremona', 'Crotone', 'Cuneo', 'Enna', 'Fermo', 'Ferrara',
  'Firenze', 'Foggia', 'Genova', 'Gorizia', 'Grosseto', 'Imperia',
  'Isernia', 'La Spezia', 'Lecce', 'Lecco', 'Livorno', 'Lodi', 'Lucca',
  'Macerata', 'Mantova', 'Messina', 'Milano', 'Modena', 'Napoli', 'Novara',
  'Nuoro', 'Oristano', 'Padova', 'Palermo', 'Parma', 'Pavia', 'Perugia',
  'Pesaro e Urbino', 'Pescara', 'Piacenza', 'Pisa', 'Pistoia', 'Pordenone',
  'Potenza', 'Prato', 'Ragusa', 'Ravenna', 'Reggio Calabria', 'Reggio Emilia',
  'Rieti', 'Rimini', 'Roma', 'Rovigo', 'Salerno', 'Sassari', 'Savona',
  'Siena', 'Siracusa', 'Sondrio', 'Taranto', 'Teramo', 'Terni', 'Torino',
  'Trapani', 'Trento', 'Treviso', 'Trieste', 'Udine', 'Varese', 'Venezia',
  'Verbano-Cusio-Ossola', 'Vercelli', 'Verona', 'Vibo Valentia', 'Vicenza', 'Viterbo',
];

export default function SellerPortalPage() {
  const [view, setView] = useState<'landing' | 'upload'>('landing');
  const [saleType, setSaleType] = useState<'immediate' | 'auction' | 'consignment'>('immediate');
  const [province, setProvince] = useState('');

  if (view === 'upload') {
    return (
      <div className="min-h-screen bg-[#07070D] text-[#EEECE7]">
        {/* Header */}
        <header className="border-b border-white/10 px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-2 text-[#EEECE7] hover:text-[#C9843A] transition-colors"
            >
              <Wine className="h-6 w-6 text-[#C9843A]" />
              <span className="text-lg font-bold">ENOTECA OS</span>
            </button>
            <button
              onClick={() => setView('landing')}
              className="rounded-lg p-2 hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-6 py-12">
          <h1 className="text-3xl font-bold mb-2">Vendi le tue bottiglie</h1>
          <p className="text-[#EEECE7]/60 mb-10">
            Carica le foto e ricevi una valutazione entro 24 ore.
          </p>

          {/* Photo Upload */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium text-[#EEECE7]/80">
              Foto delle bottiglie
            </label>
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-[#0D0D15] p-12 hover:border-[#C9843A]/50 transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9843A]/10">
                  <Upload className="h-7 w-7 text-[#C9843A]" />
                </div>
                <p className="text-sm font-medium">Trascina le foto qui oppure clicca per caricare</p>
                <p className="text-xs text-[#EEECE7]/40">JPG, PNG fino a 10MB ciascuna</p>
              </div>
            </div>
          </div>

          {/* Province */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium text-[#EEECE7]/80">
              <MapPin className="mr-1 inline h-4 w-4" />
              Provincia
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0D0D15] px-4 py-3 text-[#EEECE7] outline-none focus:border-[#C9843A] transition-colors"
            >
              <option value="">Seleziona provincia</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Sale Type */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium text-[#EEECE7]/80">
              Tipo di vendita
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'immediate' as const, label: 'Vendita immediata', desc: 'Pagamento in 48h' },
                { key: 'auction' as const, label: 'Asta', desc: 'Miglior prezzo' },
                { key: 'consignment' as const, label: 'Conto vendita', desc: 'Nessun rischio' },
              ].map((type) => (
                <button
                  key={type.key}
                  onClick={() => setSaleType(type.key)}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    saleType === type.key
                      ? 'border-[#C9843A] bg-[#C9843A]/10'
                      : 'border-white/10 bg-[#0D0D15] hover:border-white/20'
                  }`}
                >
                  <p className="text-sm font-medium">{type.label}</p>
                  <p className="mt-1 text-xs text-[#EEECE7]/50">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="mb-8 space-y-4">
            <label className="mb-1 block text-sm font-medium text-[#EEECE7]/80">
              I tuoi contatti
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EEECE7]/40" />
              <input
                type="text"
                placeholder="Nome e cognome"
                className="w-full rounded-lg border border-white/10 bg-[#0D0D15] py-3 pl-10 pr-4 text-[#EEECE7] outline-none placeholder:text-[#EEECE7]/30 focus:border-[#C9843A] transition-colors"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EEECE7]/40" />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-white/10 bg-[#0D0D15] py-3 pl-10 pr-4 text-[#EEECE7] outline-none placeholder:text-[#EEECE7]/30 focus:border-[#C9843A] transition-colors"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EEECE7]/40" />
              <input
                type="tel"
                placeholder="Telefono (opzionale)"
                className="w-full rounded-lg border border-white/10 bg-[#0D0D15] py-3 pl-10 pr-4 text-[#EEECE7] outline-none placeholder:text-[#EEECE7]/30 focus:border-[#C9843A] transition-colors"
              />
            </div>
            <textarea
              placeholder="Note aggiuntive (opzionale)"
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-[#0D0D15] px-4 py-3 text-[#EEECE7] outline-none placeholder:text-[#EEECE7]/30 focus:border-[#C9843A] transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <button className="w-full rounded-lg bg-[#C9843A] py-4 text-base font-semibold text-white transition-all hover:brightness-110 shadow-lg shadow-[#C9843A]/20">
            Invia richiesta di valutazione
          </button>
          <p className="mt-4 text-center text-xs text-[#EEECE7]/40">
            Riceverai una risposta entro 24 ore lavorative.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#07070D] text-[#EEECE7]">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-32 md:py-44 overflow-hidden">
        {/* Dark background placeholder for hero image */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1020] via-[#0D0D15] to-[#07070D]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070D] via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9843A]/20 bg-[#C9843A]/5 px-4 py-1.5">
            <Wine className="h-3.5 w-3.5 text-[#C9843A]" />
            <span className="text-xs text-[#EEECE7]/70">
              Piattaforma #1 in Italia per bottiglie da collezione
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Scopri quanto valgono{' '}
            <span className="text-[#C9843A]">le tue bottiglie</span>
          </h1>

          <p className="text-lg text-[#EEECE7]/60 max-w-xl">
            Valutazione gratuita in 24 ore. Vini pregiati, whisky rari, cognac e rum da collezione.
            Tecnologia AI e 20 anni di esperienza al tuo servizio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={() => setView('upload')}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#C9843A] px-8 text-base font-semibold text-white transition-all hover:brightness-110 shadow-lg shadow-[#C9843A]/20"
            >
              <Upload className="h-4 w-4" />
              Valuta le tue bottiglie
            </button>
            <a
              href="#come-funziona"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 px-8 text-base font-medium text-[#EEECE7]/80 hover:text-[#EEECE7] hover:border-white/20 transition-all"
            >
              Come funziona
            </a>
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section id="come-funziona" className="py-24 md:py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-xs uppercase text-[#C9843A] tracking-widest font-semibold">
              Come funziona
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">
              Tre semplici passaggi
            </h2>
            <p className="mt-4 text-lg text-[#EEECE7]/60 max-w-lg mx-auto">
              Dal tuo cellulare al pagamento. Semplice, veloce e trasparente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="group relative flex flex-col items-center gap-5 rounded-xl border border-white/5 bg-[#0D0D15] p-8 text-center transition-all hover:border-[#C9843A]/20 hover:-translate-y-1"
              >
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#C9843A] text-xs font-bold text-white">
                  {i + 1}
                </div>
                <div className="text-4xl mb-2">{step.emoji}</div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-[#EEECE7]/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#0D0D15]/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-xs uppercase text-[#C9843A] tracking-widest font-semibold">
              Testimonianze
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">
              Cosa dicono i nostri clienti
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-white/5 bg-[#0D0D15] p-8 transition-all hover:border-[#C9843A]/20"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#C9843A] text-[#C9843A]" />
                  ))}
                </div>
                <p className="text-sm text-[#EEECE7]/70 leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9843A]/10 text-sm font-bold text-[#C9843A]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-[#EEECE7]/40">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="text-xs uppercase text-[#C9843A] tracking-widest font-semibold">
                Dal nostro blog
              </span>
              <h2 className="mt-4 text-3xl font-bold">
                Ultime dal mondo del vino
              </h2>
            </div>
            <Link
              href="#"
              className="hidden md:inline-flex items-center gap-1 text-sm text-[#C9843A] hover:underline"
            >
              Vedi tutti gli articoli
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="group rounded-xl border border-white/5 bg-[#0D0D15] overflow-hidden transition-all hover:border-[#C9843A]/20 hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-[#1a1020] to-[#0D0D15]" />
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs text-[#EEECE7]/40">
                    <span>{post.date}</span>
                    <span className="h-1 w-1 rounded-full bg-[#EEECE7]/20" />
                    <span>{post.readTime} lettura</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[#C9843A] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#EEECE7]/50 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="#"
              className="inline-flex items-center gap-1 text-sm text-[#C9843A] hover:underline"
            >
              Vedi tutti gli articoli
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Sparkles className="mx-auto mb-6 h-10 w-10 text-[#C9843A]" />
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto a scoprire il valore della tua collezione?
          </h2>
          <p className="mt-4 text-lg text-[#EEECE7]/60">
            Valutazione gratuita, senza impegno. Rispondiamo entro 24 ore.
          </p>
          <button
            onClick={() => setView('upload')}
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#C9843A] px-8 text-base font-semibold text-white transition-all hover:brightness-110 shadow-lg shadow-[#C9843A]/20"
          >
            Inizia la valutazione
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0D0D15] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Wine className="h-6 w-6 text-[#C9843A]" />
                <span className="text-lg font-bold">ENOTECA OS</span>
              </div>
              <p className="text-sm text-[#EEECE7]/40 leading-relaxed">
                La piattaforma intelligente per la compravendita di bottiglie rare e da collezione.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-[#EEECE7]/80">Servizi</h4>
              <ul className="space-y-3 text-sm text-[#EEECE7]/40">
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">Valutazione</Link></li>
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">Vendita</Link></li>
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">Acquisto</Link></li>
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">Consulenza</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-[#EEECE7]/80">Risorse</h4>
              <ul className="space-y-3 text-sm text-[#EEECE7]/40">
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">Guida ai prezzi</Link></li>
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">Contatti</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-[#EEECE7]/80">Legale</h4>
              <ul className="space-y-3 text-sm text-[#EEECE7]/40">
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">Termini di Servizio</Link></li>
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-[#EEECE7] transition-colors">P.IVA</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8">
            <p className="text-xs text-[#EEECE7]/30">
              &copy; 2026 ENOTECA OS. Tutti i diritti riservati.
            </p>
            <p className="text-xs text-[#EEECE7]/30">
              Made with <Sparkles className="inline h-3 w-3 text-[#C9843A]" /> in Italy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

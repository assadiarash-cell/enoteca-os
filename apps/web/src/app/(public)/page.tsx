'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Upload, Phone, Star, Wine, Sparkles, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: '\uD83D\uDCF8',
    title: 'Scatta una foto',
    description: 'Carica le immagini delle tue bottiglie',
  },
  {
    number: 2,
    icon: '\uD83E\uDD16',
    title: 'Valutazione AI',
    description: 'Analisi automatica in 90 secondi',
  },
  {
    number: 3,
    icon: '\uD83D\uDCB0',
    title: 'Pagamento immediato',
    description: 'Offerta e ritiro in 24-48 ore',
  },
];

const testimonials = [
  {
    name: 'Marco Rossi',
    location: 'Milano',
    rating: 5,
    text: 'Servizio eccellente! Ho venduto una collezione ereditata in meno di una settimana. Valutazione accurata e pagamento immediato.',
  },
  {
    name: 'Elena Bianchi',
    location: 'Roma',
    rating: 5,
    text: "Professionali e veloci. L'AI ha identificato correttamente tutte le bottiglie, anche quelle pi\u00F9 rare.",
  },
  {
    name: 'Giuseppe Verdi',
    location: 'Torino',
    rating: 5,
    text: 'Ho svuotato la cantina del ristorante. Ottimo prezzo e ritiro a domicilio senza problemi.',
  },
];

const articles = [
  {
    image: 'https://images.unsplash.com/photo-1677684025416-925ef298ebd5?w=400',
    category: 'Guide',
    title: 'Come conservare bottiglie rare: la guida completa',
  },
  {
    image: 'https://images.unsplash.com/photo-1717449361883-bda3da0629e7?w=400',
    category: 'Mercato',
    title: 'Barolo vintage: trend di mercato 2026',
  },
  {
    image: 'https://images.unsplash.com/photo-1772442034167-462f7553016b?w=400',
    category: 'Investimenti',
    title: 'Whisky da collezione: i migliori investimenti',
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
  const [saleType, setSaleType] = useState('');
  const [province, setProvince] = useState('');

  if (view === 'upload') {
    return (
      <div className="min-h-screen bg-[#07070D]">
        {/* Header */}
        <div className="border-b border-[rgba(255,255,255,0.06)]">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3 mb-2">
              <Wine className="w-8 h-8 text-[#C9843A]" strokeWidth={1.5} />
              <h1 className="text-[24px] font-bold text-[#EEECE7]">ENOTECA OS</h1>
            </div>
            <p className="text-[14px] text-[#A09E96]">Valutazione gratuita</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-[28px] font-bold text-[#EEECE7] mb-2 text-center">
              Richiedi valutazione
            </h2>
            <p className="text-[16px] text-[#A09E96] mb-8 text-center">
              Compila il form e ricevi un&apos;offerta entro 24 ore
            </p>

            <div className="space-y-6">
              {/* Upload Area */}
              <div>
                <label className="block text-[14px] font-medium text-[#A09E96] mb-2">
                  Foto delle bottiglie *
                </label>
                <div className="w-full min-h-[200px] bg-[#0D0D15] border-2 border-dashed border-[rgba(255,255,255,0.12)] rounded-xl flex flex-col items-center justify-center gap-3 p-8 hover:border-[#C9843A]/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-[#6B6963]" strokeWidth={1.5} />
                  <div className="text-center">
                    <p className="text-[16px] text-[#EEECE7] mb-1">
                      Trascina le immagini qui
                    </p>
                    <p className="text-[14px] text-[#6B6963]">
                      oppure clicca per sfogliare
                    </p>
                  </div>
                  <button className="px-6 h-10 bg-[#C9843A] hover:bg-[#D4A05A] text-[#07070D] rounded-lg font-medium text-[14px] transition-all">
                    Scatta foto
                  </button>
                </div>
              </div>

              {/* Province */}
              <div>
                <label className="block text-[14px] font-medium text-[#A09E96] mb-2">
                  Provincia *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full h-12 bg-[#1C1C2A] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 text-[16px] text-[#EEECE7] focus:outline-none focus:border-[#C9843A]/50 focus:ring-2 focus:ring-[#C9843A]/20"
                >
                  <option value="">Seleziona provincia</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Sale Type */}
              <div>
                <label className="block text-[14px] font-medium text-[#A09E96] mb-2">
                  Tipo di vendita *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Eredit\u00E0', 'Cantina privata', 'Ristorante/bar', 'Altro'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSaleType(type)}
                      className={`h-12 bg-[#0D0D15] hover:bg-[#14141F] border text-[#EEECE7] rounded-xl font-medium text-[14px] transition-all ${
                        saleType === type
                          ? 'border-[#C9843A] bg-[#C9843A]/10'
                          : 'border-[rgba(255,255,255,0.06)] hover:border-[#C9843A]/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-medium text-[#A09E96] mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    placeholder="Il tuo nome"
                    className="w-full h-12 bg-[#1C1C2A] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 text-[16px] text-[#EEECE7] placeholder:text-[#6B6963] focus:outline-none focus:border-[#C9843A]/50 focus:ring-2 focus:ring-[#C9843A]/20"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#A09E96] mb-2">
                    Telefono *
                  </label>
                  <input
                    type="tel"
                    placeholder="+39 123 456 7890"
                    className="w-full h-12 bg-[#1C1C2A] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 text-[16px] text-[#EEECE7] placeholder:text-[#6B6963] focus:outline-none focus:border-[#C9843A]/50 focus:ring-2 focus:ring-[#C9843A]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#A09E96] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="tua@email.com"
                  className="w-full h-12 bg-[#1C1C2A] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 text-[16px] text-[#EEECE7] placeholder:text-[#6B6963] focus:outline-none focus:border-[#C9843A]/50 focus:ring-2 focus:ring-[#C9843A]/20"
                />
              </div>

              {/* Submit */}
              <button className="w-full h-14 bg-[#C9843A] hover:bg-[#D4A05A] text-[#07070D] rounded-xl font-medium text-[16px] transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                Richiedi valutazione gratuita
              </button>

              <p className="text-center text-[12px] text-[#6B6963]">
                Riceverai un&apos;offerta entro 24 ore via WhatsApp o email
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070D]">
      {/* Hero */}
      <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1765850257843-aa029ab7769c?w=1600"
            alt="Wine cellar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07070D]/80 via-[#07070D]/60 to-[#07070D]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Wine className="w-12 h-12 text-[#C9843A]" strokeWidth={1.5} />
            <h1 className="text-[32px] md:text-[48px] font-extrabold text-[#EEECE7]">
              ENOTECA OS
            </h1>
          </div>

          <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#EEECE7] mb-4 leading-tight">
            Scopri quanto valgono<br />le tue bottiglie
          </h2>

          <p className="text-[18px] text-[#A09E96] mb-8 max-w-2xl mx-auto">
            Valutazione AI gratuita in 90 secondi. Offerta immediata e ritiro a domicilio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView('upload')}
              className="w-full sm:w-auto px-8 h-14 bg-[#C9843A] hover:bg-[#D4A05A] text-[#07070D] rounded-xl font-medium text-[16px] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" strokeWidth={1.5} />
              Valutazione gratuita
            </button>
            <a
              href="tel:8006660406"
              className="w-full sm:w-auto px-8 h-14 bg-[#0D0D15] hover:bg-[#14141F] border border-[rgba(255,255,255,0.06)] text-[#EEECE7] rounded-xl font-medium text-[16px] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" strokeWidth={1.5} />
              Chiama 800 66 0406
            </a>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-[28px] font-bold text-[#EEECE7] mb-12 text-center">
          Come funziona
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#C9843A]/10 rounded-2xl border border-[#C9843A]/20 flex items-center justify-center">
                <span className="text-[40px]">{step.icon}</span>
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#C9843A] text-[#07070D] font-bold text-[14px] mb-3">
                {step.number}
              </div>
              <h4 className="text-[20px] font-semibold text-[#EEECE7] mb-2">
                {step.title}
              </h4>
              <p className="text-[14px] text-[#A09E96]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-[#0D0D15] border-y border-[rgba(255,255,255,0.06)]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h3 className="text-[28px] font-bold text-[#EEECE7] mb-12 text-center">
            Cosa dicono i nostri clienti
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-[#14141F] rounded-xl p-6 border border-[rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[#C9843A] fill-[#C9843A]" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-[14px] text-[#EEECE7] mb-4 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <p className="text-[14px] font-semibold text-[#EEECE7]">
                    {testimonial.name}
                  </p>
                  <p className="text-[12px] text-[#6B6963]">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-[28px] font-bold text-[#EEECE7] mb-12 text-center">
          Dal nostro blog
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <div
              key={i}
              className="bg-[#0D0D15] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] hover:border-[#C9843A]/30 transition-all cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-[#C9843A]/10 text-[#C9843A] border border-[#C9843A]/20 mb-3">
                  {article.category}
                </span>
                <h4 className="text-[16px] font-semibold text-[#EEECE7] leading-snug">
                  {article.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wine className="w-6 h-6 text-[#C9843A]" strokeWidth={1.5} />
                <span className="text-[18px] font-bold text-[#EEECE7]">ENOTECA OS</span>
              </div>
              <p className="text-[13px] text-[#6B6963]">
                Sistema operativo autonomo per commercianti di vini e spirits da collezione
              </p>
            </div>
            <div>
              <h4 className="text-[14px] font-semibold text-[#EEECE7] mb-3">Servizi</h4>
              <ul className="space-y-2 text-[13px] text-[#6B6963]">
                <li><Link href="#" className="hover:text-[#C9843A]">Valutazione</Link></li>
                <li><Link href="#" className="hover:text-[#C9843A]">Acquisto</Link></li>
                <li><Link href="#" className="hover:text-[#C9843A]">Vendita</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[14px] font-semibold text-[#EEECE7] mb-3">Legale</h4>
              <ul className="space-y-2 text-[13px] text-[#6B6963]">
                <li><Link href="#" className="hover:text-[#C9843A]">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-[#C9843A]">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-[#C9843A]">Termini di servizio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[14px] font-semibold text-[#EEECE7] mb-3">Contatti</h4>
              <ul className="space-y-2 text-[13px] text-[#6B6963]">
                <li>800 66 0406</li>
                <li>info@enotecaos.com</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[rgba(255,255,255,0.06)] text-center text-[12px] text-[#6B6963]">
            &copy; 2026 ENOTECA OS. Tutti i diritti riservati.
          </div>
        </div>
      </div>
    </div>
  );
}

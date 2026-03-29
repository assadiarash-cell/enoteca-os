'use client';

import { useState } from 'react';
import { Upload, X, MapPin, Wine, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const provinces = [
  'Milano', 'Roma', 'Torino', 'Firenze', 'Napoli', 'Bologna',
  'Verona', 'Genova', 'Venezia', 'Palermo', 'Bari', 'Catania',
  'Bergamo', 'Brescia', 'Padova', 'Trieste', 'Parma', 'Modena',
  'Altra provincia',
];

const saleTypes = [
  { id: 'eredita', label: 'Eredità', description: 'Bottiglie ereditate da famiglia' },
  { id: 'cantina', label: 'Cantina privata', description: 'Collezione personale' },
  { id: 'ristorante', label: 'Ristorante/Bar', description: 'Attività commerciale' },
  { id: 'altro', label: 'Altro', description: 'Altra provenienza' },
];

export default function ValutaPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [province, setProvince] = useState('');
  const [saleType, setSaleType] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((f) =>
        f.type.startsWith('image/')
      );
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="py-16 md:py-24 px-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-overline uppercase text-accent-primary tracking-widest">
            Valutazione gratuita
          </span>
          <h1 className="mt-4 text-title-1 md:text-4xl font-bold text-text-primary">
            Valuta le tue bottiglie
          </h1>
          <p className="mt-3 text-body-lg text-text-secondary">
            Carica le foto, indica la provenienza e ricevi una valutazione professionale entro 24 ore.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Photo Upload */}
          <div className="flex flex-col gap-3">
            <label className="text-overline uppercase text-text-tertiary tracking-wider">
              Foto delle bottiglie
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                'relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-10 transition-all duration-200 cursor-pointer',
                dragActive
                  ? 'border-accent-primary bg-accent-primary/5'
                  : 'border-border-medium hover:border-border-strong bg-bg-secondary'
              )}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent-primary/10">
                <Upload className="h-7 w-7 text-accent-primary" />
              </div>
              <div className="text-center">
                <p className="text-body-sm font-medium text-text-primary">
                  Trascina le foto qui
                </p>
                <p className="text-caption text-text-tertiary mt-1">
                  oppure clicca per selezionare - JPG, PNG, HEIC (max 20MB)
                </p>
              </div>
            </div>

            {/* File previews */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {files.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="group relative h-20 w-20 rounded-md border border-border-subtle overflow-hidden bg-bg-tertiary"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-bg-primary/80 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Province Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-overline uppercase text-text-tertiary tracking-wider flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              Provincia
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="flex h-10 w-full rounded-md border border-border-medium bg-bg-tertiary px-3 py-2 text-body-sm text-text-primary appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 transition-colors"
            >
              <option value="" className="bg-bg-tertiary">
                Seleziona la tua provincia
              </option>
              {provinces.map((p) => (
                <option key={p} value={p} className="bg-bg-tertiary">
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Sale Type Selector */}
          <div className="flex flex-col gap-3">
            <label className="text-overline uppercase text-text-tertiary tracking-wider flex items-center gap-2">
              <Wine className="h-3.5 w-3.5" />
              Provenienza
            </label>
            <div className="grid grid-cols-2 gap-3">
              {saleTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSaleType(type.id)}
                  className={cn(
                    'flex flex-col gap-1 rounded-md border p-4 text-left transition-all duration-200',
                    saleType === type.id
                      ? 'border-accent-primary bg-accent-primary/5'
                      : 'border-border-medium bg-bg-secondary hover:border-border-strong'
                  )}
                >
                  <span className="text-body-sm font-medium text-text-primary">
                    {type.label}
                  </span>
                  <span className="text-caption text-text-tertiary">
                    {type.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex flex-col gap-4 border-t border-border-subtle pt-8">
            <h3 className="text-title-3 text-text-primary">I tuoi dati</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="nome"
                label="Nome"
                placeholder="Mario"
              />
              <Input
                id="cognome"
                label="Cognome"
                placeholder="Rossi"
              />
            </div>
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="mario@esempio.it"
            />
            <Input
              id="telefono"
              label="Telefono (opzionale)"
              type="tel"
              placeholder="+39 333 1234567"
            />
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="note"
                className="text-caption text-text-secondary uppercase tracking-wider"
              >
                Note aggiuntive
              </label>
              <textarea
                id="note"
                rows={3}
                placeholder="Descrivi brevemente le bottiglie, la quantità approssimativa, ecc."
                className="flex w-full rounded-md border border-border-medium bg-bg-tertiary px-3 py-2 text-body-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <Button size="lg" className="w-full mt-4">
            <Send className="h-4 w-4" />
            Invia richiesta di valutazione
          </Button>

          <p className="text-caption text-text-tertiary text-center">
            Rispondiamo entro 24 ore. I tuoi dati sono protetti e non verranno condivisi con terzi.
          </p>
        </div>
      </div>
    </div>
  );
}

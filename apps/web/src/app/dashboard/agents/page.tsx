'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Activity, Clock, Zap, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type AgentStatus = 'active' | 'idle' | 'error' | 'disabled';

interface ActivityEntry {
  time: string;
  action: string;
}

interface Agent {
  id: string;
  emoji: string;
  name: string;
  description: string;
  status: AgentStatus;
  actionsToday: number;
  costToday: number;
  lastAction: string;
  activityLog: ActivityEntry[];
}

const agents: Agent[] = [
  {
    id: 'scout',
    emoji: '\uD83D\uDD0D',
    name: 'Scout',
    description: 'Ricerca e identificazione nuove opportunita di acquisizione da marketplace e aste',
    status: 'active',
    actionsToday: 47,
    costToday: 2.34,
    lastAction: '2 min fa',
    activityLog: [
      { time: '14:32', action: 'Scansionato 12 nuovi lotti su Sotheby\'s Wine' },
      { time: '14:15', action: 'Identificata opportunita: Barolo Riserva 2008 sotto mercato' },
      { time: '13:58', action: 'Aggiornato database prezzi per Bordeaux 2010' },
      { time: '13:40', action: 'Alert: nuova asta Christie\'s con 8 lotti premium' },
    ],
  },
  {
    id: 'valuation',
    emoji: '\uD83D\uDCB0',
    name: 'Valuation',
    description: 'Stima automatica del valore di mercato basata su database internazionali e trend',
    status: 'active',
    actionsToday: 32,
    costToday: 1.87,
    lastAction: '5 min fa',
    activityLog: [
      { time: '14:28', action: 'Valutata collezione Bianchi: 12 Barolo, stima €18.000' },
      { time: '14:10', action: 'Aggiornate quotazioni Sassicaia 2000-2020' },
      { time: '13:45', action: 'Comparativa prezzi Macallan 25yo completata' },
    ],
  },
  {
    id: 'pricing',
    emoji: '\uD83C\uDFF7\uFE0F',
    name: 'Pricing',
    description: 'Determinazione prezzo ottimale di vendita considerando margini e velocita di rotazione',
    status: 'active',
    actionsToday: 18,
    costToday: 0.92,
    lastAction: '12 min fa',
    activityLog: [
      { time: '14:20', action: 'Ricalcolato pricing per 15 bottiglie in catalogo' },
      { time: '13:55', action: 'Suggerito sconto 5% su Petrus 2005 per accelerare vendita' },
    ],
  },
  {
    id: 'outreach',
    emoji: '\uD83D\uDCE7',
    name: 'Outreach',
    description: 'Gestione comunicazioni automatiche con venditori e buyer potenziali',
    status: 'active',
    actionsToday: 24,
    costToday: 1.15,
    lastAction: '8 min fa',
    activityLog: [
      { time: '14:25', action: 'Inviata email follow-up a 3 seller inattivi' },
      { time: '14:00', action: 'Risposta automatica a richiesta valutazione di Maria Conti' },
      { time: '13:30', action: 'Newsletter settimanale inviata a 142 buyer' },
    ],
  },
  {
    id: 'inventory',
    emoji: '\uD83D\uDCE6',
    name: 'Inventory',
    description: 'Monitoraggio livelli inventario, aging e suggerimenti di ottimizzazione stock',
    status: 'active',
    actionsToday: 15,
    costToday: 0.68,
    lastAction: '20 min fa',
    activityLog: [
      { time: '14:12', action: 'Alert: 5 bottiglie in aging >90 giorni' },
      { time: '13:50', action: 'Aggiornato inventario dopo vendita Opus One' },
    ],
  },
  {
    id: 'negotiator',
    emoji: '\uD83E\uDD1D',
    name: 'Negotiator',
    description: 'Assistenza nella negoziazione con suggerimenti strategici basati su dati storici',
    status: 'active',
    actionsToday: 8,
    costToday: 1.45,
    lastAction: '15 min fa',
    activityLog: [
      { time: '14:18', action: 'Suggerita controfferta per lotto Bordeaux: -3% vs richiesta' },
      { time: '13:40', action: 'Analisi storico trattative con buyer Tanaka completata' },
    ],
  },
  {
    id: 'analytics',
    emoji: '\uD83D\uDCCA',
    name: 'Analytics',
    description: 'Generazione insight e report su performance vendite, margini e trend di mercato',
    status: 'active',
    actionsToday: 12,
    costToday: 0.78,
    lastAction: '30 min fa',
    activityLog: [
      { time: '14:02', action: 'Report settimanale margini generato' },
      { time: '13:20', action: 'Identificato trend: Cognac +15% negli ultimi 3 mesi' },
    ],
  },
  {
    id: 'photographer',
    emoji: '\uD83D\uDCF7',
    name: 'Photographer',
    description: 'Miglioramento automatico foto prodotto, rimozione sfondo e ottimizzazione catalogo',
    status: 'active',
    actionsToday: 22,
    costToday: 3.20,
    lastAction: '45 min fa',
    activityLog: [
      { time: '13:47', action: 'Elaborate 8 foto per nuove bottiglie in catalogo' },
      { time: '13:15', action: 'Background removal completato per lotto Jamaica' },
    ],
  },
  {
    id: 'curator',
    emoji: '\uD83C\uDFAD',
    name: 'Curator',
    description: 'Creazione descrizioni prodotto multilingua e storie di provenienza per il catalogo',
    status: 'idle',
    actionsToday: 6,
    costToday: 0.45,
    lastAction: '1 ora fa',
    activityLog: [
      { time: '13:30', action: 'Scritta descrizione per Romanee-Conti 1998 in 3 lingue' },
      { time: '12:45', action: 'Aggiornata storia di provenienza collezione Verdi' },
    ],
  },
  {
    id: 'compliance',
    emoji: '\uD83D\uDCDC',
    name: 'Compliance',
    description: 'Verifica conformita normativa per import/export alcolici e documentazione fiscale',
    status: 'idle',
    actionsToday: 4,
    costToday: 0.32,
    lastAction: '3 ore fa',
    activityLog: [
      { time: '11:20', action: 'Verificata documentazione export per spedizione UK' },
      { time: '10:00', action: 'Check normativo per import Cognac dalla Francia' },
    ],
  },
  {
    id: 'forecaster',
    emoji: '\uD83D\uDD2E',
    name: 'Forecaster',
    description: 'Previsioni di domanda, prezzi futuri e identificazione trend emergenti nel mercato',
    status: 'active',
    actionsToday: 9,
    costToday: 1.12,
    lastAction: '25 min fa',
    activityLog: [
      { time: '14:07', action: 'Forecast Q2: Barolo +8%, Whisky stabile, Rum +12%' },
      { time: '13:25', action: 'Alert: domanda Sassicaia in aumento da mercato US' },
    ],
  },
  {
    id: 'logistics',
    emoji: '\uD83D\uDE9A',
    name: 'Logistics',
    description: 'Coordinamento spedizioni assicurate, tracking e gestione temperature di trasporto',
    status: 'active',
    actionsToday: 11,
    costToday: 0.55,
    lastAction: '18 min fa',
    activityLog: [
      { time: '14:14', action: 'Organizzata spedizione assicurata per Opus One → USA' },
      { time: '13:50', action: 'Tracking aggiornato: pacco Johnson in consegna domani' },
    ],
  },
  {
    id: 'quality',
    emoji: '\u2705',
    name: 'Quality Control',
    description: 'Verifica autenticita bottiglie tramite analisi foto etichette, capsule e livello',
    status: 'active',
    actionsToday: 14,
    costToday: 2.10,
    lastAction: '10 min fa',
    activityLog: [
      { time: '14:22', action: 'Analisi autenticita completata: Barolo Monfortino OK' },
      { time: '14:05', action: 'Flag: livello bottiglia sospetto su Petrus 2000' },
      { time: '13:35', action: 'Verificate 6 etichette collezione Conti' },
    ],
  },
  {
    id: 'social',
    emoji: '\uD83D\uDCF1',
    name: 'Social',
    description: 'Creazione e scheduling contenuti social per promozione catalogo e brand awareness',
    status: 'disabled',
    actionsToday: 0,
    costToday: 0,
    lastAction: '2 giorni fa',
    activityLog: [
      { time: '2 giorni fa', action: 'Ultimo post Instagram: Sassicaia verticale' },
    ],
  },
  {
    id: 'customer-service',
    emoji: '\uD83D\uDCAC',
    name: 'Customer Service',
    description: 'Risposte automatiche a FAQ, gestione richieste post-vendita e feedback collection',
    status: 'active',
    actionsToday: 19,
    costToday: 0.88,
    lastAction: '6 min fa',
    activityLog: [
      { time: '14:26', action: 'Risposta a richiesta info su condizioni di reso' },
      { time: '14:10', action: 'Follow-up soddisfazione a 5 buyer recenti' },
      { time: '13:42', action: 'Gestita richiesta certificato autenticita per Schmidt' },
    ],
  },
  {
    id: 'research',
    emoji: '\uD83D\uDCDA',
    name: 'Research',
    description: 'Ricerca approfondita su produttori, annate, punteggi critici e storia delle bottiglie',
    status: 'idle',
    actionsToday: 7,
    costToday: 0.95,
    lastAction: '2 ore fa',
    activityLog: [
      { time: '12:30', action: 'Completata scheda produttore: Giacomo Conterno' },
      { time: '11:45', action: 'Aggiornati punteggi Parker per Bordeaux 2015' },
    ],
  },
  {
    id: 'risk',
    emoji: '\u26A0\uFE0F',
    name: 'Risk',
    description: 'Analisi rischio controparte, fraud detection e monitoraggio esposizione finanziaria',
    status: 'error',
    actionsToday: 3,
    costToday: 0.42,
    lastAction: '4 ore fa',
    activityLog: [
      { time: '10:30', action: 'ERRORE: timeout connessione database antifrode' },
      { time: '10:00', action: 'Ultimo check completato: profilo Dupont verificato' },
    ],
  },
  {
    id: 'reporting',
    emoji: '\uD83D\uDCC8',
    name: 'Reporting',
    description: 'Generazione report periodici su KPI, performance agenti e stato pipeline',
    status: 'idle',
    actionsToday: 2,
    costToday: 0.28,
    lastAction: '6 ore fa',
    activityLog: [
      { time: '08:30', action: 'Report giornaliero generato e inviato via email' },
      { time: '08:00', action: 'Dashboard KPI aggiornata con dati overnight' },
    ],
  },
  {
    id: 'marketplace',
    emoji: '\uD83C\uDFEA',
    name: 'Marketplace',
    description: 'Pubblicazione e sincronizzazione listing su marketplace multipli e gestione ordini',
    status: 'active',
    actionsToday: 16,
    costToday: 0.72,
    lastAction: '4 min fa',
    activityLog: [
      { time: '14:28', action: 'Sincronizzati prezzi su 3 marketplace' },
      { time: '14:10', action: 'Nuovo listing: Macallan 25yo su Vivino' },
      { time: '13:55', action: 'Ordine ricevuto da Wine-Searcher per Sassicaia 2015' },
    ],
  },
];

const statusConfig: Record<AgentStatus, { label: string; dotColor: string; textColor: string; bgColor: string }> = {
  active: { label: 'Attivo', dotColor: 'bg-emerald-400', textColor: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
  idle: { label: 'In attesa', dotColor: 'bg-amber-400', textColor: 'text-amber-400', bgColor: 'bg-amber-400/10' },
  error: { label: 'Errore', dotColor: 'bg-red-400', textColor: 'text-red-400', bgColor: 'bg-red-400/10' },
  disabled: { label: 'Disabilitato', dotColor: 'bg-[#A09E96]/40', textColor: 'text-[#A09E96]/60', bgColor: 'bg-[#A09E96]/5' },
};

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const activeCount = agents.filter((a) => a.status === 'active').length;
  const totalActions = agents.reduce((sum, a) => sum + a.actionsToday, 0);
  const totalCost = agents.reduce((sum, a) => sum + a.costToday, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#EEECE7]">AI Agents</h1>
          <p className="text-sm text-[#A09E96] mt-1">
            {agents.length} agenti configurati
          </p>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0D0D15] border border-[#1A1A24]">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-400/15">
            <Zap className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-semibold text-[#EEECE7]">{activeCount}</span>
            <p className="text-xs text-[#A09E96]">Agenti attivi</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0D0D15] border border-[#1A1A24]">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#C9843A]/15">
            <Activity className="h-5 w-5 text-[#C9843A]" />
          </div>
          <div>
            <span className="text-2xl font-semibold text-[#EEECE7]">{totalActions}</span>
            <p className="text-xs text-[#A09E96]">Azioni oggi</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0D0D15] border border-[#1A1A24]">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-500/15">
            <DollarSign className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <span className="text-2xl font-semibold text-[#EEECE7]">${totalCost.toFixed(2)}</span>
            <p className="text-xs text-[#A09E96]">Costo oggi</p>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((agent) => {
          const config = statusConfig[agent.status];
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className="flex flex-col gap-3 rounded-xl bg-[#0D0D15] border border-[#1A1A24] p-4 hover:border-[#C9843A]/40 transition-all cursor-pointer text-left group"
            >
              {/* Top Row: Emoji + Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{agent.emoji}</span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        config.dotColor,
                        agent.status === 'active' && 'animate-pulse'
                      )}
                    />
                    <span className={cn('text-[10px] font-medium', config.textColor)}>
                      {config.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Name + Description */}
              <div>
                <h4 className="text-sm font-medium text-[#EEECE7] group-hover:text-white transition-colors">
                  {agent.name}
                </h4>
                <p className="text-xs text-[#A09E96] mt-1 line-clamp-2">{agent.description}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1A1A24]">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#A09E96]">
                    <span className="text-[#EEECE7] font-medium">{agent.actionsToday}</span> azioni
                  </span>
                  <span className="text-xs text-[#A09E96]">
                    <span className="text-[#EEECE7] font-medium">${agent.costToday.toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Last Action Timestamp */}
              <div className="flex items-center gap-1 text-[10px] text-[#A09E96]/60">
                <Clock className="h-3 w-3" />
                {agent.lastAction}
              </div>
            </button>
          );
        })}
      </div>

      {/* Agent Detail Modal */}
      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
        <DialogContent className="bg-[#0D0D15] border border-[#1A1A24] text-[#EEECE7] max-w-lg">
          {selectedAgent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedAgent.emoji}</span>
                  <div>
                    <DialogTitle className="text-[#EEECE7] text-lg">{selectedAgent.name}</DialogTitle>
                    <DialogDescription className="text-[#A09E96]">
                      {selectedAgent.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Status + Stats */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#07070D] border border-[#1A1A24]">
                  <span className="text-[10px] uppercase text-[#A09E96] tracking-wider">Stato</span>
                  <div className="flex items-center gap-2">
                    <div className={cn('h-2 w-2 rounded-full', statusConfig[selectedAgent.status].dotColor)} />
                    <span className={cn('text-sm', statusConfig[selectedAgent.status].textColor)}>
                      {statusConfig[selectedAgent.status].label}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#07070D] border border-[#1A1A24]">
                  <span className="text-[10px] uppercase text-[#A09E96] tracking-wider">Azioni oggi</span>
                  <span className="text-sm font-semibold text-[#EEECE7]">{selectedAgent.actionsToday}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#07070D] border border-[#1A1A24]">
                  <span className="text-[10px] uppercase text-[#A09E96] tracking-wider">Costo oggi</span>
                  <span className="text-sm font-semibold text-[#C9843A]">${selectedAgent.costToday.toFixed(2)}</span>
                </div>
              </div>

              {/* Activity Log */}
              <div className="flex flex-col gap-3 mt-4">
                <h4 className="text-xs font-semibold uppercase text-[#A09E96] tracking-wider">
                  Log attivita
                </h4>
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {selectedAgent.activityLog.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[#07070D] border border-[#1A1A24]"
                    >
                      <span className="text-[10px] text-[#A09E96]/60 w-12 shrink-0 pt-0.5">{entry.time}</span>
                      <p className="text-sm text-[#EEECE7]/80">{entry.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#1A1A24]">
                <Button className="flex-1 bg-[#C9843A] hover:bg-[#B8753A] text-white">
                  Configura
                </Button>
                {selectedAgent.status === 'active' ? (
                  <Button variant="outline" className="border-[#1A1A24] text-[#EEECE7] hover:bg-[#1A1A24]">
                    Pausa
                  </Button>
                ) : selectedAgent.status !== 'disabled' ? (
                  <Button variant="outline" className="border-[#1A1A24] text-emerald-400 hover:bg-emerald-400/10">
                    Attiva
                  </Button>
                ) : (
                  <Button variant="outline" className="border-[#1A1A24] text-[#A09E96] hover:bg-[#1A1A24]">
                    Abilita
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


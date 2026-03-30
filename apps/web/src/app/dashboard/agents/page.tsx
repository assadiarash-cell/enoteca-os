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
import { DEMO_ORG_ID } from '@/lib/hooks/use-org';

// TODO: Add /api/agent-actions endpoint to fetch real agent activity data

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

/**
 * Static agent definitions — these are part of the product design.
 * Dynamic data (actionsToday, costToday, lastAction, activityLog) is
 * zeroed out until a real /api/agent-actions endpoint is available.
 */
const agents: Agent[] = [
  {
    id: 'scout',
    emoji: '\uD83D\uDD0D',
    name: 'Scout',
    description: 'Ricerca e identificazione nuove opportunita di acquisizione da marketplace e aste',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'valuation',
    emoji: '\uD83D\uDCB0',
    name: 'Valuation',
    description: 'Stima automatica del valore di mercato basata su database internazionali e trend',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'pricing',
    emoji: '\uD83C\uDFF7\uFE0F',
    name: 'Pricing',
    description: 'Determinazione prezzo ottimale di vendita considerando margini e velocita di rotazione',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'outreach',
    emoji: '\uD83D\uDCE7',
    name: 'Outreach',
    description: 'Gestione comunicazioni automatiche con venditori e buyer potenziali',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'inventory',
    emoji: '\uD83D\uDCE6',
    name: 'Inventory',
    description: 'Monitoraggio livelli inventario, aging e suggerimenti di ottimizzazione stock',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'negotiator',
    emoji: '\uD83E\uDD1D',
    name: 'Negotiator',
    description: 'Assistenza nella negoziazione con suggerimenti strategici basati su dati storici',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'analytics',
    emoji: '\uD83D\uDCCA',
    name: 'Analytics',
    description: 'Generazione insight e report su performance vendite, margini e trend di mercato',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'photographer',
    emoji: '\uD83D\uDCF7',
    name: 'Photographer',
    description: 'Miglioramento automatico foto prodotto, rimozione sfondo e ottimizzazione catalogo',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'curator',
    emoji: '\uD83C\uDFAD',
    name: 'Curator',
    description: 'Creazione descrizioni prodotto multilingua e storie di provenienza per il catalogo',
    status: 'idle',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'compliance',
    emoji: '\uD83D\uDCDC',
    name: 'Compliance',
    description: 'Verifica conformita normativa per import/export alcolici e documentazione fiscale',
    status: 'idle',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'forecaster',
    emoji: '\uD83D\uDD2E',
    name: 'Forecaster',
    description: 'Previsioni di domanda, prezzi futuri e identificazione trend emergenti nel mercato',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'logistics',
    emoji: '\uD83D\uDE9A',
    name: 'Logistics',
    description: 'Coordinamento spedizioni assicurate, tracking e gestione temperature di trasporto',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'quality',
    emoji: '\u2705',
    name: 'Quality Control',
    description: 'Verifica autenticita bottiglie tramite analisi foto etichette, capsule e livello',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'social',
    emoji: '\uD83D\uDCF1',
    name: 'Social',
    description: 'Creazione e scheduling contenuti social per promozione catalogo e brand awareness',
    status: 'disabled',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'customer-service',
    emoji: '\uD83D\uDCAC',
    name: 'Customer Service',
    description: 'Risposte automatiche a FAQ, gestione richieste post-vendita e feedback collection',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'research',
    emoji: '\uD83D\uDCDA',
    name: 'Research',
    description: 'Ricerca approfondita su produttori, annate, punteggi critici e storia delle bottiglie',
    status: 'idle',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'risk',
    emoji: '\u26A0\uFE0F',
    name: 'Risk',
    description: 'Analisi rischio controparte, fraud detection e monitoraggio esposizione finanziaria',
    status: 'error',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'reporting',
    emoji: '\uD83D\uDCC8',
    name: 'Reporting',
    description: 'Generazione report periodici su KPI, performance agenti e stato pipeline',
    status: 'idle',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
  },
  {
    id: 'marketplace',
    emoji: '\uD83C\uDFEA',
    name: 'Marketplace',
    description: 'Pubblicazione e sincronizzazione listing su marketplace multipli e gestione ordini',
    status: 'active',
    actionsToday: 0,
    costToday: 0,
    lastAction: 'N/D',
    activityLog: [],
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
            {agents.length} agenti configurati &middot; Dati in tempo reale non disponibili
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
                  {selectedAgent.activityLog.length === 0 ? (
                    <div className="p-4 rounded-lg bg-[#07070D] border border-[#1A1A24] text-center">
                      <p className="text-sm text-[#A09E96]">Nessuna attivit&agrave; registrata</p>
                    </div>
                  ) : (
                    selectedAgent.activityLog.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-[#07070D] border border-[#1A1A24]"
                      >
                        <span className="text-[10px] text-[#A09E96]/60 w-12 shrink-0 pt-0.5">{entry.time}</span>
                        <p className="text-sm text-[#EEECE7]/80">{entry.action}</p>
                      </div>
                    ))
                  )}
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

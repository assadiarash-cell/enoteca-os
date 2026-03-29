import { AgentCard } from '@/components/dashboard/agent-card';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';

const agents = [
  { name: 'Bottle Identifier', description: 'Riconoscimento automatico bottiglie da foto tramite vision AI', status: 'active' as const, lastRun: '2 min fa', tasksCompleted: 1247 },
  { name: 'Price Estimator', description: 'Stima del valore di mercato basata su database internazionali e trend', status: 'active' as const, lastRun: '5 min fa', tasksCompleted: 892 },
  { name: 'Label Analyzer', description: 'Analisi condizione etichetta, capsule e livello riempimento', status: 'active' as const, lastRun: '8 min fa', tasksCompleted: 1103 },
  { name: 'Market Monitor', description: 'Monitoraggio continuo prezzi auction e marketplace internazionali', status: 'active' as const, lastRun: '1 min fa', tasksCompleted: 4521 },
  { name: 'Lead Scorer', description: 'Scoring automatico lead venditori basato su potenziale e probabilità', status: 'active' as const, lastRun: '15 min fa', tasksCompleted: 356 },
  { name: 'Content Writer', description: 'Generazione descrizioni prodotto multilingua per marketplace', status: 'active' as const, lastRun: '22 min fa', tasksCompleted: 678 },
  { name: 'Email Responder', description: 'Risposte automatiche a richieste di valutazione e informazioni', status: 'idle' as const, lastRun: '1 ora fa', tasksCompleted: 234 },
  { name: 'Fraud Detector', description: 'Verifica autenticità bottiglie tramite analisi comparativa', status: 'active' as const, lastRun: '12 min fa', tasksCompleted: 89 },
  { name: 'Inventory Optimizer', description: 'Suggerimenti ottimizzazione inventario e pricing dinamico', status: 'idle' as const, lastRun: '3 ore fa', tasksCompleted: 45 },
  { name: 'Buyer Matcher', description: 'Matching automatico bottiglie-buyer basato su preferenze e storico', status: 'active' as const, lastRun: '30 min fa', tasksCompleted: 512 },
  { name: 'Photo Enhancer', description: 'Miglioramento automatico foto prodotto per catalogo', status: 'active' as const, lastRun: '45 min fa', tasksCompleted: 823 },
  { name: 'Report Generator', description: 'Generazione report periodici su performance e KPI', status: 'idle' as const, lastRun: '6 ore fa', tasksCompleted: 156 },
  { name: 'Social Media Agent', description: 'Creazione e scheduling contenuti social per promozione', status: 'disabled' as const, lastRun: '2 giorni fa', tasksCompleted: 67 },
  { name: 'Shipping Coordinator', description: 'Coordinamento logistica e tracking spedizioni assicurate', status: 'active' as const, lastRun: '20 min fa', tasksCompleted: 298 },
  { name: 'Translation Agent', description: 'Traduzione automatica comunicazioni buyer internazionali', status: 'active' as const, lastRun: '35 min fa', tasksCompleted: 445 },
  { name: 'Compliance Checker', description: 'Verifica conformità normativa per import/export alcolici', status: 'idle' as const, lastRun: '12 ore fa', tasksCompleted: 78 },
  { name: 'Collection Appraiser', description: 'Valutazione automatica intere collezioni e lotti', status: 'active' as const, lastRun: '1 ora fa', tasksCompleted: 134 },
  { name: 'CRM Enricher', description: 'Arricchimento automatico profili contatti con dati pubblici', status: 'error' as const, lastRun: '4 ore fa', tasksCompleted: 201 },
  { name: 'Margin Analyst', description: 'Analisi margini in tempo reale e alert su variazioni significative', status: 'active' as const, lastRun: '10 min fa', tasksCompleted: 567 },
];

const statusCounts = {
  active: agents.filter((a) => a.status === 'active').length,
  idle: agents.filter((a) => a.status === 'idle').length,
  error: agents.filter((a) => a.status === 'error').length,
  disabled: agents.filter((a) => a.status === 'disabled').length,
};

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-text-primary">AI Agents</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            {agents.length} agenti configurati
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">{statusCounts.active} attivi</Badge>
          <Badge variant="warning">{statusCounts.idle} in attesa</Badge>
          {statusCounts.error > 0 && (
            <Badge variant="danger">{statusCounts.error} errore</Badge>
          )}
          {statusCounts.disabled > 0 && (
            <Badge variant="neutral">{statusCounts.disabled} disabilitati</Badge>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-6 rounded-md border border-border-subtle bg-bg-secondary p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-primary/10">
          <Bot className="h-6 w-6 text-accent-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-body-lg font-medium text-text-primary">
            {agents.reduce((sum, a) => sum + (a.tasksCompleted || 0), 0).toLocaleString('it-IT')} task completati
          </span>
          <span className="text-body-sm text-text-secondary">
            Gli agenti AI gestiscono automaticamente valutazione, pricing, comunicazione e logistica.
          </span>
        </div>
      </div>

      {/* Agents grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.name} {...agent} />
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Activity, DollarSign, Clock } from 'lucide-react';

type AgentStatus = 'active' | 'idle' | 'error' | 'disabled';

interface ActivityEntry {
  time: string;
  action: string;
  result: string;
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

const getStatusColor = (status: AgentStatus): string => {
  switch (status) {
    case 'active':
      return '#22C68A';
    case 'idle':
      return '#6B6963';
    case 'error':
      return '#DC4545';
    case 'disabled':
      return '#6B6963';
    default:
      return '#6B6963';
  }
};

/**
 * Static agent definitions with Figma mock data values.
 * Dynamic data will come from /api/agent-actions when available.
 */
const agents: Agent[] = [
  {
    id: 'scout',
    emoji: '\uD83D\uDD0D',
    name: 'Scout',
    description: 'Ricerca e identificazione nuove opportunita di acquisizione da marketplace e aste',
    status: 'active',
    actionsToday: 47,
    costToday: 2.34,
    lastAction: '12m ago',
    activityLog: [
      { time: '14:42', action: 'Found underpriced Barolo 1978 on eBay', result: 'Added to watchlist' },
      { time: '14:28', action: 'Scanned marketplace: WineSearcher', result: '23 new listings analyzed' },
      { time: '14:15', action: 'Alert: Price drop on Macallan 18yr', result: 'Notification sent' },
      { time: '13:56', action: 'Compared 8 sources for Sassicaia 2001', result: 'Updated pricing recommendation' },
      { time: '13:34', action: 'Identified authentication issue', result: 'Flagged for review' },
    ],
  },
  {
    id: 'valuation',
    emoji: '\uD83D\uDCB0',
    name: 'Valuation',
    description: 'Stima automatica del valore di mercato basata su database internazionali e trend',
    status: 'active',
    actionsToday: 23,
    costToday: 5.67,
    lastAction: '8m ago',
    activityLog: [
      { time: '14:38', action: 'Valued Chateau Margaux 2005 magnum', result: 'Estimated range: 450-520' },
      { time: '14:20', action: 'Cross-referenced Wine-Searcher prices', result: '12 comps analyzed' },
      { time: '13:55', action: 'Updated Burgundy index weights', result: 'Model retrained' },
    ],
  },
  {
    id: 'pricing',
    emoji: '\uD83C\uDFF7\uFE0F',
    name: 'Pricing',
    description: 'Determinazione prezzo ottimale di vendita considerando margini e velocita di rotazione',
    status: 'active',
    actionsToday: 156,
    costToday: 1.89,
    lastAction: '15m ago',
    activityLog: [
      { time: '14:30', action: 'Repriced 34 bottles in Bordeaux category', result: 'Average margin +4.2%' },
      { time: '14:12', action: 'Competitive scan completed', result: '156 prices updated' },
    ],
  },
  {
    id: 'outreach',
    emoji: '\uD83D\uDCE7',
    name: 'Outreach',
    description: 'Gestione comunicazioni automatiche con venditori e buyer potenziali',
    status: 'active',
    actionsToday: 34,
    costToday: 4.23,
    lastAction: '3m ago',
    activityLog: [
      { time: '14:44', action: 'Sent follow-up to collector in Milan', result: 'Email delivered' },
      { time: '14:30', action: 'WhatsApp campaign: 12 sellers contacted', result: '4 replies received' },
      { time: '14:10', action: 'Drafted offer for Penfolds collection', result: 'Pending approval' },
    ],
  },
  {
    id: 'inventory',
    emoji: '\uD83D\uDCE6',
    name: 'Inventory',
    description: 'Monitoraggio livelli inventario, aging e suggerimenti di ottimizzazione stock',
    status: 'active',
    actionsToday: 12,
    costToday: 0.45,
    lastAction: '1h ago',
    activityLog: [
      { time: '13:45', action: 'Stock level check: warehouse A', result: '342 bottles cataloged' },
      { time: '13:20', action: 'Aging alert: 5 bottles approaching peak', result: 'Notification sent' },
    ],
  },
  {
    id: 'negotiator',
    emoji: '\uD83E\uDD1D',
    name: 'Negotiator',
    description: 'Assistenza nella negoziazione con suggerimenti strategici basati su dati storici',
    status: 'active',
    actionsToday: 18,
    costToday: 3.12,
    lastAction: '22m ago',
    activityLog: [
      { time: '14:25', action: 'Counter-offer prepared for lot #2847', result: 'Recommended 15% below ask' },
      { time: '14:05', action: 'Historical deal analysis completed', result: '8 comparable deals found' },
    ],
  },
  {
    id: 'analytics',
    emoji: '\uD83D\uDCCA',
    name: 'Analytics',
    description: 'Generazione insight e report su performance vendite, margini e trend di mercato',
    status: 'idle',
    actionsToday: 8,
    costToday: 1.23,
    lastAction: '2h ago',
    activityLog: [
      { time: '12:45', action: 'Weekly trend report generated', result: 'Burgundy +3.2% WoW' },
      { time: '12:30', action: 'Margin analysis for Q1 completed', result: 'Report ready for review' },
    ],
  },
  {
    id: 'photographer',
    emoji: '\uD83D\uDCF7',
    name: 'Photographer',
    description: 'Miglioramento automatico foto prodotto, rimozione sfondo e ottimizzazione catalogo',
    status: 'active',
    actionsToday: 29,
    costToday: 2.78,
    lastAction: '45m ago',
    activityLog: [
      { time: '14:00', action: 'Processed 29 product photos', result: 'Background removed, enhanced' },
      { time: '13:40', action: 'Generated catalog thumbnails batch', result: '29 images optimized' },
    ],
  },
  {
    id: 'curator',
    emoji: '\uD83C\uDFAD',
    name: 'Curator',
    description: 'Creazione descrizioni prodotto multilingua e storie di provenienza per il catalogo',
    status: 'idle',
    actionsToday: 5,
    costToday: 0.89,
    lastAction: '3h ago',
    activityLog: [
      { time: '11:45', action: 'Wrote tasting notes for 5 new bottles', result: 'IT/EN/FR versions created' },
    ],
  },
  {
    id: 'compliance',
    emoji: '\uD83D\uDCDC',
    name: 'Compliance',
    description: 'Verifica conformita normativa per import/export alcolici e documentazione fiscale',
    status: 'active',
    actionsToday: 14,
    costToday: 1.56,
    lastAction: '1h ago',
    activityLog: [
      { time: '13:50', action: 'Import docs verified for shipment #412', result: 'All clear' },
      { time: '13:30', action: 'Tax compliance check: EU cross-border', result: '14 invoices validated' },
    ],
  },
  {
    id: 'forecaster',
    emoji: '\uD83D\uDD2E',
    name: 'Forecaster',
    description: 'Previsioni di domanda, prezzi futuri e identificazione trend emergenti nel mercato',
    status: 'active',
    actionsToday: 11,
    costToday: 2.34,
    lastAction: '30m ago',
    activityLog: [
      { time: '14:15', action: 'Demand forecast: Super Tuscans Q2', result: '+18% predicted' },
      { time: '13:50', action: 'Seasonality model updated', result: '11 categories recalculated' },
    ],
  },
  {
    id: 'logistics',
    emoji: '\uD83D\uDE9A',
    name: 'Logistics',
    description: 'Coordinamento spedizioni assicurate, tracking e gestione temperature di trasporto',
    status: 'active',
    actionsToday: 22,
    costToday: 1.67,
    lastAction: '18m ago',
    activityLog: [
      { time: '14:28', action: 'Shipment #398 picked up', result: 'Temperature-controlled transit' },
      { time: '14:10', action: 'Route optimized for 3 deliveries', result: 'Saved 45min ETA' },
    ],
  },
  {
    id: 'quality',
    emoji: '\u2705',
    name: 'Quality Control',
    description: 'Verifica autenticita bottiglie tramite analisi foto etichette, capsule e livello',
    status: 'active',
    actionsToday: 16,
    costToday: 1.45,
    lastAction: '25m ago',
    activityLog: [
      { time: '14:20', action: 'Authenticated Petrus 1990 via label scan', result: 'Verified genuine' },
      { time: '14:00', action: 'Fill level analysis: batch #77', result: '16 bottles passed' },
    ],
  },
  {
    id: 'social',
    emoji: '\uD83D\uDCF1',
    name: 'Social',
    description: 'Creazione e scheduling contenuti social per promozione catalogo e brand awareness',
    status: 'idle',
    actionsToday: 3,
    costToday: 0.34,
    lastAction: '4h ago',
    activityLog: [
      { time: '10:30', action: 'Scheduled 3 Instagram posts', result: 'Queued for this week' },
    ],
  },
  {
    id: 'customer-service',
    emoji: '\uD83D\uDCAC',
    name: 'Customer Service',
    description: 'Risposte automatiche a FAQ, gestione richieste post-vendita e feedback collection',
    status: 'active',
    actionsToday: 41,
    costToday: 3.89,
    lastAction: '5m ago',
    activityLog: [
      { time: '14:42', action: 'Replied to 12 buyer inquiries', result: 'Avg response time: 2min' },
      { time: '14:20', action: 'Post-sale survey sent to 8 buyers', result: '3 responses collected' },
      { time: '14:05', action: 'FAQ updated with shipping policy', result: 'Auto-reply configured' },
    ],
  },
  {
    id: 'research',
    emoji: '\uD83D\uDCDA',
    name: 'Research',
    description: 'Ricerca approfondita su produttori, annate, punteggi critici e storia delle bottiglie',
    status: 'active',
    actionsToday: 9,
    costToday: 2.12,
    lastAction: '1h ago',
    activityLog: [
      { time: '13:45', action: 'Deep dive: Domaine de la Romanee-Conti 2015', result: 'Critic scores compiled' },
      { time: '13:20', action: 'Producer profile updated: Antinori', result: '9 vintages researched' },
    ],
  },
  {
    id: 'risk',
    emoji: '\u26A0\uFE0F',
    name: 'Risk',
    description: 'Analisi rischio controparte, fraud detection e monitoraggio esposizione finanziaria',
    status: 'error',
    actionsToday: 13,
    costToday: 1.78,
    lastAction: '35m ago',
    activityLog: [
      { time: '14:10', action: 'Fraud alert: suspicious listing detected', result: 'Seller flagged for review' },
      { time: '13:50', action: 'Counterparty risk score updated', result: '13 profiles analyzed' },
    ],
  },
  {
    id: 'reporting',
    emoji: '\uD83D\uDCC8',
    name: 'Reporting',
    description: 'Generazione report periodici su KPI, performance agenti e stato pipeline',
    status: 'active',
    actionsToday: 4,
    costToday: 0.67,
    lastAction: '2h ago',
    activityLog: [
      { time: '12:45', action: 'Daily KPI snapshot generated', result: 'Sent to dashboard' },
      { time: '12:30', action: 'Agent performance summary compiled', result: '4 reports distributed' },
    ],
  },
  {
    id: 'marketplace',
    emoji: '\uD83C\uDFEA',
    name: 'Marketplace',
    description: 'Pubblicazione e sincronizzazione listing su marketplace multipli e gestione ordini',
    status: 'active',
    actionsToday: 38,
    costToday: 2.89,
    lastAction: '10m ago',
    activityLog: [
      { time: '14:35', action: 'Synced 38 listings across 4 platforms', result: 'All prices aligned' },
      { time: '14:15', action: 'New order received: Vivino marketplace', result: 'Auto-confirmed' },
      { time: '13:50', action: 'Stock sync: removed 2 sold-out items', result: 'Listings updated' },
    ],
  },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const totalActions = agents.reduce((sum, a) => sum + a.actionsToday, 0);
  const totalCost = agents.reduce((sum, a) => sum + a.costToday, 0);

  const selectedAgentData = agents.find((a) => a.id === selectedAgent);

  return (
    <div className="min-h-screen bg-[#07070D] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#07070D]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-[28px] font-bold text-[#EEECE7] mb-4">AI Agents</h1>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0D0D15] rounded-lg p-3 border border-[rgba(255,255,255,0.06)] max-w-full overflow-hidden">
              <p className="text-[11px] text-[#6B6963] uppercase tracking-wider mb-1">Active</p>
              <p className="text-[20px] font-bold text-[#22C68A]">{activeAgents}/{agents.length}</p>
            </div>
            <div className="bg-[#0D0D15] rounded-lg p-3 border border-[rgba(255,255,255,0.06)]">
              <p className="text-[11px] text-[#6B6963] uppercase tracking-wider mb-1">Actions</p>
              <p className="text-[20px] font-bold text-[#EEECE7]">{totalActions}</p>
            </div>
            <div className="bg-[#0D0D15] rounded-lg p-3 border border-[rgba(255,255,255,0.06)]">
              <p className="text-[11px] text-[#6B6963] uppercase tracking-wider mb-1">Cost</p>
              <p className="text-[20px] font-bold text-[#C9843A] font-mono">{totalCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className="bg-[#0D0D15] rounded-xl p-5 border border-[rgba(255,255,255,0.06)] hover:border-[#C9843A]/30 transition-all cursor-pointer active:scale-[0.98]"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-[32px]">{agent.emoji}</div>
                  <div
                    className={`w-2 h-2 rounded-full${agent.status === 'active' ? ' animate-pulse' : ''}`}
                    style={{ backgroundColor: getStatusColor(agent.status) }}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="mb-4">
                <h3 className="text-[16px] font-semibold text-[#EEECE7] mb-1">
                  {agent.name}
                </h3>
                <p className="text-[12px] text-[#A09E96] leading-relaxed">
                  {agent.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Activity className="w-3 h-3 text-[#6B6963]" strokeWidth={1.5} />
                    <span className="text-[10px] text-[#6B6963]">TODAY</span>
                  </div>
                  <p className="text-[16px] font-bold text-[#EEECE7]">{agent.actionsToday}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <DollarSign className="w-3 h-3 text-[#6B6963]" strokeWidth={1.5} />
                    <span className="text-[10px] text-[#6B6963]">COST</span>
                  </div>
                  <p className="text-[16px] font-bold text-[#C9843A] font-mono">
                    {agent.costToday.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Last Action */}
              <div className="flex items-center gap-1 text-[11px] text-[#6B6963] font-mono mt-3">
                <Clock className="w-3 h-3" strokeWidth={1.5} />
                {agent.lastAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sheet Detail Modal */}
      {selectedAgent && selectedAgentData && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setSelectedAgent(null)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 glass-bg rounded-t-[20px] border-t border-[rgba(255,255,255,0.06)] max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="max-w-2xl mx-auto">
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[rgba(255,255,255,0.2)] rounded-full" />
              </div>

              <div className="px-6 pb-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-[48px]">{selectedAgentData.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-[24px] font-bold text-[#EEECE7]">
                        {selectedAgentData.name}
                      </h2>
                      <div
                        className="px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider"
                        style={{
                          backgroundColor: `${getStatusColor(selectedAgentData.status)}20`,
                          color: getStatusColor(selectedAgentData.status),
                        }}
                      >
                        {selectedAgentData.status}
                      </div>
                    </div>
                    <p className="text-[14px] text-[#A09E96]">{selectedAgentData.description}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#0D0D15] rounded-lg p-4 border border-[rgba(255,255,255,0.06)]">
                    <p className="text-[11px] text-[#6B6963] uppercase tracking-wider mb-1">Actions Today</p>
                    <p className="text-[24px] font-bold text-[#EEECE7]">{selectedAgentData.actionsToday}</p>
                  </div>
                  <div className="bg-[#0D0D15] rounded-lg p-4 border border-[rgba(255,255,255,0.06)]">
                    <p className="text-[11px] text-[#6B6963] uppercase tracking-wider mb-1">Cost Today</p>
                    <p className="text-[24px] font-bold text-[#C9843A] font-mono">
                      {selectedAgentData.costToday.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-[#0D0D15] rounded-lg p-4 border border-[rgba(255,255,255,0.06)]">
                    <p className="text-[11px] text-[#6B6963] uppercase tracking-wider mb-1">Last Active</p>
                    <p className="text-[16px] font-semibold text-[#EEECE7] font-mono">
                      {selectedAgentData.lastAction}
                    </p>
                  </div>
                </div>

                {/* Activity Log */}
                <div>
                  <h3 className="text-[16px] font-semibold text-[#EEECE7] mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {selectedAgentData.activityLog.length === 0 ? (
                      <div className="bg-[#0D0D15] rounded-lg p-3 border border-[rgba(255,255,255,0.06)] text-center">
                        <p className="text-[13px] text-[#A09E96]">No activity recorded</p>
                      </div>
                    ) : (
                      selectedAgentData.activityLog.map((log, i) => (
                        <div
                          key={i}
                          className="bg-[#0D0D15] rounded-lg p-3 border border-[rgba(255,255,255,0.06)]"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-[11px] font-mono text-[#6B6963] flex-shrink-0 mt-0.5">
                              {log.time}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] text-[#EEECE7] mb-1">{log.action}</p>
                              <p className="text-[12px] text-[#A09E96]">{log.result}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

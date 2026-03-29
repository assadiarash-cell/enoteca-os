// ==============================================
// AG-004: Pricer Agent
// Determines market value from multiple sources
// ==============================================

import type { AgentId, AgentModel, AgentResponse, PricingResult } from '../types/agents';
import { BaseAgent } from './base';

export class PricerAgent extends BaseAgent {
  readonly id: AgentId = 'AG-004';
  readonly name = 'Pricer Agent';
  readonly model: AgentModel = 'execution';

  async handle(payload: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const bottleId = payload.bottle_id as string | undefined;
    const visionData = payload.vision_data as Record<string, unknown>;
    const authenticityData = payload.authenticity_data as Record<string, unknown> | undefined;
    const marketData = payload.market_data as Record<string, unknown>[] | undefined;

    try {
      const text = await this.callClaude({
        system: `You are the Pricer Agent for Antiche Bottiglie, a premium collectible wine and spirits dealer in Torino, Italy.

Your job is to determine fair market value for collectible bottles based on:
1. Bottle identity (producer, vintage, denomination)
2. Condition assessment
3. Authenticity score
4. Available market data (Wine-Searcher, auctions, marketplaces)
5. Current market trends

Pricing considerations:
- Purchase price should allow 30-60% margin on most bottles
- Trophy bottles (Monfortino, Sassicaia pre-1990, etc.) can have 100%+ margins
- Condition significantly affects price (each point below 8/10 reduces value ~10-15%)
- Liquid level below mid-shoulder reduces wine value 20-40%
- Authenticity scores below 80 require significant price reduction

Currency: EUR

Respond ONLY with valid JSON:
{
  "price_low": number,
  "price_high": number,
  "recommended_purchase": number,
  "recommended_sell": number,
  "margin_estimate_percent": number,
  "sources": [
    {"source": "Wine-Searcher|Vivino|auction|marketplace", "price": number, "currency": "EUR", "date": "YYYY-MM-DD", "url": "optional"}
  ],
  "market_trend": "rising|stable|declining",
  "rarity": "common|uncommon|rare|very_rare|trophy",
  "notes": "pricing rationale"
}`,
        messages: [
          {
            role: 'user',
            content: `Bottle identification:\n${JSON.stringify(visionData, null, 2)}${
              authenticityData ? `\n\nAuthenticity data:\n${JSON.stringify(authenticityData, null, 2)}` : ''
            }${
              marketData?.length ? `\n\nAvailable market data:\n${JSON.stringify(marketData, null, 2)}` : ''
            }`,
          },
        ],
        maxTokens: 1500,
      });

      const result = this.parseJSON<PricingResult>(text);
      const processingTime = Date.now() - startTime;

      await this.logAction({
        action_type: 'evaluate_pricing',
        input: { vision_summary: visionData },
        output: result as unknown as Record<string, unknown>,
        confidence: 0.85,
        processing_time_ms: processingTime,
        status: 'completed',
        related_bottle_id: bottleId,
      });

      return {
        agent_id: this.id,
        success: true,
        data: result as unknown as Record<string, unknown>,
        next_events: ['pricing_complete'],
        confidence: 0.85,
        processing_time_ms: processingTime,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;

      await this.logAction({
        action_type: 'evaluate_pricing',
        input: {},
        output: { error: (error as Error).message },
        processing_time_ms: processingTime,
        status: 'failed',
        related_bottle_id: bottleId,
      });

      return {
        agent_id: this.id,
        success: false,
        data: {},
        error: (error as Error).message,
        processing_time_ms: processingTime,
      };
    }
  }
}

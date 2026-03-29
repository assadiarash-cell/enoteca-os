// ==============================================
// AG-008: Matchmaker Agent
// Matches bottles with potential buyers
// ==============================================

import type { AgentId, AgentModel, AgentResponse } from '../types/agents';
import { BaseAgent } from './base';

interface MatchResult {
  matches: {
    buyer_id: string;
    buyer_name: string;
    match_score: number;
    reasons: string[];
    suggested_approach: string;
    estimated_price_willingness: number;
  }[];
  recommended_listing_channels: string[];
  pricing_suggestion: number | null;
}

export class MatchmakerAgent extends BaseAgent {
  readonly id: AgentId = 'AG-008';
  readonly name = 'Matchmaker Agent';
  readonly model: AgentModel = 'execution';

  async handle(payload: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const bottleData = payload.bottle_data as Record<string, unknown>;
    const buyers = payload.buyers as Record<string, unknown>[];

    try {
      const text = await this.callClaude({
        system: `You are the Matchmaker Agent for Antiche Bottiglie. You match collectible bottles with the most suitable buyers.

Consider:
- Buyer preferences (categories, producers, regions, price ranges)
- Purchase history and patterns
- Payment reliability
- Geographic proximity (affects shipping)
- Buyer type (international dealers may pay more for Italian wines)

Score each match 0-100 and provide reasoning.

JSON response:
{
  "matches": [
    {
      "buyer_id": "uuid",
      "buyer_name": "name",
      "match_score": 0-100,
      "reasons": ["why this buyer matches"],
      "suggested_approach": "how to present this bottle to this buyer",
      "estimated_price_willingness": number
    }
  ],
  "recommended_listing_channels": ["channel1", "channel2"],
  "pricing_suggestion": number or null
}`,
        messages: [
          {
            role: 'user',
            content: `Bottle:\n${JSON.stringify(bottleData, null, 2)}\n\nAvailable buyers:\n${JSON.stringify(buyers, null, 2)}`,
          },
        ],
        maxTokens: 2000,
      });

      const result = this.parseJSON<MatchResult>(text);
      const processingTime = Date.now() - startTime;

      await this.logAction({
        action_type: 'match_buyers',
        input: { bottle_summary: bottleData },
        output: { match_count: result.matches.length } as Record<string, unknown>,
        processing_time_ms: processingTime,
        status: 'completed',
        related_bottle_id: payload.bottle_id as string | undefined,
      });

      return {
        agent_id: this.id,
        success: true,
        data: result as unknown as Record<string, unknown>,
        next_events: result.matches.length > 0 ? ['match_found'] : [],
        processing_time_ms: processingTime,
      };
    } catch (error) {
      return {
        agent_id: this.id,
        success: false,
        data: {},
        error: (error as Error).message,
        processing_time_ms: Date.now() - startTime,
      };
    }
  }
}

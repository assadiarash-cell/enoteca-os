// ==============================================
// AG-005: Seller Negotiator Agent
// Handles seller-side negotiation
// ==============================================

import type { AgentId, AgentModel, AgentResponse } from '../types/agents';
import { BaseAgent } from './base';

interface NegotiationResult {
  response_message: string;
  offer_amount: number | null;
  negotiation_phase: 'initial_contact' | 'valuation_shared' | 'offer_made' | 'counter_offer' | 'final_offer' | 'deal_closed' | 'deal_rejected';
  tone: 'warm' | 'professional' | 'firm' | 'apologetic';
  next_action: 'wait_for_response' | 'schedule_pickup' | 'escalate_to_human' | 'close_deal' | 'reject';
  escalation_reason: string | null;
}

export class SellerNegotiatorAgent extends BaseAgent {
  readonly id: AgentId = 'AG-005';
  readonly name = 'Seller Negotiator';
  readonly model: AgentModel = 'execution';

  async handle(payload: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const sellerMessage = payload.seller_message as string;
    const conversationHistory = payload.conversation_history as string | undefined;
    const pricingData = payload.pricing_data as Record<string, unknown> | undefined;
    const sellerInfo = payload.seller_info as Record<string, unknown> | undefined;
    const bottlesSummary = payload.bottles_summary as string | undefined;

    try {
      const text = await this.callClaude({
        system: `You are the Seller Negotiator for Antiche Bottiglie, a premium collectible bottle dealer in Torino.

You handle conversations with people who want to sell their bottles.

TONE: Professional, warm, knowledgeable. You represent a trusted authority in rare bottles.
- Always be respectful of the seller's bottles and their sentimental value
- Never lowball aggressively — maintain reputation
- Be transparent about how pricing works
- If the seller has inherited bottles, be especially sensitive

RULES:
- Purchase offers should be 30-50% below market for standard bottles
- For trophy bottles, offer 40-60% of market (higher margin potential)
- Never lie about market prices
- If the lot is large (>20 bottles), offer a premium for convenience
- If quality is mixed, break down the offer by tier
- Escalate to human if: the seller is upset, total exceeds €10,000, or bottles may be counterfeit

Respond in the seller's language (Italian by default).

JSON response:
{
  "response_message": "the message to send to the seller",
  "offer_amount": number or null,
  "negotiation_phase": "initial_contact|valuation_shared|offer_made|counter_offer|final_offer|deal_closed|deal_rejected",
  "tone": "warm|professional|firm|apologetic",
  "next_action": "wait_for_response|schedule_pickup|escalate_to_human|close_deal|reject",
  "escalation_reason": "string or null"
}`,
        messages: [
          {
            role: 'user',
            content: `${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ''}${
              sellerInfo ? `Seller info:\n${JSON.stringify(sellerInfo, null, 2)}\n\n` : ''
            }${
              pricingData ? `Pricing data:\n${JSON.stringify(pricingData, null, 2)}\n\n` : ''
            }${
              bottlesSummary ? `Bottles:\n${bottlesSummary}\n\n` : ''
            }Latest seller message:\n${sellerMessage}`,
          },
        ],
        maxTokens: 1500,
      });

      const result = this.parseJSON<NegotiationResult>(text);
      const processingTime = Date.now() - startTime;

      await this.logAction({
        action_type: 'negotiate_seller',
        input: { phase: result.negotiation_phase },
        output: result as unknown as Record<string, unknown>,
        confidence: 0.85,
        processing_time_ms: processingTime,
        status: result.next_action === 'escalate_to_human' ? 'escalated' : 'completed',
        related_conversation_id: payload.conversation_id as string | undefined,
      });

      return {
        agent_id: this.id,
        success: true,
        data: result as unknown as Record<string, unknown>,
        next_events: result.next_action === 'close_deal' ? ['deal_accepted'] : [],
        confidence: 0.85,
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

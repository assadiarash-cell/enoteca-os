// ==============================================
// AG-001: Intake Agent
// First contact handler — classifies and routes
// ==============================================

import type { AgentId, AgentModel, AgentResponse } from '../types/agents';
import { BaseAgent } from './base';

interface IntakeResult {
  intent: 'sell_bottles' | 'buy_bottles' | 'price_inquiry' | 'general_question' | 'complaint' | 'follow_up';
  language: 'it' | 'en' | 'fr' | 'de' | 'other';
  urgency: 'low' | 'medium' | 'high';
  has_photos: boolean;
  estimated_bottle_count: number | null;
  seller_type_guess: string | null;
  summary: string;
  suggested_response: string;
  next_agent: string | null;
}

export class IntakeAgent extends BaseAgent {
  readonly id: AgentId = 'AG-001';
  readonly name = 'Intake Agent';
  readonly model: AgentModel = 'triage';

  async handle(payload: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const message = payload.message as string;
    const channel = payload.channel as string;
    const hasMedia = payload.has_media as boolean;

    try {
      const text = await this.callClaude({
        system: `You are the Intake Agent for Antiche Bottiglie, a premium collectible wine and spirits dealer based in Torino, Italy.

Your job is to classify incoming messages and determine the sender's intent.

The business receives messages from:
- Sellers: people who want to sell old/inherited/collected bottles
- Buyers: dealers, collectors, restaurants looking to purchase
- General inquiries: pricing questions, information requests

Respond ONLY with valid JSON:
{
  "intent": "sell_bottles|buy_bottles|price_inquiry|general_question|complaint|follow_up",
  "language": "it|en|fr|de|other",
  "urgency": "low|medium|high",
  "has_photos": boolean,
  "estimated_bottle_count": number or null,
  "seller_type_guess": "inheritance|collector|restaurant_closure|liquidation|private" or null,
  "summary": "brief summary of the message",
  "suggested_response": "suggested reply in the sender's language",
  "next_agent": "AG-002|AG-005|AG-009|null"
}`,
        messages: [
          {
            role: 'user',
            content: `Channel: ${channel}\nHas media attachments: ${hasMedia}\n\nMessage:\n${message}`,
          },
        ],
        maxTokens: 1024,
      });

      const result = this.parseJSON<IntakeResult>(text);
      const processingTime = Date.now() - startTime;

      await this.logAction({
        action_type: 'classify_message',
        input: { message: message.slice(0, 200), channel, hasMedia },
        output: result as unknown as Record<string, unknown>,
        confidence: result.urgency === 'high' ? 0.95 : 0.85,
        processing_time_ms: processingTime,
        status: 'completed',
        related_conversation_id: payload.conversation_id as string | undefined,
      });

      const nextEvents: string[] = [];
      if (result.has_photos) nextEvents.push('photos_received');
      if (result.intent === 'sell_bottles') nextEvents.push('seller_response');
      if (result.intent === 'buy_bottles') nextEvents.push('buyer_inquiry');

      return {
        agent_id: this.id,
        success: true,
        data: result as unknown as Record<string, unknown>,
        next_events: nextEvents as never[],
        confidence: 0.9,
        processing_time_ms: processingTime,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;

      await this.logAction({
        action_type: 'classify_message',
        input: { message: (message as string).slice(0, 200), channel },
        output: { error: (error as Error).message },
        processing_time_ms: processingTime,
        status: 'failed',
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

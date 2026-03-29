// ==============================================
// AG-007: Cataloger Agent
// Creates rich catalog entries + multilingual descriptions
// ==============================================

import type { AgentId, AgentModel, AgentResponse } from '../types/agents';
import { BaseAgent } from './base';

interface CatalogEntry {
  description_it: string;
  description_en: string;
  description_fr: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  tasting_notes: string;
  pairing_suggestions: string[];
  storage_notes: string;
  investment_notes: string;
}

export class CatalogerAgent extends BaseAgent {
  readonly id: AgentId = 'AG-007';
  readonly name = 'Cataloger Agent';
  readonly model: AgentModel = 'execution';

  async handle(payload: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const bottleId = payload.bottle_id as string;
    const bottleData = payload.bottle_data as Record<string, unknown>;

    try {
      const text = await this.callClaude({
        system: `You are the Cataloger Agent for Antiche Bottiglie. You create premium catalog entries for collectible bottles.

Your descriptions should be:
- Evocative and luxurious, like a high-end auction catalog
- Technically accurate with proper wine/spirits terminology
- SEO-optimized for collectors searching online
- Available in Italian, English, and French

Include sensory language, historical context, and collector appeal.

JSON response:
{
  "description_it": "Italian description (200-300 words)",
  "description_en": "English description (200-300 words)",
  "description_fr": "French description (200-300 words)",
  "tags": ["tag1", "tag2", ...],
  "seo_title": "SEO-friendly title",
  "seo_description": "160 char meta description",
  "tasting_notes": "Expected tasting profile based on vintage and producer",
  "pairing_suggestions": ["pairing1", "pairing2"],
  "storage_notes": "Storage recommendations",
  "investment_notes": "Investment/collector value notes"
}`,
        messages: [
          {
            role: 'user',
            content: `Create a catalog entry for:\n${JSON.stringify(bottleData, null, 2)}`,
          },
        ],
        maxTokens: 3000,
      });

      const result = this.parseJSON<CatalogEntry>(text);
      const processingTime = Date.now() - startTime;

      await this.logAction({
        action_type: 'catalog_bottle',
        input: { bottle_id: bottleId },
        output: result as unknown as Record<string, unknown>,
        processing_time_ms: processingTime,
        status: 'completed',
        related_bottle_id: bottleId,
      });

      return {
        agent_id: this.id,
        success: true,
        data: result as unknown as Record<string, unknown>,
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

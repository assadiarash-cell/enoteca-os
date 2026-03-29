// ==============================================
// AG-002: Vision Agent
// Analyzes bottle photos — identifies, assesses condition
// ==============================================

import type { AgentId, AgentModel, AgentResponse, VisionAnalysis } from '../types/agents';
import { BaseAgent } from './base';

export class VisionAgent extends BaseAgent {
  readonly id: AgentId = 'AG-002';
  readonly name = 'Vision Agent';
  readonly model: AgentModel = 'execution';

  async handle(payload: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const photoUrls = payload.photo_urls as string[];
    const bottleId = payload.bottle_id as string | undefined;

    try {
      const imageContent = photoUrls.map((url) => ({
        type: 'image' as const,
        source: {
          type: 'url' as const,
          url,
        },
      }));

      const text = await this.callClaude({
        system: `You are the Vision Agent for Antiche Bottiglie, a premium collectible wine and spirits dealer.

You receive photos of bottles and must identify them and assess their condition.

Analyze EVERY detail visible in the photos:
- Label text (producer, wine name, vintage, denomination, region)
- Label condition (tears, stains, fading — rate 0-10)
- Capsule/closure condition (intact, damaged, replaced — rate 0-10)
- Liquid level (into_neck, base_neck, high_shoulder, mid_shoulder, low_shoulder, below_shoulder)
- Liquid color if visible
- Bottle format estimation
- Any signs of counterfeit or irregularity
- Overall condition (0-10)

For whisky/cognac/spirits: skip liquid_level, focus on seal integrity and label.

Respond ONLY with valid JSON:
{
  "identified": boolean,
  "producer": "string or null",
  "name": "string or null",
  "vintage": number or null,
  "denomination": "string or null",
  "region": "string or null",
  "country": "IT|FR|GB|US|etc or null",
  "category": "wine|whisky|cognac|rum|liqueur|champagne|other",
  "format": "375ml|750ml|1500ml|3000ml",
  "closure_type": "cork|screw_cap|wax|capsule|null",
  "label_condition": 0-10,
  "liquid_level": "string or null",
  "capsule_condition": 0-10,
  "overall_condition": 0-10,
  "confidence": 0-100,
  "notes": "observations about the bottle"
}`,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze these bottle photos:' },
              ...imageContent,
            ],
          },
        ],
        maxTokens: 1500,
      });

      const result = this.parseJSON<VisionAnalysis>(text);
      const processingTime = Date.now() - startTime;

      await this.logAction({
        action_type: 'analyze_photos',
        input: { photo_count: photoUrls.length },
        output: result as unknown as Record<string, unknown>,
        confidence: result.confidence / 100,
        processing_time_ms: processingTime,
        status: 'completed',
        related_bottle_id: bottleId,
      });

      return {
        agent_id: this.id,
        success: true,
        data: result as unknown as Record<string, unknown>,
        next_events: ['vision_complete'],
        confidence: result.confidence / 100,
        processing_time_ms: processingTime,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;

      await this.logAction({
        action_type: 'analyze_photos',
        input: { photo_count: photoUrls.length },
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

// ==============================================
// AG-003: Authenticator Agent
// Verifies bottle authenticity — strategic model
// ==============================================

import type { AgentId, AgentModel, AgentResponse, AuthenticityResult } from '../types/agents';
import { BaseAgent } from './base';

export class AuthenticatorAgent extends BaseAgent {
  readonly id: AgentId = 'AG-003';
  readonly name = 'Authenticator Agent';
  readonly model: AgentModel = 'strategic';

  async handle(payload: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const visionData = payload.vision_data as Record<string, unknown>;
    const photoUrls = payload.photo_urls as string[] | undefined;
    const bottleId = payload.bottle_id as string | undefined;

    try {
      const messages: { role: 'user'; content: string | Array<{ type: string; [key: string]: unknown }> }[] = [];

      if (photoUrls?.length) {
        const imageContent = photoUrls.map((url) => ({
          type: 'image' as const,
          source: { type: 'url' as const, url },
        }));
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: `Vision analysis results:\n${JSON.stringify(visionData, null, 2)}\n\nPlease verify authenticity from these photos:` },
            ...imageContent,
          ],
        });
      } else {
        messages.push({
          role: 'user',
          content: `Vision analysis results:\n${JSON.stringify(visionData, null, 2)}\n\nVerify authenticity based on the analysis data.`,
        });
      }

      const text = await this.callClaude({
        system: `You are the Authenticator Agent for Antiche Bottiglie. You are an expert in wine and spirits authentication with decades of experience.

Your job is to assess whether a bottle is authentic based on:
1. Label design consistency with known originals (font, layout, print quality)
2. Capsule integrity and design
3. Cork/closure authenticity signs
4. Liquid level appropriate for the age
5. Overall presentation and any red flags

Known counterfeit indicators:
- Label fonts inconsistent with production era
- Modern printing techniques on supposedly old bottles
- Capsule material anachronistic for the era
- Liquid level too high for stated age
- Unusual label adhesive patterns

Score from 0-100:
- 90-100: Highly likely authentic
- 75-89: Likely authentic, minor uncertainties
- 50-74: Uncertain — manual review recommended
- 25-49: Suspicious — multiple red flags
- 0-24: Likely counterfeit

Respond ONLY with valid JSON:
{
  "score": 0-100,
  "verdict": "authentic|likely_authentic|uncertain|suspicious|likely_counterfeit",
  "flags": ["list of concerns or positive indicators"],
  "analysis": "detailed analysis text",
  "reference_matches": ["known similar authentic bottles if any"]
}`,
        messages,
        maxTokens: 2000,
      });

      const result = this.parseJSON<AuthenticityResult>(text);
      const processingTime = Date.now() - startTime;

      await this.logAction({
        action_type: 'verify_authenticity',
        input: { vision_summary: visionData },
        output: result as unknown as Record<string, unknown>,
        confidence: result.score / 100,
        processing_time_ms: processingTime,
        status: 'completed',
        related_bottle_id: bottleId,
      });

      return {
        agent_id: this.id,
        success: true,
        data: result as unknown as Record<string, unknown>,
        next_events: ['authentication_complete'],
        confidence: result.score / 100,
        processing_time_ms: processingTime,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;

      await this.logAction({
        action_type: 'verify_authenticity',
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

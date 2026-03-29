// ==============================================
// ENOTECA OS — Agent Router (Conductor)
// Routes events to the appropriate agent(s)
// ==============================================

import type { AgentEvent, AgentEventType, AgentResponse } from '../types/agents';
import type { AgentContext } from './base';
import { IntakeAgent } from './intake';
import { VisionAgent } from './vision';
import { AuthenticatorAgent } from './authenticator';
import { PricerAgent } from './pricer';
import { SellerNegotiatorAgent } from './negotiator';
import { CatalogerAgent } from './cataloger';
import { MatchmakerAgent } from './matchmaker';

export class AgentRouter {
  private context: AgentContext;

  constructor(context: AgentContext) {
    this.context = context;
  }

  async routeEvent(event: AgentEvent): Promise<AgentResponse | AgentResponse[]> {
    switch (event.type) {
      case 'new_whatsapp_message':
      case 'new_email':
      case 'web_form_submission':
        return new IntakeAgent(this.context).handle(event.payload);

      case 'photos_received':
      case 'scan_triggered':
        return new VisionAgent(this.context).handle(event.payload);

      case 'vision_complete':
        return new AuthenticatorAgent(this.context).handle(event.payload);

      case 'authentication_complete':
        return new PricerAgent(this.context).handle(event.payload);

      case 'pricing_complete':
      case 'seller_response':
        return new SellerNegotiatorAgent(this.context).handle(event.payload);

      case 'bottle_acquired': {
        // Parallel: catalog + find buyers
        const [catalogResult, matchResult] = await Promise.all([
          new CatalogerAgent(this.context).handle(event.payload),
          new MatchmakerAgent(this.context).handle(event.payload),
        ]);
        return [catalogResult, matchResult];
      }

      case 'deal_accepted':
        // Closer agent — simplified for now
        return {
          agent_id: 'AG-006',
          success: true,
          data: { action: 'deal_closure_initiated', payload: event.payload },
          processing_time_ms: 0,
        };

      case 'buyer_inquiry':
      case 'match_found':
      case 'buyer_response':
        // Sales Negotiator — simplified for now
        return {
          agent_id: 'AG-009',
          success: true,
          data: { action: 'sales_negotiation_initiated', payload: event.payload },
          processing_time_ms: 0,
        };

      case 'bottle_listed':
      case 'content_requested':
        // Content Agent — simplified
        return {
          agent_id: 'AG-010',
          success: true,
          data: { action: 'content_generation_initiated', payload: event.payload },
          processing_time_ms: 0,
        };

      case 'reprice_requested':
        return new PricerAgent(this.context).handle(event.payload);

      default:
        return {
          agent_id: 'AG-001',
          success: false,
          data: {},
          error: `No handler for event type: ${event.type}`,
          processing_time_ms: 0,
        };
    }
  }

  /**
   * Full acquisition pipeline: photos → vision → auth → pricing
   * Used when a seller submits photos for the first time
   */
  async runAcquisitionPipeline(params: {
    photo_urls: string[];
    bottle_id?: string;
    conversation_id?: string;
  }): Promise<{
    vision: AgentResponse;
    authenticity: AgentResponse;
    pricing: AgentResponse;
  }> {
    // Step 1: Vision analysis
    const vision = await new VisionAgent(this.context).handle({
      photo_urls: params.photo_urls,
      bottle_id: params.bottle_id,
    });

    if (!vision.success) {
      return { vision, authenticity: { ...vision, agent_id: 'AG-003' }, pricing: { ...vision, agent_id: 'AG-004' } };
    }

    // Step 2: Authenticity check
    const authenticity = await new AuthenticatorAgent(this.context).handle({
      vision_data: vision.data,
      photo_urls: params.photo_urls,
      bottle_id: params.bottle_id,
    });

    if (!authenticity.success) {
      return { vision, authenticity, pricing: { ...authenticity, agent_id: 'AG-004' } };
    }

    // Step 3: Pricing
    const pricing = await new PricerAgent(this.context).handle({
      vision_data: vision.data,
      authenticity_data: authenticity.data,
      bottle_id: params.bottle_id,
    });

    return { vision, authenticity, pricing };
  }

  /**
   * Post-acquisition pipeline: catalog + match buyers (parallel)
   */
  async runPostAcquisitionPipeline(params: {
    bottle_id: string;
    bottle_data: Record<string, unknown>;
    buyers: Record<string, unknown>[];
  }): Promise<{
    catalog: AgentResponse;
    matches: AgentResponse;
  }> {
    const [catalog, matches] = await Promise.all([
      new CatalogerAgent(this.context).handle({
        bottle_id: params.bottle_id,
        bottle_data: params.bottle_data,
      }),
      new MatchmakerAgent(this.context).handle({
        bottle_id: params.bottle_id,
        bottle_data: params.bottle_data,
        buyers: params.buyers,
      }),
    ]);

    return { catalog, matches };
  }
}

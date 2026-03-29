// ==============================================
// ENOTECA OS — Base Agent Class
// ==============================================

import { AGENT_MODELS, type AgentId, type AgentModel, type AgentResponse } from '../types/agents';

export interface AgentContext {
  org_id: string;
  anthropic_api_key: string;
  supabase_url: string;
  supabase_service_key: string;
}

export abstract class BaseAgent {
  abstract readonly id: AgentId;
  abstract readonly name: string;
  abstract readonly model: AgentModel;

  protected context: AgentContext;

  constructor(context: AgentContext) {
    this.context = context;
  }

  get modelId(): string {
    return AGENT_MODELS[this.model];
  }

  protected async callClaude(params: {
    system: string;
    messages: { role: 'user' | 'assistant'; content: string | Array<{ type: string; [key: string]: unknown }> }[];
    maxTokens?: number;
  }): Promise<string> {
    const startTime = Date.now();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.context.anthropic_api_key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.modelId,
        max_tokens: params.maxTokens ?? 2048,
        system: params.system,
        messages: params.messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} — ${error}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.type === 'text' ? data.content[0].text : '';

    return text;
  }

  protected parseJSON<T>(text: string): T {
    // Strip markdown code fences if present
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return JSON.parse(cleaned) as T;
    } catch (e) {
      throw new Error(`Failed to parse agent response as JSON: ${(e as Error).message}\nRaw text: ${text.slice(0, 500)}`);
    }
  }

  protected async logAction(params: {
    action_type: string;
    input: Record<string, unknown>;
    output: Record<string, unknown>;
    confidence?: number;
    processing_time_ms: number;
    tokens_used?: number;
    cost_usd?: number;
    status: 'completed' | 'failed' | 'escalated';
    related_bottle_id?: string;
    related_conversation_id?: string;
  }): Promise<void> {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(this.context.supabase_url, this.context.supabase_service_key);

    await supabase.from('agent_actions').insert({
      org_id: this.context.org_id,
      agent_id: this.id,
      agent_name: this.name,
      ...params,
    });
  }

  abstract handle(payload: Record<string, unknown>): Promise<AgentResponse>;
}

// ==============================================
// ENOTECA OS — AI Agent Types
// 19 Agents organized by domain
// ==============================================

export type AgentModel = 'triage' | 'execution' | 'strategic';

export const AGENT_MODELS = {
  triage: 'claude-haiku-4-5-20251001',
  execution: 'claude-sonnet-4-6',
  strategic: 'claude-opus-4-6',
} as const;

// Agent IDs and definitions
export type AgentId =
  | 'AG-001' // Intake Agent
  | 'AG-002' // Vision Agent
  | 'AG-003' // Authenticator Agent
  | 'AG-004' // Pricer Agent
  | 'AG-005' // Negotiator Agent (Seller)
  | 'AG-006' // Closer Agent
  | 'AG-007' // Cataloger Agent
  | 'AG-008' // Matchmaker Agent
  | 'AG-009' // Sales Negotiator Agent (Buyer)
  | 'AG-010' // Content Agent
  | 'AG-011' // SEO Agent
  | 'AG-012' // Newsletter Agent
  | 'AG-013' // Scout Agent (Market Monitor)
  | 'AG-014' // Analytics Agent
  | 'AG-015' // Inventory Agent
  | 'AG-016' // Quality Agent
  | 'AG-017' // CRM Agent
  | 'AG-018' // Logistics Agent
  | 'AG-019'; // Compliance Agent

export interface AgentDefinition {
  id: AgentId;
  name: string;
  description: string;
  domain: 'acquisition' | 'inventory' | 'sales' | 'content' | 'intelligence' | 'operations';
  model: AgentModel;
  triggers: string[];
  capabilities: string[];
}

export const AGENTS: AgentDefinition[] = [
  {
    id: 'AG-001',
    name: 'Intake Agent',
    description: 'First contact handler. Classifies incoming messages, extracts intent, routes to appropriate agent.',
    domain: 'acquisition',
    model: 'triage',
    triggers: ['new_whatsapp_message', 'new_email', 'web_form_submission'],
    capabilities: ['intent_classification', 'language_detection', 'urgency_assessment', 'routing'],
  },
  {
    id: 'AG-002',
    name: 'Vision Agent',
    description: 'Analyzes bottle photos. Identifies producer, vintage, denomination. Assesses label/capsule/liquid condition.',
    domain: 'acquisition',
    model: 'execution',
    triggers: ['photos_received', 'scan_triggered'],
    capabilities: ['bottle_identification', 'condition_assessment', 'label_reading', 'format_detection'],
  },
  {
    id: 'AG-003',
    name: 'Authenticator Agent',
    description: 'Verifies bottle authenticity. Cross-references label design, capsule, cork, printing quality against known originals.',
    domain: 'acquisition',
    model: 'strategic',
    triggers: ['vision_complete'],
    capabilities: ['authenticity_scoring', 'counterfeit_detection', 'flag_generation', 'provenance_verification'],
  },
  {
    id: 'AG-004',
    name: 'Pricer Agent',
    description: 'Determines market value. Aggregates data from Wine-Searcher, auctions, marketplaces. Generates pricing range.',
    domain: 'acquisition',
    model: 'execution',
    triggers: ['authentication_complete', 'reprice_requested'],
    capabilities: ['market_analysis', 'price_range_estimation', 'margin_calculation', 'source_aggregation'],
  },
  {
    id: 'AG-005',
    name: 'Seller Negotiator',
    description: 'Handles seller-side negotiation. Generates offers, counter-offers, manages conversation tone.',
    domain: 'acquisition',
    model: 'execution',
    triggers: ['pricing_complete', 'seller_response'],
    capabilities: ['offer_generation', 'counter_offer', 'tone_management', 'deal_structuring'],
  },
  {
    id: 'AG-006',
    name: 'Closer Agent',
    description: 'Finalizes acquisitions. Handles payment instructions, pickup scheduling, documentation.',
    domain: 'acquisition',
    model: 'execution',
    triggers: ['deal_accepted'],
    capabilities: ['payment_processing', 'pickup_scheduling', 'documentation', 'confirmation'],
  },
  {
    id: 'AG-007',
    name: 'Cataloger Agent',
    description: 'Creates rich catalog entries. Generates multilingual descriptions, tags, SEO metadata for acquired bottles.',
    domain: 'inventory',
    model: 'execution',
    triggers: ['bottle_acquired', 'catalog_update_requested'],
    capabilities: ['description_generation', 'tagging', 'seo_optimization', 'multilingual_content'],
  },
  {
    id: 'AG-008',
    name: 'Matchmaker Agent',
    description: 'Matches bottles with potential buyers based on preferences, purchase history, and buying patterns.',
    domain: 'sales',
    model: 'execution',
    triggers: ['bottle_acquired', 'new_buyer_registered', 'buyer_preferences_updated'],
    capabilities: ['buyer_matching', 'recommendation_engine', 'preference_scoring', 'outreach_suggestion'],
  },
  {
    id: 'AG-009',
    name: 'Sales Negotiator',
    description: 'Handles buyer-side conversations. Presents bottles, negotiates pricing, manages purchase flow.',
    domain: 'sales',
    model: 'execution',
    triggers: ['buyer_inquiry', 'match_found', 'buyer_response'],
    capabilities: ['presentation', 'price_negotiation', 'upselling', 'bundle_suggestion'],
  },
  {
    id: 'AG-010',
    name: 'Content Agent',
    description: 'Generates social media posts, product listings, and marketing copy for bottles.',
    domain: 'content',
    model: 'execution',
    triggers: ['bottle_listed', 'content_scheduled', 'content_requested'],
    capabilities: ['social_post_generation', 'listing_creation', 'copywriting', 'hashtag_optimization'],
  },
  {
    id: 'AG-011',
    name: 'SEO Agent',
    description: 'Creates SEO-optimized blog posts and landing pages about wines, regions, producers.',
    domain: 'content',
    model: 'execution',
    triggers: ['seo_schedule', 'trending_topic_detected'],
    capabilities: ['blog_generation', 'keyword_research', 'meta_optimization', 'internal_linking'],
  },
  {
    id: 'AG-012',
    name: 'Newsletter Agent',
    description: 'Curates and generates email newsletters with featured bottles, market insights, new arrivals.',
    domain: 'content',
    model: 'execution',
    triggers: ['newsletter_schedule', 'manual_trigger'],
    capabilities: ['curation', 'newsletter_composition', 'personalization', 'ab_testing'],
  },
  {
    id: 'AG-013',
    name: 'Scout Agent',
    description: 'Monitors external marketplaces for underpriced bottles, auction opportunities, and market trends.',
    domain: 'intelligence',
    model: 'execution',
    triggers: ['scrape_complete', 'market_scan_schedule'],
    capabilities: ['opportunity_detection', 'price_alerting', 'trend_analysis', 'competitor_monitoring'],
  },
  {
    id: 'AG-014',
    name: 'Analytics Agent',
    description: 'Generates business intelligence reports, KPI summaries, trend analysis, and strategic recommendations.',
    domain: 'intelligence',
    model: 'strategic',
    triggers: ['daily_report_schedule', 'analytics_requested', 'anomaly_detected'],
    capabilities: ['kpi_calculation', 'trend_reporting', 'anomaly_detection', 'strategic_recommendation'],
  },
  {
    id: 'AG-015',
    name: 'Inventory Agent',
    description: 'Monitors inventory health. Flags stagnant bottles, suggests repricing, manages aging alerts.',
    domain: 'operations',
    model: 'triage',
    triggers: ['daily_inventory_check', 'bottle_status_changed'],
    capabilities: ['stagnation_detection', 'repricing_suggestion', 'aging_alerts', 'rotation_optimization'],
  },
  {
    id: 'AG-016',
    name: 'Quality Agent',
    description: 'Ensures data quality across the system. Validates entries, deduplicates, standardizes formats.',
    domain: 'operations',
    model: 'triage',
    triggers: ['data_entry', 'batch_import', 'quality_check_schedule'],
    capabilities: ['validation', 'deduplication', 'standardization', 'enrichment'],
  },
  {
    id: 'AG-017',
    name: 'CRM Agent',
    description: 'Manages seller and buyer relationships. Tracks engagement, suggests follow-ups, scores leads.',
    domain: 'operations',
    model: 'execution',
    triggers: ['interaction_logged', 'follow_up_schedule', 'lead_score_update'],
    capabilities: ['lead_scoring', 'follow_up_scheduling', 'relationship_tracking', 'segment_management'],
  },
  {
    id: 'AG-018',
    name: 'Logistics Agent',
    description: 'Handles shipping and delivery logistics. Generates shipping labels, tracks parcels, manages carriers.',
    domain: 'operations',
    model: 'triage',
    triggers: ['sale_confirmed', 'shipping_requested', 'tracking_update'],
    capabilities: ['shipping_label_generation', 'carrier_selection', 'tracking', 'delivery_confirmation'],
  },
  {
    id: 'AG-019',
    name: 'Compliance Agent',
    description: 'Ensures regulatory compliance. Checks alcohol shipping laws, tax obligations, documentation requirements.',
    domain: 'operations',
    model: 'triage',
    triggers: ['sale_to_new_country', 'compliance_check_requested', 'regulation_update'],
    capabilities: ['regulation_check', 'documentation_validation', 'tax_calculation', 'restriction_alerting'],
  },
];

// Agent event types
export type AgentEventType =
  | 'new_whatsapp_message'
  | 'new_email'
  | 'web_form_submission'
  | 'photos_received'
  | 'scan_triggered'
  | 'vision_complete'
  | 'authentication_complete'
  | 'pricing_complete'
  | 'seller_response'
  | 'deal_accepted'
  | 'bottle_acquired'
  | 'bottle_listed'
  | 'buyer_inquiry'
  | 'match_found'
  | 'buyer_response'
  | 'sale_confirmed'
  | 'reprice_requested'
  | 'content_requested'
  | 'manual_trigger';

export interface AgentEvent {
  type: AgentEventType;
  org_id: string;
  payload: Record<string, unknown>;
  triggered_by?: string;
  timestamp: string;
}

export interface AgentResponse {
  agent_id: AgentId;
  success: boolean;
  data: Record<string, unknown>;
  next_events?: AgentEventType[];
  confidence?: number;
  processing_time_ms?: number;
  tokens_used?: number;
  error?: string;
}

// Vision Agent specific types
export interface VisionAnalysis {
  identified: boolean;
  producer: string | null;
  name: string | null;
  vintage: number | null;
  denomination: string | null;
  region: string | null;
  country: string | null;
  category: string;
  format: string;
  closure_type: string | null;
  label_condition: number;
  liquid_level: string | null;
  capsule_condition: number;
  overall_condition: number;
  confidence: number;
  notes: string;
}

// Authenticator Agent specific types
export interface AuthenticityResult {
  score: number; // 0-100
  verdict: 'authentic' | 'likely_authentic' | 'uncertain' | 'suspicious' | 'likely_counterfeit';
  flags: string[];
  analysis: string;
  reference_matches: string[];
}

// Pricer Agent specific types
export interface PricingResult {
  price_low: number;
  price_high: number;
  recommended_purchase: number;
  recommended_sell: number;
  margin_estimate_percent: number;
  sources: {
    source: string;
    price: number;
    currency: string;
    date: string;
    url?: string;
  }[];
  market_trend: 'rising' | 'stable' | 'declining';
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'trophy';
  notes: string;
}

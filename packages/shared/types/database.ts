// ==============================================
// ENOTECA OS — Database Types
// Generated from Supabase schema
// ==============================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'trial' | 'base' | 'pro' | 'enterprise';
  logo_url: string | null;
  whatsapp_number: string | null;
  email: string | null;
  settings: Record<string, unknown>;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  org_id: string;
  email: string;
  full_name: string | null;
  role: 'owner' | 'admin' | 'operator' | 'viewer';
  avatar_url: string | null;
  phone: string | null;
  preferences: Record<string, unknown>;
  last_active_at: string | null;
  created_at: string;
}

export type BottleCategory = 'wine' | 'whisky' | 'cognac' | 'rum' | 'liqueur' | 'champagne' | 'other';
export type BottleStatus = 'pending_valuation' | 'valued' | 'acquired' | 'in_inventory' | 'listed' | 'reserved' | 'sold' | 'rejected';
export type LiquidLevel = 'into_neck' | 'base_neck' | 'high_shoulder' | 'mid_shoulder' | 'low_shoulder' | 'below_shoulder';
export type BottleFormat = '375ml' | '750ml' | '1500ml' | '3000ml' | '5000ml' | '6000ml';

export interface Bottle {
  id: string;
  org_id: string;

  // Identity
  category: BottleCategory;
  producer: string | null;
  name: string;
  vintage: number | null;
  denomination: string | null;
  region: string | null;
  country: string | null;

  // Physical
  format: BottleFormat;
  closure_type: string | null;

  // Condition
  label_condition: number | null;
  liquid_level: LiquidLevel | null;
  liquid_color: string | null;
  capsule_condition: number | null;
  overall_condition: number | null;

  // AI Analysis
  vision_data: Record<string, unknown>;
  authenticity_score: number | null;
  authenticity_flags: string[] | null;

  // Pricing
  purchase_price: number | null;
  target_sell_price: number | null;
  market_price_low: number | null;
  market_price_high: number | null;
  pricing_sources: Record<string, unknown>;

  // Status
  status: BottleStatus;

  // Provenance
  seller_id: string | null;
  buyer_id: string | null;
  acquisition_id: string | null;

  // Media
  photos: string[] | null;
  primary_photo: string | null;

  // Metadata
  notes: string | null;
  tags: string[] | null;
  ai_description: Record<string, unknown>;

  // Timestamps
  valued_at: string | null;
  acquired_at: string | null;
  listed_at: string | null;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
}

export type SellerType = 'inheritance' | 'collector' | 'restaurant_closure' | 'liquidation' | 'private';
export type SourceChannel = 'whatsapp' | 'email' | 'website' | 'facebook' | 'instagram' | 'phone' | 'referral';

export interface Seller {
  id: string;
  org_id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  province: string | null;
  city: string | null;
  seller_type: SellerType | null;
  source_channel: SourceChannel | null;
  notes: string | null;
  total_transactions: number;
  total_value: number;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export type BuyerType = 'dealer_international' | 'dealer_domestic' | 'collector' | 'restaurant' | 'bar';

export interface Buyer {
  id: string;
  org_id: string;
  full_name: string | null;
  company_name: string | null;
  buyer_type: BuyerType | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  preferences: {
    categories?: BottleCategory[];
    producers?: string[];
    price_range?: { min: number; max: number };
    regions?: string[];
  };
  total_purchases: number;
  total_spent: number;
  avg_deal_value: number | null;
  payment_reliability: number | null;
  last_purchase_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type AcquisitionStatus =
  | 'negotiating'
  | 'offered'
  | 'accepted'
  | 'scheduled_pickup'
  | 'picked_up'
  | 'verified'
  | 'paid'
  | 'completed'
  | 'cancelled';

export interface Acquisition {
  id: string;
  org_id: string;
  seller_id: string;
  status: AcquisitionStatus;
  total_bottles: number | null;
  total_offer: number | null;
  total_final: number | null;
  pickup_date: string | null;
  pickup_address: string | null;
  payment_method: 'bank_transfer' | 'cash' | 'check' | null;
  payment_status: 'pending' | 'processing' | 'completed';
  conversation_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type SaleStatus =
  | 'negotiating'
  | 'agreed'
  | 'invoiced'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface Sale {
  id: string;
  org_id: string;
  buyer_id: string;
  status: SaleStatus;
  total_amount: number | null;
  margin_amount: number | null;
  margin_percent: number | null;
  invoice_number: string | null;
  shipping_tracking: string | null;
  shipping_carrier: string | null;
  conversation_id: string | null;
  notes: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  bottle_id: string;
  unit_price: number;
  quantity: number;
}

export type ConversationChannel = 'whatsapp' | 'email' | 'web_chat' | 'internal';
export type ConversationDirection = 'inbound_seller' | 'inbound_buyer' | 'outbound_seller' | 'outbound_buyer';

export interface Conversation {
  id: string;
  org_id: string;
  channel: ConversationChannel;
  external_contact: string | null;
  contact_name: string | null;
  direction: ConversationDirection;
  status: 'active' | 'waiting_response' | 'closed' | 'escalated';
  assigned_agent: string | null;
  escalated_to: string | null;
  context: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type MessageRole = 'user' | 'assistant' | 'system' | 'agent';

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  media_urls: string[] | null;
  agent_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AgentAction {
  id: string;
  org_id: string;
  agent_id: string;
  agent_name: string;
  action_type: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  confidence: number | null;
  processing_time_ms: number | null;
  tokens_used: number | null;
  cost_usd: number | null;
  status: 'started' | 'completed' | 'failed' | 'escalated';
  related_bottle_id: string | null;
  related_conversation_id: string | null;
  created_at: string;
}

export interface MarketData {
  id: string;
  source: string;
  producer: string | null;
  wine_name: string | null;
  vintage: number | null;
  price: number | null;
  currency: string;
  condition_notes: string | null;
  auction_date: string | null;
  url: string | null;
  raw_data: Record<string, unknown>;
  scraped_at: string;
}

export type ContentType = 'blog_post' | 'instagram_post' | 'facebook_post' | 'newsletter' | 'product_listing';

export interface Content {
  id: string;
  org_id: string;
  content_type: ContentType;
  title: string | null;
  body: string | null;
  media_urls: string[] | null;
  seo_keywords: string[] | null;
  language: string;
  status: 'draft' | 'scheduled' | 'published';
  published_at: string | null;
  related_bottle_id: string | null;
  performance: Record<string, unknown>;
  created_at: string;
}

export type AlertType = 'trophy_bottle' | 'stagnant_inventory' | 'price_change' | 'new_lead' | 'deal_pending' | 'authenticity_flag';

export interface Alert {
  id: string;
  org_id: string;
  alert_type: AlertType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string | null;
  action_url: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  is_read: boolean;
  is_actioned: boolean;
  created_at: string;
}

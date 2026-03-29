-- ==============================================
-- ENOTECA OS — Initial Database Schema
-- ==============================================

-- ORGANIZATIONS (multi-tenant SaaS)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'trial'
    CHECK (plan IN ('trial', 'base', 'pro', 'enterprise')),
  logo_url TEXT,
  whatsapp_number TEXT,
  email TEXT,
  settings JSONB DEFAULT '{}',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- USERS (operators within organizations)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'operator'
    CHECK (role IN ('owner', 'admin', 'operator', 'viewer')),
  avatar_url TEXT,
  phone TEXT,
  preferences JSONB DEFAULT '{}',
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SELLERS (people selling bottles TO the dealer)
CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  province TEXT,
  city TEXT,
  seller_type TEXT CHECK (seller_type IN ('inheritance', 'collector', 'restaurant_closure', 'liquidation', 'private')),
  source_channel TEXT CHECK (source_channel IN ('whatsapp', 'email', 'website', 'facebook', 'instagram', 'phone', 'referral')),
  notes TEXT,
  total_transactions INTEGER DEFAULT 0,
  total_value NUMERIC(12,2) DEFAULT 0,
  rating NUMERIC(3,1),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- BUYERS (people buying FROM the dealer)
CREATE TABLE buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  full_name TEXT,
  company_name TEXT,
  buyer_type TEXT CHECK (buyer_type IN ('dealer_international', 'dealer_domestic', 'collector', 'restaurant', 'bar')),
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  country TEXT,
  city TEXT,
  preferences JSONB DEFAULT '{}',
  total_purchases INTEGER DEFAULT 0,
  total_spent NUMERIC(12,2) DEFAULT 0,
  avg_deal_value NUMERIC(12,2),
  payment_reliability NUMERIC(3,1),
  last_purchase_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CONVERSATIONS (AI agent conversations)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'web_chat', 'internal')),
  external_contact TEXT,
  contact_name TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('inbound_seller', 'inbound_buyer', 'outbound_seller', 'outbound_buyer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'waiting_response', 'closed', 'escalated')),
  assigned_agent TEXT,
  escalated_to UUID REFERENCES users(id),
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ACQUISITIONS (grouped purchases from a seller)
CREATE TABLE acquisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  seller_id UUID REFERENCES sellers(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'negotiating'
    CHECK (status IN ('negotiating', 'offered', 'accepted', 'scheduled_pickup', 'picked_up', 'verified', 'paid', 'completed', 'cancelled')),
  total_bottles INTEGER,
  total_offer NUMERIC(12,2),
  total_final NUMERIC(12,2),
  pickup_date TIMESTAMPTZ,
  pickup_address TEXT,
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'cash', 'check')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed')),
  conversation_id UUID REFERENCES conversations(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- BOTTLES (core entity)
CREATE TABLE bottles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,

  -- Identity
  category TEXT NOT NULL CHECK (category IN ('wine', 'whisky', 'cognac', 'rum', 'liqueur', 'champagne', 'other')),
  producer TEXT,
  name TEXT NOT NULL,
  vintage INTEGER,
  denomination TEXT,
  region TEXT,
  country TEXT,

  -- Physical
  format TEXT DEFAULT '750ml' CHECK (format IN ('375ml', '750ml', '1500ml', '3000ml', '5000ml', '6000ml')),
  closure_type TEXT,

  -- Condition (0-10 scale)
  label_condition NUMERIC(3,1),
  liquid_level TEXT CHECK (liquid_level IN ('into_neck', 'base_neck', 'high_shoulder', 'mid_shoulder', 'low_shoulder', 'below_shoulder')),
  liquid_color TEXT,
  capsule_condition NUMERIC(3,1),
  overall_condition NUMERIC(3,1),

  -- AI Analysis
  vision_data JSONB DEFAULT '{}',
  authenticity_score INTEGER CHECK (authenticity_score >= 0 AND authenticity_score <= 100),
  authenticity_flags TEXT[],

  -- Pricing
  purchase_price NUMERIC(12,2),
  target_sell_price NUMERIC(12,2),
  market_price_low NUMERIC(12,2),
  market_price_high NUMERIC(12,2),
  pricing_sources JSONB DEFAULT '{}',

  -- Status
  status TEXT NOT NULL DEFAULT 'pending_valuation'
    CHECK (status IN ('pending_valuation', 'valued', 'acquired', 'in_inventory', 'listed', 'reserved', 'sold', 'rejected')),

  -- Provenance
  seller_id UUID REFERENCES sellers(id),
  buyer_id UUID REFERENCES buyers(id),
  acquisition_id UUID REFERENCES acquisitions(id),

  -- Media
  photos TEXT[],
  primary_photo TEXT,

  -- Metadata
  notes TEXT,
  tags TEXT[],
  ai_description JSONB DEFAULT '{}',

  -- Timestamps
  valued_at TIMESTAMPTZ,
  acquired_at TIMESTAMPTZ,
  listed_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SALES (individual sale transactions)
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  buyer_id UUID REFERENCES buyers(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'negotiating'
    CHECK (status IN ('negotiating', 'agreed', 'invoiced', 'paid', 'shipped', 'delivered', 'completed', 'cancelled')),
  total_amount NUMERIC(12,2),
  margin_amount NUMERIC(12,2),
  margin_percent NUMERIC(5,2),
  invoice_number TEXT,
  shipping_tracking TEXT,
  shipping_carrier TEXT,
  conversation_id UUID REFERENCES conversations(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- SALE_ITEMS (bottles in a sale)
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
  bottle_id UUID REFERENCES bottles(id) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  quantity INTEGER DEFAULT 1
);

-- MESSAGES (individual messages in conversations)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'agent')),
  content TEXT NOT NULL,
  media_urls TEXT[],
  agent_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AGENT_ACTIONS (audit log of all AI agent actions)
CREATE TABLE agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  input JSONB DEFAULT '{}',
  output JSONB DEFAULT '{}',
  confidence NUMERIC(5,2),
  processing_time_ms INTEGER,
  tokens_used INTEGER,
  cost_usd NUMERIC(8,4),
  status TEXT DEFAULT 'completed' CHECK (status IN ('started', 'completed', 'failed', 'escalated')),
  related_bottle_id UUID REFERENCES bottles(id),
  related_conversation_id UUID REFERENCES conversations(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MARKET_DATA (scraped pricing data)
CREATE TABLE market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  producer TEXT,
  wine_name TEXT,
  vintage INTEGER,
  price NUMERIC(12,2),
  currency TEXT DEFAULT 'EUR',
  condition_notes TEXT,
  auction_date TIMESTAMPTZ,
  url TEXT,
  raw_data JSONB DEFAULT '{}',
  scraped_at TIMESTAMPTZ DEFAULT now()
);

-- CONTENT (generated content for SEO, social, newsletters)
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('blog_post', 'instagram_post', 'facebook_post', 'newsletter', 'product_listing')),
  title TEXT,
  body TEXT,
  media_urls TEXT[],
  seo_keywords TEXT[],
  language TEXT DEFAULT 'it',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  published_at TIMESTAMPTZ,
  related_bottle_id UUID REFERENCES bottles(id),
  performance JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ALERTS (system alerts for operators)
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('trophy_bottle', 'stagnant_inventory', 'price_change', 'new_lead', 'deal_pending', 'authenticity_flag')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT,
  action_url TEXT,
  related_entity_type TEXT,
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  is_actioned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================
-- INDEXES
-- ==============================================

CREATE INDEX idx_bottles_org ON bottles(org_id);
CREATE INDEX idx_bottles_status ON bottles(org_id, status);
CREATE INDEX idx_bottles_category ON bottles(org_id, category);
CREATE INDEX idx_bottles_seller ON bottles(seller_id);
CREATE INDEX idx_bottles_buyer ON bottles(buyer_id);
CREATE INDEX idx_bottles_acquisition ON bottles(acquisition_id);

CREATE INDEX idx_sellers_org ON sellers(org_id);
CREATE INDEX idx_buyers_org ON buyers(org_id);
CREATE INDEX idx_acquisitions_org ON acquisitions(org_id, status);
CREATE INDEX idx_acquisitions_seller ON acquisitions(seller_id);
CREATE INDEX idx_sales_org ON sales(org_id, status);
CREATE INDEX idx_sales_buyer ON sales(buyer_id);
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_bottle ON sale_items(bottle_id);

CREATE INDEX idx_conversations_org ON conversations(org_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_agent_actions_org ON agent_actions(org_id);
CREATE INDEX idx_agent_actions_agent ON agent_actions(agent_id);
CREATE INDEX idx_agent_actions_bottle ON agent_actions(related_bottle_id);
CREATE INDEX idx_market_data_source ON market_data(source, producer, vintage);
CREATE INDEX idx_content_org ON content(org_id, status);
CREATE INDEX idx_alerts_org ON alerts(org_id, is_read);

-- Full text search on bottles
CREATE INDEX idx_bottles_search ON bottles USING gin(
  to_tsvector('italian', coalesce(producer, '') || ' ' || name || ' ' || coalesce(denomination, '') || ' ' || coalesce(region, ''))
);

-- ==============================================
-- ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bottles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE acquisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's org_id
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS Policies
CREATE POLICY "org_isolation" ON organizations
  FOR ALL USING (id = get_user_org_id());

CREATE POLICY "org_isolation" ON users
  FOR ALL USING (org_id = get_user_org_id());

CREATE POLICY "org_isolation" ON bottles
  FOR ALL USING (org_id = get_user_org_id());

CREATE POLICY "org_isolation" ON sellers
  FOR ALL USING (org_id = get_user_org_id());

CREATE POLICY "org_isolation" ON buyers
  FOR ALL USING (org_id = get_user_org_id());

CREATE POLICY "org_isolation" ON acquisitions
  FOR ALL USING (org_id = get_user_org_id());

CREATE POLICY "org_isolation" ON sales
  FOR ALL USING (org_id = get_user_org_id());

CREATE POLICY "org_isolation" ON sale_items
  FOR ALL USING (
    sale_id IN (SELECT id FROM sales WHERE org_id = get_user_org_id())
  );

CREATE POLICY "org_isolation" ON conversations
  FOR ALL USING (org_id = get_user_org_id());

CREATE POLICY "org_isolation" ON messages
  FOR ALL USING (
    conversation_id IN (SELECT id FROM conversations WHERE org_id = get_user_org_id())
  );

CREATE POLICY "org_isolation" ON agent_actions
  FOR ALL USING (org_id = get_user_org_id());

CREATE POLICY "org_isolation" ON content
  FOR ALL USING (org_id = get_user_org_id());

CREATE POLICY "org_isolation" ON alerts
  FOR ALL USING (org_id = get_user_org_id());

-- Market data is read-only for all authenticated users
CREATE POLICY "read_market_data" ON market_data
  FOR SELECT USING (auth.role() = 'authenticated');

-- ==============================================
-- REALTIME
-- ==============================================

ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE bottles;
ALTER PUBLICATION supabase_realtime ADD TABLE acquisitions;
ALTER PUBLICATION supabase_realtime ADD TABLE sales;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_actions;

-- ==============================================
-- UPDATED_AT TRIGGER
-- ==============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON sellers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON buyers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON bottles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON acquisitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

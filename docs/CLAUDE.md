# ENOTECA OS — Claude Code Master Prompt

## Identity

**Product:** ENOTECA OS — Full Autonomous Operation System for Collectible Bottle Dealers
**Company:** 05 Enterprise (formerly Creaction Studio)
**Founder:** Roberto Leone
**Version:** 1.0.0
**Dev Engine:** Claude Code (sole development tool)

## What ENOTECA OS Is

ENOTECA OS is a mobile-first SaaS platform that transforms how collectible wine, whisky, and spirits dealers operate. It replaces manual WhatsApp-based workflows with an orchestrated mesh of 19 AI agents that handle everything from bottle identification to deal closure — with humans approving only strategic gates.

Two audiences:
1. **Operators (Dealers):** Use the mobile dashboard to manage acquisitions, inventory, pricing, and sales
2. **Sellers (Public):** Use a web/WhatsApp interface to submit bottles for valuation and sell

First customer: Antiche Bottiglie (EBW Consulting Spa), Torino — 5.620 valuations/year, 20.314 transactions, ~€2M revenue.

---

## Tech Stack

```
Frontend:       React Native (Expo SDK 52) — mobile-first, iOS + Android
Web Dashboard:  Next.js 15 (App Router) — operator web access + public seller portal
Backend:        Supabase (PostgreSQL 15, Auth, Realtime, Storage, Edge Functions)
AI:             Claude API (Opus 4.6 strategic, Sonnet 4.6 execution, Haiku 4.5 triage)
Messaging:      WhatsApp Business API (via 360dialog or Twilio)
Payments:       Stripe Connect (operator billing + marketplace transactions)
Email:          Resend (transactional + newsletters)
Analytics:      PostHog (product analytics, funnels, feature flags)
Hosting:        Vercel (Next.js) + EAS (Expo builds)
CDN:            Cloudflare
Automation:     Trigger.dev (background jobs, agent orchestration)
Scraping:       Apify (Wine-Searcher, auction results, marketplace monitoring)
Storage:        Supabase Storage (bottle photos) + Cloudflare R2 (CDN for images)
```

---

## Design System — "Cantina Oscura"

### Philosophy
Apple-level craftsmanship. Dark luxury. Every pixel intentional. The app should feel like holding a bottle of 1967 Barolo — timeless, authoritative, warm.

### Colors
```css
/* Backgrounds */
--bg-primary:     #07070D;    /* Deep void — main background */
--bg-secondary:   #0D0D15;    /* Card surfaces */
--bg-tertiary:    #14141F;    /* Elevated surfaces */
--bg-quaternary:  #1C1C2A;    /* Input fields, hover states */
--bg-glass:       rgba(13,13,21,0.72);  /* Glassmorphism panels */

/* Brand */
--accent-primary:   #C9843A;  /* Aged copper — primary CTA, active states */
--accent-secondary: #D4A05A;  /* Warm gold — highlights, premium badges */
--accent-wine:      #8B1A32;  /* Deep burgundy — wine-related elements */
--accent-wine-light:#B83250;  /* Lighter wine — hover, active wine elements */

/* Semantic */
--success:   #22C68A;   /* Deal closed, positive delta */
--warning:   #E5A832;   /* Aging alert, attention needed */
--danger:    #DC4545;   /* Counterfeit flag, overdue, errors */
--info:      #3B7FD9;   /* Informational, links */

/* Text */
--text-primary:    #EEECE7;  /* Primary text — warm white */
--text-secondary:  #A09E96;  /* Secondary text */
--text-tertiary:   #6B6963;  /* Muted, labels */
--text-disabled:   #3D3B37;  /* Disabled states */

/* Borders */
--border-subtle:   rgba(255,255,255,0.06);  /* Default borders */
--border-medium:   rgba(255,255,255,0.12);  /* Hover borders */
--border-strong:   rgba(255,255,255,0.20);  /* Focus borders */
```

### Typography
```css
/* Font Stack */
--font-display:  'SF Pro Display', -apple-system, system-ui, sans-serif;
--font-body:     'SF Pro Text', -apple-system, system-ui, sans-serif;
--font-mono:     'SF Mono', 'JetBrains Mono', 'Fira Code', monospace;

/* Scale — mobile-first */
--text-hero:     34px / 1.05 / -0.02em / 700;   /* Hero numbers, big metrics */
--text-title-1:  28px / 1.12 / -0.02em / 700;   /* Screen titles */
--text-title-2:  22px / 1.18 / -0.01em / 600;   /* Section headers */
--text-title-3:  18px / 1.22 / -0.01em / 600;   /* Card headers */
--text-body:     16px / 1.55 / 0em / 400;        /* Body text */
--text-body-sm:  14px / 1.50 / 0em / 400;        /* Secondary body */
--text-caption:  12px / 1.40 / 0.02em / 500;     /* Labels, badges */
--text-overline: 11px / 1.30 / 0.12em / 600;     /* Overline, tab labels */
--text-mono:     13px / 1.40 / 0em / 400;        /* Prices, IDs, data */
```

### Spacing
```css
--space-2:   2px;
--space-4:   4px;
--space-6:   6px;
--space-8:   8px;
--space-12:  12px;
--space-16:  16px;
--space-20:  20px;
--space-24:  24px;
--space-32:  32px;
--space-40:  40px;
--space-48:  48px;
--space-64:  64px;
```

### Radii
```css
--radius-sm:   8px;    /* Small chips, badges */
--radius-md:   12px;   /* Cards, inputs */
--radius-lg:   16px;   /* Modal panels, large cards */
--radius-xl:   20px;   /* Bottom sheets */
--radius-full: 9999px; /* Pills, avatars */
```

### Shadows & Effects
```css
/* Elevation — use sparingly */
--shadow-sm:   0 1px 3px rgba(0,0,0,0.4);
--shadow-md:   0 4px 12px rgba(0,0,0,0.5);
--shadow-lg:   0 8px 32px rgba(0,0,0,0.6);

/* Glassmorphism — for overlays and modals */
backdrop-filter: blur(24px) saturate(180%);
background: var(--bg-glass);
border: 1px solid var(--border-subtle);
```

### Component Patterns

**Cards:**
```
background: var(--bg-secondary)
border: 1px solid var(--border-subtle)
border-radius: var(--radius-md)
padding: 16px
```

**Accent cards (important items):**
```
Same as card + border-left: 3px solid var(--accent-primary)
```

**Input fields:**
```
background: var(--bg-quaternary)
border: 1px solid var(--border-subtle)
border-radius: var(--radius-md)
padding: 12px 16px
color: var(--text-primary)
placeholder-color: var(--text-tertiary)
focus: border-color var(--accent-primary)
```

**Primary button:**
```
background: var(--accent-primary)
color: #FFFFFF
border-radius: var(--radius-md)
padding: 14px 24px
font: var(--text-body) weight 600
active: scale(0.97)
```

**Ghost button:**
```
background: transparent
border: 1px solid var(--border-medium)
color: var(--text-primary)
```

**Bottom tab bar:**
```
background: var(--bg-glass) with backdrop-filter
border-top: 1px solid var(--border-subtle)
icons: 24x24, stroke style
active: var(--accent-primary)
inactive: var(--text-tertiary)
labels: var(--text-overline)
safe-area-bottom: respected
```

**Status badges:**
```
font: var(--text-caption)
padding: 4px 10px
border-radius: var(--radius-full)
Variations:
  - Success: bg rgba(34,198,138,0.12) color var(--success)
  - Warning: bg rgba(229,168,50,0.12) color var(--warning)
  - Danger:  bg rgba(220,69,69,0.12) color var(--danger)
  - Neutral: bg rgba(255,255,255,0.06) color var(--text-secondary)
  - Premium: bg rgba(201,132,58,0.12) color var(--accent-primary)
```

---

## Database Schema (Supabase)

```sql
-- ORGANIZATIONS (multi-tenant SaaS)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'trial', -- trial, base, pro, enterprise
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
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'operator', -- owner, admin, operator, viewer
  avatar_url TEXT,
  phone TEXT,
  preferences JSONB DEFAULT '{}',
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BOTTLES (core entity)
CREATE TABLE bottles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  
  -- Identity
  category TEXT NOT NULL, -- wine, whisky, cognac, rum, liqueur, champagne, other
  producer TEXT,
  name TEXT NOT NULL,
  vintage INTEGER, -- year, NULL if NV
  denomination TEXT, -- DOCG, DOC, AOC, etc.
  region TEXT,
  country TEXT,
  
  -- Physical
  format TEXT DEFAULT '750ml', -- 375ml, 750ml, 1500ml, 3000ml, etc.
  closure_type TEXT, -- cork, screw_cap, wax, capsule
  
  -- Condition (0-10 scale)
  label_condition NUMERIC(3,1),
  liquid_level TEXT, -- high_shoulder, mid_shoulder, low_shoulder, base_neck, into_neck, etc.
  liquid_color TEXT,
  capsule_condition NUMERIC(3,1),
  overall_condition NUMERIC(3,1),
  
  -- AI Analysis
  vision_data JSONB DEFAULT '{}', -- raw Claude Vision output
  authenticity_score INTEGER, -- 0-100 from Authenticator agent
  authenticity_flags TEXT[],
  
  -- Pricing
  purchase_price NUMERIC(12,2),
  target_sell_price NUMERIC(12,2),
  market_price_low NUMERIC(12,2),
  market_price_high NUMERIC(12,2),
  pricing_sources JSONB DEFAULT '{}',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending_valuation',
  -- pending_valuation, valued, acquired, in_inventory, listed, reserved, sold, rejected
  
  -- Provenance
  seller_id UUID REFERENCES sellers(id),
  buyer_id UUID REFERENCES buyers(id),
  acquisition_id UUID REFERENCES acquisitions(id),
  
  -- Media
  photos TEXT[], -- array of storage URLs
  primary_photo TEXT,
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  ai_description JSONB DEFAULT '{}', -- multilingual descriptions
  
  -- Timestamps
  valued_at TIMESTAMPTZ,
  acquired_at TIMESTAMPTZ,
  listed_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
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
  seller_type TEXT, -- inheritance, collector, restaurant_closure, liquidation, private
  source_channel TEXT, -- whatsapp, email, website, facebook, instagram, phone, referral
  notes TEXT,
  total_transactions INTEGER DEFAULT 0,
  total_value NUMERIC(12,2) DEFAULT 0,
  rating NUMERIC(3,1), -- internal rating
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- BUYERS (people buying FROM the dealer)
CREATE TABLE buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  full_name TEXT,
  company_name TEXT,
  buyer_type TEXT, -- dealer_international, dealer_domestic, collector, restaurant, bar
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  country TEXT,
  city TEXT,
  preferences JSONB DEFAULT '{}', -- { categories, producers, price_range, regions }
  total_purchases INTEGER DEFAULT 0,
  total_spent NUMERIC(12,2) DEFAULT 0,
  avg_deal_value NUMERIC(12,2),
  payment_reliability NUMERIC(3,1), -- 0-10
  last_purchase_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ACQUISITIONS (grouped purchases from a seller)
CREATE TABLE acquisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  seller_id UUID REFERENCES sellers(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'negotiating',
  -- negotiating, offered, accepted, scheduled_pickup, picked_up, verified, paid, completed, cancelled
  total_bottles INTEGER,
  total_offer NUMERIC(12,2),
  total_final NUMERIC(12,2),
  pickup_date TIMESTAMPTZ,
  pickup_address TEXT,
  payment_method TEXT, -- bank_transfer, cash, check
  payment_status TEXT DEFAULT 'pending', -- pending, processing, completed
  conversation_id UUID REFERENCES conversations(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SALES (individual sale transactions)
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  buyer_id UUID REFERENCES buyers(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'negotiating',
  -- negotiating, agreed, invoiced, paid, shipped, delivered, completed, cancelled
  total_amount NUMERIC(12,2),
  margin_amount NUMERIC(12,2),
  margin_percent NUMERIC(5,2),
  invoice_number TEXT,
  shipping_tracking TEXT,
  shipping_carrier TEXT,
  conversation_id UUID REFERENCES conversations(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- SALE_ITEMS (bottles in a sale)
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id) NOT NULL,
  bottle_id UUID REFERENCES bottles(id) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  quantity INTEGER DEFAULT 1
);

-- CONVERSATIONS (AI agent conversations)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  channel TEXT NOT NULL, -- whatsapp, email, web_chat, internal
  external_contact TEXT, -- phone number or email
  contact_name TEXT,
  direction TEXT NOT NULL, -- inbound_seller, inbound_buyer, outbound_seller, outbound_buyer
  status TEXT DEFAULT 'active', -- active, waiting_response, closed, escalated
  assigned_agent TEXT, -- which AI agent is handling
  escalated_to UUID REFERENCES users(id),
  context JSONB DEFAULT '{}', -- conversation metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- MESSAGES (individual messages in conversations)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) NOT NULL,
  role TEXT NOT NULL, -- user, assistant, system, agent
  content TEXT NOT NULL,
  media_urls TEXT[],
  agent_id TEXT, -- which agent generated this
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AGENT_ACTIONS (audit log of all AI agent actions)
CREATE TABLE agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  agent_id TEXT NOT NULL, -- AG-001 through AG-019
  agent_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  input JSONB DEFAULT '{}',
  output JSONB DEFAULT '{}',
  confidence NUMERIC(5,2),
  processing_time_ms INTEGER,
  tokens_used INTEGER,
  cost_usd NUMERIC(8,4),
  status TEXT DEFAULT 'completed', -- started, completed, failed, escalated
  related_bottle_id UUID REFERENCES bottles(id),
  related_conversation_id UUID REFERENCES conversations(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MARKET_DATA (scraped pricing data)
CREATE TABLE market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL, -- wine_searcher, vivino, christies, sothebys, ebay, catawiki
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
  content_type TEXT NOT NULL, -- blog_post, instagram_post, facebook_post, newsletter, product_listing
  title TEXT,
  body TEXT,
  media_urls TEXT[],
  seo_keywords TEXT[],
  language TEXT DEFAULT 'it',
  status TEXT DEFAULT 'draft', -- draft, scheduled, published
  published_at TIMESTAMPTZ,
  related_bottle_id UUID REFERENCES bottles(id),
  performance JSONB DEFAULT '{}', -- views, clicks, engagement
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ALERTS (system alerts for operators)
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  alert_type TEXT NOT NULL, -- trophy_bottle, stagnant_inventory, price_change, new_lead, deal_pending, authenticity_flag
  priority TEXT DEFAULT 'medium', -- low, medium, high, critical
  title TEXT NOT NULL,
  message TEXT,
  action_url TEXT,
  related_entity_type TEXT,
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  is_actioned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
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

-- RLS Policies: all tables filtered by org_id matching authenticated user's org
-- Example for bottles:
CREATE POLICY "Users see own org bottles" ON bottles
  FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));
```

---

## App Architecture — Screens

### Mobile App (React Native / Expo)

**Tab Bar (5 tabs):**
1. **Dashboard** — Home screen with KPIs, alerts, activity feed
2. **Bottles** — Inventory browser with search, filters, bottle detail
3. **Scan** — Camera for instant bottle identification (center tab, prominent)
4. **Deals** — Active acquisitions and sales pipeline
5. **More** — Settings, team, analytics, content, profile

**Screen Map:**

```
├── Auth
│   ├── Welcome (onboarding carousel)
│   ├── Login (email + magic link)
│   └── Org Setup (name, logo, WhatsApp number)
│
├── Dashboard (Tab 1)
│   ├── KPI Cards (bottles today, revenue, pending deals, inventory value)
│   ├── Alert Cards (swipeable)
│   ├── Activity Feed (real-time agent actions)
│   └── Quick Actions (scan, new seller, new listing)
│
├── Bottles (Tab 2)
│   ├── Bottle List (searchable, filterable by status/category/price)
│   ├── Bottle Detail
│   │   ├── Photo Gallery
│   │   ├── AI Analysis Card (vision data, authenticity score)
│   │   ├── Pricing Card (market range, margin)
│   │   ├── History Timeline (valued → acquired → listed → sold)
│   │   ├── Actions (edit price, list, assign to buyer, archive)
│   │   └── Related Content (generated posts/listings)
│   └── Filters Panel (bottom sheet)
│
├── Scan (Tab 3 — Center)
│   ├── Camera View (full screen, overlay guides)
│   ├── Processing View (analyzing animation)
│   ├── Results View
│   │   ├── Identified Bottle Card
│   │   ├── Pricing Range
│   │   ├── Authenticity Score
│   │   └── Actions (add to inventory, create valuation, reject)
│   └── Multi-Scan Mode (batch multiple bottles)
│
├── Deals (Tab 4)
│   ├── Acquisitions Tab
│   │   ├── Pipeline View (kanban: negotiating → offered → accepted → pickup → paid)
│   │   ├── Acquisition Detail
│   │   │   ├── Seller Info
│   │   │   ├── Bottles List (with individual pricing)
│   │   │   ├── Conversation Thread (AI + human messages)
│   │   │   ├── Actions (approve offer, schedule pickup, mark paid)
│   │   │   └── Total Summary
│   │   └── New Acquisition
│   ├── Sales Tab
│   │   ├── Pipeline View (kanban: negotiating → agreed → invoiced → shipped → completed)
│   │   ├── Sale Detail
│   │   │   ├── Buyer Info
│   │   │   ├── Items List
│   │   │   ├── Margin Calculator
│   │   │   ├── Conversation Thread
│   │   │   └── Actions (send invoice, mark shipped, complete)
│   │   └── New Sale
│   └── Analytics Mini-Dashboard (monthly volume, margin trend)
│
├── More (Tab 5)
│   ├── Analytics
│   │   ├── Revenue Dashboard
│   │   ├── Category Breakdown
│   │   ├── Margin Analysis
│   │   ├── Inventory Aging
│   │   └── Agent Performance
│   ├── Sellers CRM
│   │   ├── Seller List
│   │   └── Seller Detail (history, rating, contact)
│   ├── Buyers CRM
│   │   ├── Buyer List
│   │   └── Buyer Detail (preferences, purchase history)
│   ├── Content Hub
│   │   ├── Generated Posts
│   │   ├── Blog Articles
│   │   └── Newsletter Builder
│   ├── Market Intelligence
│   │   ├── Price Trends
│   │   ├── Auction Results
│   │   └── Opportunity Alerts
│   ├── AI Agents
│   │   ├── Agent Status Dashboard
│   │   ├── Action Log
│   │   └── Agent Configuration
│   ├── Team Management
│   ├── Organization Settings
│   ├── Billing (Stripe portal)
│   └── Profile & Preferences
```

### Web Dashboard (Next.js) — Operator

Same functionality as mobile, optimized for desktop with:
- Multi-column layouts
- Drag-and-drop kanban boards for deal pipelines
- Split-view for conversations (list + detail)
- Full analytics with charts (Recharts)
- Bulk operations on inventory

### Public Seller Portal (Next.js) — Sellers

```
├── Landing Page (SEO-optimized)
│   ├── Hero: "Scopri quanto valgono le tue bottiglie"
│   ├── How It Works (3 steps)
│   ├── Testimonials
│   ├── Blog (SEO content)
│   └── CTA: Upload photos or start WhatsApp chat
│
├── Valuation Flow
│   ├── Upload Photos (drag-and-drop, mobile camera)
│   ├── Basic Info (province, quantity, context)
│   ├── AI Processing Screen
│   ├── Instant Valuation Range
│   └── CTA: Accept & proceed / Talk to expert
│
└── Dashboard (post-submission)
    ├── Valuation Status
    ├── Offer Details
    ├── Accept / Negotiate / Decline
    └── Pickup Scheduling
```

---

## AI Agent Specifications

Each agent is an Edge Function (Supabase) or a Trigger.dev background job.

### Agent Router (Conductor)
```typescript
// Determines which agent handles each event
async function routeEvent(event: AgentEvent): Promise<AgentResponse> {
  switch (event.type) {
    case 'new_whatsapp_message':
      return agents.intake.handle(event);
    case 'photos_received':
      return agents.vision.analyze(event);
    case 'vision_complete':
      return agents.authenticator.verify(event);
    case 'authentication_complete':
      return agents.pricer.evaluate(event);
    case 'pricing_complete':
      return agents.negotiator.propose(event);
    case 'deal_accepted':
      return agents.closer.process(event);
    case 'bottle_acquired':
      return Promise.all([
        agents.cataloger.catalog(event),
        agents.matchmaker.findBuyers(event),
        agents.content.generate(event),
      ]);
    // ... more routes
  }
}
```

### Claude API Usage Pattern
```typescript
const MODELS = {
  triage: 'claude-haiku-4-5-20251001',    // Fast classification, <1s
  execution: 'claude-sonnet-4-6',          // Vision, pricing, content
  strategic: 'claude-opus-4-6',            // Complex valuations, edge cases
};

async function callClaude(model: keyof typeof MODELS, messages: Message[], options?: {
  maxTokens?: number;
  system?: string;
  images?: string[];
}) {
  return anthropic.messages.create({
    model: MODELS[model],
    max_tokens: options?.maxTokens ?? 2048,
    system: options?.system,
    messages,
  });
}
```

---

## Key Development Principles

1. **Mobile-first always.** Design for 375px first, enhance up. Touch targets ≥ 44px.
2. **Haptic feedback** on all significant actions (deal closed, scan complete, alert).
3. **Real-time everywhere.** Supabase Realtime for live updates across all screens.
4. **Offline-capable.** Cache bottle data locally. Queue actions for sync.
5. **Dark mode only.** No light theme. The aesthetic IS the brand.
6. **Animation budget:** Subtle, Apple-like spring animations. `react-native-reanimated` for gesture-driven interactions. No gratuitous motion.
7. **Image optimization:** All bottle photos through Cloudflare Image Resizing. WebP format. Progressive loading with blurhash placeholders.
8. **Security:** RLS on every table. JWT validation. Rate limiting on all AI endpoints.
9. **Multi-tenant from day 1.** Every query filtered by org_id. Stripe Connect for billing.
10. **Instrument everything.** PostHog events on every agent action, every screen view, every deal milestone.

---

## NPM Packages (React Native)

```bash
# Core
npx create-expo-app enoteca-os --template tabs
npx expo install expo-camera expo-image-picker expo-haptics expo-blur
npx expo install expo-secure-store expo-notifications expo-linking

# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack

# State & Data
npm install @supabase/supabase-js zustand @tanstack/react-query

# UI
npm install react-native-reanimated react-native-gesture-handler
npm install @shopify/flash-list react-native-fast-image
npm install react-native-svg react-native-linear-gradient

# Forms
npm install react-hook-form zod @hookform/resolvers
```

## NPM Packages (Next.js Web)

```bash
npx create-next-app@latest enoteca-web --typescript --tailwind --app
npm install @supabase/supabase-js @supabase/ssr
npm install @tanstack/react-query zustand
npm install recharts framer-motion
npm install resend @trigger.dev/sdk
npm install stripe @stripe/stripe-js
npm install posthog-js
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge
npm install lucide-react
```

---

## File Structure

```
enoteca-os/
├── apps/
│   ├── mobile/          # React Native (Expo)
│   │   ├── app/         # Expo Router file-based routing
│   │   │   ├── (auth)/
│   │   │   ├── (tabs)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── bottles/
│   │   │   │   ├── scan/
│   │   │   │   ├── deals/
│   │   │   │   └── more/
│   │   │   └── _layout.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── supabase.ts
│   │   │   ├── claude.ts
│   │   │   └── store.ts
│   │   └── constants/
│   │       ├── colors.ts
│   │       ├── typography.ts
│   │       └── spacing.ts
│   │
│   └── web/             # Next.js
│       ├── app/
│       │   ├── (public)/      # Seller-facing pages
│       │   │   ├── page.tsx   # Landing page
│       │   │   ├── valuta/    # Valuation flow
│       │   │   └── blog/
│       │   ├── (dashboard)/   # Operator dashboard
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── bottles/
│       │   │   ├── deals/
│       │   │   ├── analytics/
│       │   │   └── settings/
│       │   └── api/
│       │       ├── agents/    # Agent endpoints
│       │       ├── webhooks/  # Stripe, WhatsApp
│       │       └── cron/      # Scheduled jobs
│       ├── components/
│       └── lib/
│
├── packages/
│   └── shared/          # Shared types, utils, agent logic
│       ├── types/
│       ├── agents/
│       ├── utils/
│       └── constants/
│
├── supabase/
│   ├── migrations/
│   ├── functions/       # Edge Functions (agent handlers)
│   └── seed.sql
│
└── docs/
    ├── CLAUDE.md         # This file
    ├── FIGMA-PROMPT.md   # Design prompt
    └── AGENT-SPECS.md    # Detailed agent specifications
```

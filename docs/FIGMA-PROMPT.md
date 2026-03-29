# ENOTECA OS — Figma Design Prompt

> Use this prompt in Figma (with any AI design plugin like Figma AI, Galileo, or as a brief for a human designer) to generate the complete mobile-first design system and all screens.

---

## PROMPT FOR FIGMA / AI DESIGN TOOL

### Identity Brief

Design a premium mobile-first SaaS application called **ENOTECA OS** — a full autonomous operation system for collectible wine and spirits dealers. The app must feel like it was designed by Apple's senior design team for the luxury wine market.

**Brand essence:** The intersection of centuries-old wine culture and cutting-edge AI. Like holding a bottle of 1967 Barolo — timeless authority, warmth, and quiet confidence.

**Two user types:**
1. **Operators (Dealers):** Professional bottle dealers who use the mobile app daily to manage acquisitions, pricing, inventory, and sales. Power users who need speed and information density.
2. **Sellers (Public):** People who want to sell their old/inherited bottles. They interact via a web portal or WhatsApp. Clean, trustworthy, simple experience.

---

### Design System: "Cantina Oscura"

**Mode:** Dark only. No light theme. The darkness IS the brand.

**Color Palette:**
- Background Primary: #07070D (deep void)
- Background Secondary: #0D0D15 (card surfaces)
- Background Tertiary: #14141F (elevated)
- Background Quaternary: #1C1C2A (inputs)
- Accent Primary: #C9843A (aged copper — CTAs)
- Accent Secondary: #D4A05A (warm gold — highlights)
- Accent Wine: #8B1A32 (deep burgundy)
- Accent Wine Light: #B83250 (wine hover)
- Success: #22C68A
- Warning: #E5A832
- Danger: #DC4545
- Info: #3B7FD9
- Text Primary: #EEECE7 (warm white)
- Text Secondary: #A09E96
- Text Tertiary: #6B6963
- Border Subtle: rgba(255,255,255,0.06)
- Border Medium: rgba(255,255,255,0.12)

**Typography:**
- Display/Headings: SF Pro Display (or New York for editorial moments)
- Body: SF Pro Text
- Mono/Data: SF Mono
- Scale: 34/28/22/18/16/14/12/11px
- Letter-spacing: Tight on headings (-0.02em), neutral on body, wide on overlines (+0.12em)
- Weight: 400 (body), 500 (labels), 600 (section headers), 700 (titles)

**Spacing:** 4px grid. Key stops: 8, 12, 16, 20, 24, 32, 40, 48, 64px.

**Corners:** 8px (chips/badges), 12px (cards/inputs), 16px (modals/large cards), 20px (bottom sheets), 9999px (pills/avatars).

**Borders:** 1px only. Always subtle (0.06 opacity). Accent-colored left border (3px) on important cards.

**Shadows:** Minimal. Only on modals and floating elements. Use border + background differentiation instead.

**Glassmorphism:** For bottom tab bar, bottom sheets, and modal overlays only. Blur 24px, saturate 180%, bg rgba(13,13,21,0.72).

**Iconography:** Lucide icon style. 24x24 for navigation, 20x20 inline. Stroke weight 1.5px. Never filled icons except for active tab bar state.

**Photography treatment:** Bottle photos should have subtle warm vignette. Photos in cards: 12px corner radius. Aspect ratio: 1:1 for thumbnails, 3:4 for detail views.

---

### SCREEN DESIGNS NEEDED

#### 1. ONBOARDING (3 screens)
**Screen 1:** Full-screen hero with a dramatic dark photograph of wine bottles in a cellar. Centered text: "ENOTECA OS" in SF Pro Display 34px weight 700. Subtitle: "The operating system for rare bottles" in 16px weight 400 text-secondary. Logo mark at top (a minimal geometric wine bottle silhouette in copper). Bottom: "Get Started" primary button.

**Screen 2:** Value proposition cards sliding in. Three cards: "AI-powered valuations in 90 seconds", "19 autonomous agents working for you", "From WhatsApp to deal closure, automated". Each card has a subtle copper icon, title in 18px weight 600, body in 14px weight 400 text-secondary.

**Screen 3:** Organization setup. Input fields for: Organization name, Email, WhatsApp number (with country code picker). Upload logo area (dashed border, camera icon). "Create Organization" primary button.

#### 2. LOGIN
Centered layout. Logo at top. Email input field. "Send magic link" primary button. "or continue with" divider. Apple Sign In button (native style). Footer: "By continuing you agree to Terms & Privacy".

#### 3. DASHBOARD (Main tab)
**Top bar:** Organization logo (tiny, left). "Good morning, Emanuele" greeting (right). Notification bell (right) with red badge count.

**KPI Row:** 4 cards in a 2x2 grid. Each card: bg-secondary, 12px radius. Top: label in 11px overline text-tertiary. Bottom: value in 28px weight 700. Colors vary by metric:
- "Bottles today" — text-primary with small +/- delta in green/red
- "Revenue MTD" — accent-primary value with mono font
- "Pending deals" — warning color if > 5
- "Inventory value" — text-primary

**Alert Cards:** Horizontal scrollable row. Each alert card: bg-tertiary, left accent border (3px, color varies by priority). Icon + title + one-line message. Swipe actions: dismiss, view, snooze.

Alert examples:
- 🏆 "Trophy detected: Barolo Monfortino 1978" (copper accent)
- ⚠️ "12 bottles stagnant >90 days — repricing suggested" (warning accent)
- 🤖 "Agent Scout found 3 underpriced bottles on eBay" (info accent)
- ✅ "Deal #AB-0847 closed — €2,340 margin" (success accent)

**Activity Feed:** Vertical list of recent agent actions. Each item: timestamp (mono, text-tertiary), agent icon + name badge (tiny, colored per domain), action description, related bottle thumbnail (32x32, rounded 8px).

**Quick Actions:** Floating action button (FAB) bottom-right, copper color. Opens to reveal: Scan Bottle, New Seller, New Listing, Manual Entry. Radial menu or vertical stack with glass background.

#### 4. BOTTLES LIST (Tab 2)
**Top:** Screen title "Inventory" in 28px weight 700. Search bar with magnifying glass icon. Filter chips row (horizontal scroll): All, Wine, Whisky, Cognac, Rum, Listed, Acquired, Pending.

**List:** FlashList with bottle cards. Each card:
- Left: Bottle photo (56x56, rounded 8px). If no photo: colored placeholder with category icon.
- Center: Producer name (14px weight 600), Bottle name + vintage (14px weight 400 text-secondary), Status badge (tiny pill).
- Right: Price in mono font (16px weight 600 accent-primary). Below: margin percentage in small text (green if >20%, warning if <10%).

**Sorting:** Top-right button opens bottom sheet with sort options: Date added, Price high→low, Price low→high, Aging days, Margin.

**Pull to refresh:** Custom animation — a wine bottle filling up as progress indicator.

#### 5. BOTTLE DETAIL
**Full-screen hero photo** with gradient fade to bg-primary at bottom. Back button (top-left, glass bg circle). Share button (top-right). Heart/star button (save).

**Scrollable content below photo:**

**Identity Card:** Producer + Name + Vintage in 22px weight 700. Denomination, Region, Country in 14px text-secondary. Category badge (wine/whisky/etc with appropriate color).

**AI Analysis Card:** bg-secondary, copper left border.
- "AI Analysis" header with sparkle icon
- Authenticity Score: large circular gauge (0-100), colored green/warning/red
- Key findings list: "Label condition: 8/10", "Liquid level: mid-shoulder", "Closure: original cork"
- "View full analysis" expandable section

**Pricing Card:** bg-secondary.
- Current listing price (large, mono, accent-primary)
- Market range bar (horizontal, showing low/your-price/high)
- Purchase price (small, text-secondary)
- Margin indicator (percentage + amount, colored)
- "8 sources analyzed" link to sources detail
- Last updated timestamp

**History Timeline:** Vertical timeline with dots and lines.
- Created (date, agent)
- Valued (date, price range)
- Acquired (date, purchase price)
- Listed (date, listing price)
- Sold (date, sale price, buyer name) — if applicable

**Actions:** Fixed bottom bar with glass bg. Two buttons: "Edit" (ghost) and primary action (context-dependent: "List for Sale", "Send to Buyer", "Mark as Sold").

#### 6. SCAN SCREEN (Tab 3 — Center)
**Full-screen camera view** with overlay:
- Semi-transparent dark overlay with a centered rectangular cutout (bottle label guide area)
- Guide text: "Position the label inside the frame" in 14px text-secondary
- Bottom: Capture button (large, 64px circle, copper ring, white fill). Tap triggers haptic + shutter animation.
- Top-right: Flash toggle, Gallery picker
- Top-left: Close button

**Processing state:** After capture:
- Photo shrinks to center with subtle pulse animation
- Below: Animated progress steps appearing one by one with checkmarks:
  1. "Analyzing label..." → ✓
  2. "Identifying producer & vintage..." → ✓
  3. "Checking authenticity..." → ✓
  4. "Fetching market prices..." → ✓
- Subtle particle/sparkle animation around the photo

**Results state:**
- Identified bottle card slides up from bottom (glass bg, rounded top corners 20px)
- Full bottle info: Producer, Name, Vintage, Denomination
- Authenticity badge: "Verified authentic — 94/100" (green) or "Review needed — 62/100" (warning)
- Price range: "€650 — €1,200" with market context
- Three action buttons: "Add to inventory", "Create valuation", "Scan another"

**Multi-scan mode:** Toggle at top. Shows a counter badge "3 scanned". Mini thumbnail strip at bottom of scanned bottles. "Done — process all" button.

#### 7. DEALS — ACQUISITIONS PIPELINE
**Top:** Segment control: Acquisitions | Sales
**Pipeline kanban:** Horizontal scroll with columns:
- **Negotiating** (neutral header)
- **Offered** (copper header)
- **Accepted** (success header)
- **Pickup** (info header)
- **Completed** (success header, muted)

Each deal card in a column:
- Seller name (14px weight 600)
- "5 bottles • €2,400 offer" (12px text-secondary)
- Time since last activity (12px mono text-tertiary)
- Priority dot (colored)
- Tap opens detail

**Acquisition Detail:**
- Seller info card (name, phone, type badge, source badge)
- Bottles list (thumbnails + names + individual prices)
- Total summary (total bottles, total offer, total margin estimate)
- Conversation thread (WhatsApp-style, showing AI messages + human messages with different styling)
- Action buttons: Approve Offer, Adjust Price, Schedule Pickup, Mark Paid, Escalate

#### 8. SELLER PORTAL (Web — Public)
**Landing page:** Dark luxury. Full-width hero image (cellar). Headline: "Scopri quanto valgono le tue bottiglie" in 48px weight 800. Subtitle in 18px text-secondary. CTA: "Valutazione gratuita" button + "Chiama 800 66 0406" link.

**How it works:** 3-step horizontal cards with numbers. 1. Foto → 2. Valutazione AI → 3. Pagamento immediato.

**Upload flow:** Drag-and-drop zone (dashed border, bottle icon). Or "Scatta foto" button for mobile camera. Province selector. "Tipo di vendita" selector (Eredità, Cantina privata, Ristorante/bar, Altro). Contact form (name, phone, email). "Richiedi valutazione gratuita" submit button.

**Testimonials:** Horizontal carousel with quote cards, name, stars.

**Blog section:** 3-column grid of article cards with images, category badges, titles.

**Footer:** Organization info, legal, privacy, cookie policy, social links.

#### 9. ANALYTICS DASHBOARD
**Web-only (or landscape tablet):**
- Revenue line chart (monthly, with comparison to previous period)
- Category donut chart (wine vs whisky vs cognac etc)
- Top 10 bottles by margin (horizontal bar chart)
- Inventory aging chart (bottles bucketed by days in inventory)
- Agent activity heatmap (19 agents x 7 days, intensity = actions)
- Conversion funnel: Valuations → Offers → Acquisitions → Sales

#### 10. AI AGENTS STATUS
Grid of 19 agent cards. Each card:
- Agent icon + name + ID
- Status indicator (active/idle/error — green/gray/red dot)
- Last action timestamp
- Actions today (count)
- Cost today (small, mono, text-tertiary)
- Tap opens agent detail with action log

---

### Animation & Interaction Notes

- **Screen transitions:** iOS-native push/pop. No custom transitions unless for onboarding.
- **Tab switching:** Cross-fade, not slide. 200ms.
- **Card press:** Scale to 0.97 on press, spring back on release. Haptic (light impact).
- **Pull-to-refresh:** Custom wine bottle filling animation.
- **Scan capture:** Shutter flash (white opacity pulse 100ms), haptic (medium impact).
- **Scan processing:** Sequential step reveals with subtle spring (each step slides in from right with 150ms stagger).
- **Deal pipeline:** Drag-and-drop cards between columns (mobile: long-press to pick up, haptic).
- **Alert swipe:** Swipe left to dismiss (red bg reveal), swipe right to action (copper bg reveal).
- **Number changes:** Animate value transitions (count up/down with spring).
- **Bottom sheets:** Spring animation from bottom, glass background, drag handle at top.

---

### Deliverables Needed

1. **Design System Page:** All colors, typography, spacing, components, states
2. **Mobile Screens (375x812):** All screens listed above, including empty states and loading states
3. **Web Screens (1440x900):** Seller portal landing + valuation flow + operator dashboard
4. **Component Library:** Cards, buttons, inputs, badges, tab bars, bottom sheets, modals, charts
5. **Prototype:** Key flows — Onboarding, Scan→Result→Add, Acquisition pipeline, Seller portal upload

---

### References & Mood

- Apple's own apps (Music, Health, Fitness+) — for the premium dark UI quality
- Linear app — for information density done elegantly
- Palantir AIP — for the data-heavy dark aesthetic
- Vivino app — for wine-specific UX patterns
- Nothing phone UI — for the clean dark minimalism
- Swiss design principles — for grid, spacing, typography discipline

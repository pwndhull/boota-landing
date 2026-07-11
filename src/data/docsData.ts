import { DocSection, ADR, RoadmapItem } from "../types";

export const docSections: DocSection[] = [
  {
    title: "Overview",
    id: "overview",
    pages: [
      {
        id: "intro",
        title: "Introduction",
        description: "Welcome to Boota Nexus. What Boota is, how it's organized, and the engineering principles guiding our platform.",
        category: "overview",
        content: `### Welcome to the Boota Developer Nexus 🚀

Boota is a highly composable, multi-tenant digital commerce and logistics platform engineered specifically for independent ethnic and Indian grocers in Australia. By uniting local stores (such as Boota Grocers Harris Park or Desi Bazaar Sunshine) under a unified, high-performance technology layer, we empower independent retailers to match the convenience, scale, and technical sophistication of retail giants like Woolworths and Coles.

This portal—**Boota Nexus**—is the absolute, single source of truth for our engineering systems, architecture, dynamic UI engines, and builder playgrounds.

---

### How This Portal Is Organized

We organize our platform documentation in **four concentric rings**, radiating from product intent to deep engineering rituals:

1. **Overview (Ring 1 - Intention):** Understanding the "why"—the market dynamics of Australian grocery commerce, product pillars, and user personas.
2. **Platform (Ring 2 - Blueprint):** The core system design. Dive into our system topology, multi-tenant security layers, and our robust **Server-Driven UI (SDUI)** engine.
3. **Builders (Ring 3 - Playground):** Interactive explorers to interact with our systems in real-time. Try out our live APIs, run SQL queries in our sandboxed database, track custom telemetry events, or chat with the Gemini-powered Boota Architect in our AI workspace.
4. **Engineering (Ring 4 - Execution):** Architectural Decision Records (ADRs), the developer handbook, and our live technical roadmap commitments.

---

### Core Engineering Principles

To succeed in a highly fragmented retail market, our platform adheres to four core principles:

- **Server-Driven Flexibility:** Our React Native client does not hardcode feature layouts. It parses declarative JSON templates served dynamically by our backend, enabling layout, visual banners, and promotional checkouts to change in real-time.
- **Composable Autonomy:** Every store is a distinct tenant with full database isolation via Supabase PostgreSQL Row-Level Security (RLS). Store owners can customize their own catalogs, payment gateways, and delivery schedules independently.
- **Extreme Efficiency on Low Bandwidth:** Grocery checkouts often happen on mobile devices inside high-density stores or basement spaces. Our payloads are optimized to minimize latency and support robust offline queueing.
- **Conversational and Contextual AI:** We build advanced intelligence directly into the merchant dashboard—supporting automated restocking forecasting, smart invoice ingestion, and instant customer loyalty programs via LLMs.`
      },
      {
        id: "vision",
        title: "Vision & Strategy",
        description: "The long-view: empowering independent grocers, the direct-to-boot delivery model, and local commerce logistics.",
        category: "overview",
        content: `### The Indian Grocery Market in Australia 🇦🇺

There are over 3,000 independent Indian, South Asian, and ethnic grocery retailers across Australia's metropolitan suburbs (Sydney's Harris Park, Melbourne's Werribee/Dandenong, Brisbane's Sunnybank). These stores are the lifelines of their communities, providing highly specialized imported items, fresh spices, local produce, and unique festival essentials (Diwali sweets, Holi colors, bulk basmati rice).

However, they face major technical hurdles:
- **No Consolidated Inventory:** Stock numbers are managed on legacy physical POS registers or written down manually.
- **Fragmented Logistics:** Relying on basic SMS, WhatsApp messaging, or phone call orders for customer deliveries and car pickups.
- **Under-optimized Pickup Operations:** High weekend traffic causes long queues inside tight, crowded shopfronts.

---

### The "Direct-to-Boot" Revolution

Boota solves this by introducing a highly optimized **Direct-to-Boot / Store Pickup** and **Smart Hyperlocal Delivery** logistics network:

\`\`\`
[Shopper places order on App] 
            │
            ▼
[Merchant Dashboard auto-accepts & optimizes picking queue]
            │
            ▼
[Staff packages order with barcode verification]
            │
       ┌────┴────┐
       ▼         ▼
  [Direct-to-Boot]  [Optimized Hyperlocal Delivery]
  - Shopper pulls up   - App coordinates with local drivers
  - Staff brings bag   - Dynamic routing reduces fuel costs
  - Zero-wait pickup   - Live tracking with SMS notifications
\`\`\`

---

### The Merchant Flywheel

By digitizing transactions, we unlock a continuous growth loop for independent grocers:

1. **Structured Catalog Digestion:** Grocers scan barcodes to instantly fetch catalog item details, ingredients, and pricing from our master ethnic products database.
2. **Dynamic Server-Driven Loyalty:** Rewards are generated dynamically in response to stock surpluses (e.g. "Buy 5kg Atta, get 1kg Sugar free today only").
3. **Hyperlocal Density:** Route optimization groups suburban deliveries so drivers can make multiple drop-offs in a single run, reducing operational overhead.`
      },
      {
        id: "product",
        title: "Product Principles",
        description: "Personas, product pillars, design guidelines, and the merchant experience.",
        category: "overview",
        content: `### User Personas & Journey Maps

We build for three distinct users who interact with the Boota ecosystem every day:

#### 1. Sunder (The Independent Store Owner)
*“I work 14 hours a day, managing stock on the fly. I need a system that does the thinking for me and doesn't get in my way.”*
- **Needs:** Bulletproof inventory tracking, simple order dispatching, and automated alerts when bulk items are running low.
- **Frustration:** Complicated software, systems that require constant manual laptop updates, or tools that break when Wi-Fi drops.

#### 2. Priya (The Busy Suburban Shopper)
*“I order grocery staples on my train commute home. I want to buy in bulk and pick it up on my drive without waiting.”*
- **Needs:** Instant search with ethnic language synonyms (e.g., finding "Chana Dal" under "Gram lentils"), easy re-ordering, and precise arrival time matching.
- **Frustration:** Out-of-stock substitutions without warning, or arriving at the store only to wait 15 minutes for packing.

#### 3. Aaron (The Suburban Gig Driver)
*“I do deliveries on weekends. I need dense delivery routes with zero manual map switching.”*
- **Needs:** Turn-by-turn route optimization, automated SMS gate-code delivery notifications, and direct proof-of-delivery uploads.

---

### Product Design Pillars

Every interface we ship must follow these visual and structural tenets:

- **Zero-Friction Picklists:** Picking screens are designed for high-glare environments. Fonts are bold, color contrasts are high, and giant touch-zones prevent picking errors.
- **Clear Information Density:** Do not hide important inventory numbers under menus. Put numbers, categories, and tags on primary cards where store staff can see them at a glance.
- **Graceful Error Tolerances:** If barcode scanning fails, the UI must fallback to instant manual keyword search in under 50ms.`
      }
    ]
  },
  {
    title: "Platform",
    id: "platform",
    pages: [
      {
        id: "architecture",
        title: "System Architecture",
        description: "Overall platform topology, system boundaries, Supabase setup, and data flows.",
        category: "platform",
        content: `### High-Level System Topology

Boota is a modern multi-tenant cloud-native application. Our system consists of:

- **Core Mobile App:** Built with React Native (TypeScript) utilizing a custom layout parser that converts server schemas into beautiful native widgets.
- **Admin Dashboard:** Built in React + Tailwind, allowing merchants to adjust catalogs, monitor orders, and view live analytics.
- **Backend-as-a-Service (Supabase):** Handles PostgreSQL database storage, secure multi-tenant Authentication, Row-Level Security, and cloud storage bucket files.
- **Server Middleware (Express + Node):** Orchestrates complex multi-store transactions, processes real-time payments (Stripe AU), generates optimized driver routes, and proxies our server-side Gemini AI features.

\`\`\`
   ┌────────────────────────────────────────────────────────┐
   │                  React Native Client                   │
   │   - SDUI Renderer Component Engine (React Native)       │
   └───────────────┬───────────────────────────────▲────────┘
                   │ HTTP JSON (SDUI)              │ Real-time WS
                   ▼                               │
   ┌───────────────────────────────────────────────┴────────┐
   │                   Express API Node                     │
   │   - Middleware & Orchestration                         │
   │   - Gemini AI Workspace Engine & Restock Foresighter  │
   │   - Stripe Payment Processing                          │
   └───────────────┬───────────────────────────────▲────────┘
                   │ PostgreSQL Protocol           │ Supabase CDC
                   ▼                               │
   ┌───────────────────────────────────────────────┴────────┐
   │                      Supabase Cloud                    │
   │   - PostgreSQL Storage with strict tenant RLS          │
   │   - Realtime Listeners (Order status sync)             │
   └────────────────────────────────────────────────────────┘
\`\`\`

---

### Multi-Tenant Database Isolation

We enforce strict data isolation using PostgreSQL **Row-Level Security (RLS)** in Supabase. Every table contains a \`store_id\` or \`merchant_id\` column.

Here is an example policy used on our \`orders\` schema:

\`\`\`sql
-- Enable Row-Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Merchant view policy: Only allow logged-in merchant to read their store's orders
CREATE POLICY merchant_order_isolation ON orders
    FOR ALL
    TO authenticated
    USING (store_id = (SELECT store_id FROM profiles WHERE id = auth.uid()));
\`\`\`

---

### Architectural Trade-offs

| Choice | Advantages | Disadvantages | Mitigation |
| :--- | :--- | :--- | :--- |
| **Server-Driven UI** | Instant client design updates, unified layout configurations across stores. | Increased initial payload parsing latency on client devices. | Highly aggressive schema caching and lightweight component structures. |
| **Supabase (BaaS)** | Real-time listeners out-of-the-box, simplified infrastructure, fast setup. | Potential vendor lock-in for backend functions and triggers. | Standardized PostgreSQL migrations and portable SQL definitions. |
| **Monorepo Structure** | Easily share Types, helper libraries, and components between Admin and Mobile. | Increased build compilation times and complex CI pipelines. | Isolated workspace builds using Turborepo and target dependency filters. |`
      },
      {
        id: "sdui",
        title: "Server-Driven UI",
        description: "How screens are described by the server, parsed, and rendered dynamically.",
        category: "platform",
        content: `### Why Server-Driven UI (SDUI)?

In the rapid Australian grocery landscape, visual layout requirements change weekly:
- Highlighting Diwali sweet boxes in October.
- Shifting checkout banner buttons to priority delivery during extreme weather.
- Testing customized store-specific discount packages for local grocery brands.

Instead of submitting mobile updates to the Apple App Store or Google Play Store—which can take days to clear reviews—**Boota uses Server-Driven UI (SDUI)**. The mobile app acts as a smart, thin shell. It queries the server for a screen schema, parses the layout instructions, and builds the visual elements in real-time.

---

### Core SDUI Type Architecture

Every Server-Driven UI layout is governed by rigorous contract definitions. We define the global schema, action handlers, theme attributes, and individual interactive widget payloads explicitly:

| Interface Name | Target Scope | Property Fields | Type Definitions | Description |
| :--- | :--- | :--- | :--- | :--- |
| **SduiAction** | Navigation / Callbacks | type, target, payload | "navigate" \| "api_call" \| "share" \| "toast" \| "sheet" | Defines what action executes when the user taps or triggers an interactive component. |
| **SduiTheme** | Screen styling | backgroundColor, primaryColor, textColor, fontFamily | string, string, string, "sans" \| "mono" \| "serif" | Defines page-level typography, canvas background hex colors, and corporate accent palettes. |
| **SduiScreenSchema** | Full screen layout | screen, version, theme, layout | string, string, SduiTheme, SduiComponent[] | The complete top-level screen response parsed by the React Native client-side dispatcher. |

---

### Comprehensive Component Specification

Our platform registry supports exactly 5 standard components. Their explicit properties and layout requirements are defined below:

#### 1. Banner (\`type: "Banner"\`)
Used for high-impact promos, flash deals, or local announcement banners.
- **title** (\`string\`, Required): The main headline text displayed inside the banner.
- **description** (\`string\`, Required): Secondary body paragraph detailing the offer or discount.
- **buttonText** (\`string\`, Required): Call-to-action text displayed inside the touchable action button.
- **backgroundColor** (\`string\`, Required): Accent background hex code (e.g. \`#DC2626\`).
- **textColor** (\`string\`, Required): Text foreground hex code (e.g. \`#FFFFFF\`).
- **imageUrl** (\`string\`, Required): Fully qualified secure image URL to render as background or alongside text.
- **action** (\`SduiAction\`, Optional): The action triggered on button click.

#### 2. LoyaltyCard (\`type: "LoyaltyCard"\`)
Renders the customer loyalty and point status card directly from their merchant profile.
- **points** (\`number\`, Required): Active points accumulated by the shopper (e.g., \`450\`).
- **merchantName** (\`string\`, Required): Store name associated with the loyalty card (e.g., \`Boota Grocers Harris Park\`).
- **barcodeText** (\`string\`, Required): Plain text represented as scan-ready visual linear barcode.
- **tier** (\`"Silver Member" | "Gold Member" | "Platinum Member"\`, Required): Strict member tier status.
- **nextRewardProgress** (\`number\`, Required): Progression bar state expressed as float/percentage from \`0\` to \`100\`.

#### 3. ProductCard (\`type: "ProductCard"\`)
A structured component tracking catalog entries, stock numbers, and prices.
- **productName** (\`string\`, Required): Master name of the product (e.g., \`Aashirvaad Atta 10kg\`).
- **category** (\`string\`, Required): Classification tag (e.g., \`Flours & Rice\`).
- **price** (\`string\`, Required): Current checkout cost in AUD (e.g., \`24.99\`).
- **oldPrice** (\`string\`, Optional): Original crossed-out price used to demonstrate value.
- **stockStatus** (\`"In Stock" | "Low Stock" | "Out of Stock"\`, Required): Enumerated shelf stock count status.
- **rating** (\`number\`, Required): Customer review score on a 1.0 - 5.0 scale.

#### 4. SearchBar (\`type: "SearchBar"\`)
The primary search utility mounted at the top of exploration screens.
- **placeholder** (\`string\`, Required): Ghost text shown in the search input box.
- **actionId** (\`string\`, Required): Unique event ID dispatched to trace keyword search intents.
- **showBarcodeIcon** (\`boolean\`, Required): Toggle parameter to enable/disable camera-based barcode scanning inside the field.

#### 5. CheckoutForm (\`type: "CheckoutForm"\`)
The final picker or customer transaction checklist block.
- **title** (\`string\`, Required): Headline string for the checkout checklist block.
- **merchantName** (\`string\`, Required): Grocery merchant processing the current pickup order.
- **customerName** (\`string\`, Required): Registered name of the authenticated customer.
- **deliveryMethod** (\`"Direct-to-Boot" | "Store Pickup" | "Courier Delivery"\`, Required): Isolation dispatch mode choice.
- **estimatedTime** (\`string\`, Required): Expected ready time (e.g. \`25 min\`).

---

### Client Component Registry & Parser

The React Native client maps layout strings directly to components via a standard **Component Registry**:

\`\`\`typescript
import SearchBar from "./components/SearchBar";
import Banner from "./components/Banner";
import ProductCard from "./components/ProductCard";
import LoyaltyCard from "./components/LoyaltyCard";
import CheckoutForm from "./components/CheckoutForm";
import { SduiComponent } from "../types";

export const COMPONENT_REGISTRY = {
  "SearchBar": SearchBar,
  "Banner": Banner,
  "ProductCard": ProductCard,
  "LoyaltyCard": LoyaltyCard,
  "CheckoutForm": CheckoutForm
};

// Client parser implementation
export function renderSduiComponent(node: SduiComponent) {
  const Component = COMPONENT_REGISTRY[node.type];
  if (!Component) {
    // Render robust fallback rather than crashing client-side viewport
    return <UnknownComponent key={node.id} type={node.type} />;
  }
  return <Component key={node.id} id={node.id} {...node.props} />;
}
\`\`\``
      }
    ]
  }
];

export const adrs: ADR[] = [
  {
    id: "ADR-001",
    title: "Server-Driven UI for Client Customization",
    date: "2026-02-14",
    status: "Accepted",
    context: "We need store owners to have customizable app themes and layouts while maintaining a single core React Native codebase on the App Stores.",
    decision: "We will adopt a Server-Driven UI (SDUI) architecture. The mobile client parses a standardized JSON layout schema fetched from Supabase. The screen layout, banners, order of carousels, and accent colors will be fully configurable on the server.",
    consequences: "Eliminates Apple/Google App Store review delays for visual layouts. Increases backend workload slightly to assemble schemas. Requires strict client-side validation to ensure invalid layouts don't crash the mobile app."
  },
  {
    id: "ADR-002",
    title: "Supabase BaaS with PostgreSQL RLS Security",
    date: "2026-03-01",
    status: "Accepted",
    context: "Boota operates as a multi-tenant platform. We need a rapid, highly scalable solution for real-time order listening, authentication, and structured relational queries.",
    decision: "We will use Supabase as our Primary Backend-as-a-Service. Database storage will be organized in a single PostgreSQL instance utilizing strict Row-Level Security (RLS) policies based on user profiles and store associations.",
    consequences: "Gives us near-instant database triggers and real-time syncing of orders. Reduces backend infrastructure maintenance. Vendor dependencies are mitigated by using standard SQL queries and migrating database schemas through pure PostgreSQL definitions."
  },
  {
    id: "ADR-003",
    title: "React Native Monorepo via Turborepo",
    date: "2026-03-15",
    status: "Accepted",
    context: "The client codebases are split into a Customer App, a Driver App, and a Merchant Web Admin panel, sharing massive amounts of API types and utility libraries.",
    decision: "We will structure all frontends within a single repository using Turborepo. Types, mock engines, and global UI design tokens will be hosted in a shared workspace package under '@boota/core'.",
    consequences: "Drastically simplifies updating shared types when changing database schemas. Provides unified code style enforcement. Initial repo checkout is larger, and build pipelines must use smart caching to avoid building all assets on every change."
  }
];

export const roadmapItems: RoadmapItem[] = [
  {
    id: "RM-01",
    title: "Advanced Component Studio (Visual UI Builder)",
    quarter: "Q3 2026",
    status: "Now",
    category: "Builders",
    description: "Allowing merchants to design custom checkout checkout blocks and checkout forms in real-time.",
    progress: 75
  },
  {
    id: "RM-02",
    title: "Australian Address Autocomplete checkout integration",
    quarter: "Q3 2026",
    status: "Now",
    category: "Core Engine",
    description: "Integrating Australia Post APIs directly into the checkout address forms for accurate suburb routing.",
    progress: 90
  },
  {
    id: "RM-03",
    title: "Automated Restock Foresighter via Gemini",
    quarter: "Q4 2026",
    status: "Next",
    category: "Infrastructure",
    description: "Predicting weekly Indian spice inventory requirements using historical customer booking rates.",
    progress: 30
  },
  {
    id: "RM-04",
    title: "Suburban Pick-up Locker Integration",
    quarter: "H1 2027",
    status: "Later",
    category: "Loyalty",
    description: "Expanding delivery targets to climate-controlled smart locker boxes at local railway terminals.",
    progress: 0
  }
];

export interface DocPage {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown or detailed text
  category: "overview" | "platform" | "builders" | "engineering";
  badge?: string;
}

export interface DocSection {
  title: string;
  id: "overview" | "platform" | "builders" | "engineering";
  pages: DocPage[];
}

export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  headers?: Record<string, string>;
  queryParams?: { name: string; type: string; required: boolean; description: string; value?: string }[];
  requestBodySchema?: string;
  mockResponse: any;
}

export interface DBColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary: boolean;
  isForeign?: boolean;
  references?: string;
}

export interface DBTable {
  name: string;
  description: string;
  columns: DBColumn[];
  rlsPolicies: string[];
}

export interface FeatureFlag {
  key: string;
  description: string;
  value: boolean;
  environment: "production" | "staging" | "development";
}

export interface ADR {
  id: string;
  title: string;
  date: string;
  status: "Accepted" | "Superseded" | "Draft" | "Retired";
  context: string;
  decision: string;
  consequences: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  quarter: "Q3 2026" | "Q4 2026" | "H1 2027";
  status: "Now" | "Next" | "Later";
  category: "Core Engine" | "Builders" | "Infrastructure" | "Loyalty";
  description: string;
  progress: number; // 0 to 100
}

// ==========================================
// EXHAUSTIVE SERVER-DRIVEN UI TYPE REGISTRY
// ==========================================

export interface SduiAction {
  type: "navigate" | "api_call" | "share" | "toast" | "sheet";
  target: string;
  payload?: Record<string, string | number | boolean>;
}

export interface SduiTheme {
  backgroundColor: string;
  primaryColor: string;
  textColor?: string;
  fontFamily?: "sans" | "mono" | "serif";
}

export interface SduiBannerProps {
  title: string;
  description: string;
  buttonText: string;
  backgroundColor: string;
  textColor: string;
  imageUrl: string;
  action?: SduiAction;
}

export interface SduiLoyaltyCardProps {
  points: number;
  merchantName: string;
  barcodeText: string;
  tier: "Silver Member" | "Gold Member" | "Platinum Member";
  nextRewardProgress: number;
}

export interface SduiProductCardProps {
  productName: string;
  category: string;
  price: string;
  oldPrice?: string;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  rating: number;
  imageUrl?: string;
}

export interface SduiSearchBarProps {
  placeholder: string;
  actionId: string;
  showBarcodeIcon: boolean;
}

export interface SduiCheckoutFormProps {
  title: string;
  merchantName: string;
  customerName: string;
  deliveryMethod: "Direct-to-Boot" | "Store Pickup" | "Courier Delivery";
  estimatedTime: string;
}

export interface SduiBannerComponent {
  type: "Banner";
  id: string;
  props: SduiBannerProps;
}

export interface SduiLoyaltyCardComponent {
  type: "LoyaltyCard";
  id: string;
  props: SduiLoyaltyCardProps;
}

export interface SduiProductCardComponent {
  type: "ProductCard";
  id: string;
  props: SduiProductCardProps;
}

export interface SduiSearchBarComponent {
  type: "SearchBar";
  id: string;
  props: SduiSearchBarProps;
}

export interface SduiCheckoutFormComponent {
  type: "CheckoutForm";
  id: string;
  props: SduiCheckoutFormProps;
}

export type SduiComponent =
  | SduiBannerComponent
  | SduiLoyaltyCardComponent
  | SduiProductCardComponent
  | SduiSearchBarComponent
  | SduiCheckoutFormComponent;

export interface SduiScreenSchema {
  screen: string;
  version: string;
  theme: SduiTheme;
  layout: SduiComponent[];
}

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiInstance: GoogleGenAI | null = null;
function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please set it in your environment or Secrets panel.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// System instructions for the Boota Nexus Assistant
const SYSTEM_INSTRUCTION = `You are the Boota Nexus AI Assistant, an expert software architect and engineering lead for Boota.
Boota is a composable, server-driven digital commerce platform designed for independent Indian grocery stores in Australia.

Your job is to answer questions about Boota's architecture, vision, technology stack, and documentation with high technical accuracy.
Always speak clearly, professionally, and provide concrete architecture patterns, code blocks, or explanations.

Key facts about Boota:
1. Vision: A server-driven, multi-tenant platform that empowers independent grocers to compete with Woolworths and Coles.
2. Technology Stack:
   - Frontend: React Native monorepo, Server-Driven UI (SDUI) client, Admin Web Dashboard, Component Studio.
   - Backend: Supabase (PostgreSQL, Auth, Realtime, Functions, Storage) with Row-Level Security (RLS) active.
3. Server-Driven UI (SDUI):
   - Screens are described using JSON schema served from the backend.
   - Allows changing visual layout, banners, buttons, fields, theme, colors, and flow in real-time without app store updates.
4. Component Studio:
   - A visual builder & component sandbox to compile design tokens and interactive layout schemas into Server-Driven UI.
5. Modules:
   - Core Platform: Catalog, Orders, Inventory, Checkout, Pickup, Delivery, Loyalty, Payments, Promotions.
   - Developer Platform: Component Studio, SDUI Engine, Feature Flag system, Analytics SDK, Event Bus.

Keep your answers technical, engaging, and structured. Use Markdown formatting. If the user asks for examples of SDUI configurations, show an elegant JSON schema payload representing components like buttons, banners, or lists.`;

// API routes
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const ai = getAI();
    
    // Transform chat history into expected structure
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred." });
  }
});

// Mock database for the API Explorer, DB Explorer, and Feature Flags
const mockDatabase = {
  products: [
    { id: "p1", name: "Ashirvaad Shudh Chakki Atta 10kg", category: "Flour & Rice", price: 24.99, stock: 145, active: true },
    { id: "p2", name: "Haldiram's Bhujia Sev 350g", category: "Snacks", price: 4.50, stock: 320, active: true },
    { id: "p3", name: "Amul Pure Ghee 1L", category: "Dairy & Ghee", price: 21.00, stock: 80, active: true },
    { id: "p4", name: "Tata Salt 1kg", category: "Pantry", price: 2.20, stock: 500, active: true },
    { id: "p5", name: "Daawat Rozana Basmati Rice 5kg", category: "Flour & Rice", price: 12.99, stock: 0, active: false }
  ],
  stores: [
    { id: "s1", name: "Boota Grocers Harris Park", location: "Harris Park, NSW", status: "Active" },
    { id: "s2", name: "Indian Spice Hub Werribee", location: "Werribee, VIC", status: "Active" },
    { id: "s3", name: "Desi Bazaar Sunnybank", location: "Sunnybank, QLD", status: "Pending Setup" }
  ],
  featureFlags: [
    { key: "enable-sdui-v2-renderer", description: "Enables advanced nesting in Server-Driven UI", value: true, environment: "production" },
    { key: "enable-au-postal-checkout", description: "Australian address auto-completion on checkout", value: false, environment: "production" },
    { key: "enable-ai-smart-inventory", description: "Gemini-powered restock forecasting for independent owners", value: true, environment: "staging" },
    { key: "enable-loyalty-points-multiplier", description: "2x points multipliers for local festival promotions", value: false, environment: "production" }
  ],
  orders: [
    { id: "o1", store_id: "s1", customer_name: "Priya Patel", status: "Completed", delivery_method: "Direct-to-Boot", total_amount: 54.38, created_at: "2026-07-10 14:30:00" },
    { id: "o2", store_id: "s1", customer_name: "Sanjay Sharma", status: "In Progress", delivery_method: "Store Pickup", total_amount: 21.00, created_at: "2026-07-11 09:15:00" },
    { id: "o3", store_id: "s2", customer_name: "Amit Mishra", status: "Pending", delivery_method: "Courier Delivery", total_amount: 11.00, created_at: "2026-07-11 11:00:00" }
  ],
  orderItems: [
    { id: "oi1", order_id: "o1", product_id: "p1", quantity: 2, unit_price: 24.99 },
    { id: "oi2", order_id: "o1", product_id: "p2", quantity: 1, unit_price: 4.40 },
    { id: "oi3", order_id: "o2", product_id: "p3", quantity: 1, unit_price: 21.00 },
    { id: "oi4", order_id: "o3", product_id: "p4", quantity: 5, unit_price: 2.20 }
  ],
  restockForecasts: [
    { id: "f1", product_id: "p1", current_stock: 145, predicted_sales_30d: 180, recommended_restock: 50, urgency: "Medium", run_date: "2026-07-10" },
    { id: "f2", product_id: "p3", current_stock: 80, predicted_sales_30d: 150, recommended_restock: 100, urgency: "High", run_date: "2026-07-10" },
    { id: "f3", product_id: "p5", current_stock: 0, predicted_sales_30d: 220, recommended_restock: 250, urgency: "Critical", run_date: "2026-07-11" }
  ]
};

// API: Get Products (Mock database)
app.get("/api/products", (req, res) => {
  res.json(mockDatabase.products);
});

// API: Add/Update Product
app.post("/api/products", (req, res) => {
  const { name, category, price, stock, active } = req.body;
  if (!name || !price) {
    res.status(400).json({ error: "Product name and price are required." });
    return;
  }
  const newProduct = {
    id: "p" + (mockDatabase.products.length + 1),
    name,
    category: category || "Pantry",
    price: Number(price),
    stock: Number(stock || 0),
    active: active !== undefined ? active : true
  };
  mockDatabase.products.push(newProduct);
  res.status(201).json(newProduct);
});

// API: Feature Flags
app.get("/api/flags", (req, res) => {
  res.json(mockDatabase.featureFlags);
});

// API: Feature Flags toggle
app.post("/api/flags/toggle", (req, res) => {
  const { key } = req.body;
  const flag = mockDatabase.featureFlags.find(f => f.key === key);
  if (flag) {
    flag.value = !flag.value;
    res.json({ success: true, flag });
  } else {
    res.status(404).json({ error: "Feature flag not found" });
  }
});

// API: Execute SQL Mock (Database Explorer)
app.post("/api/database/query", (req, res) => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: "SQL query is required" });
    return;
  }

  const cleanQuery = query.toLowerCase().trim();

  try {
    if (cleanQuery.includes("select * from products")) {
      res.json({
        columns: ["id", "name", "category", "price", "stock", "active"],
        rows: mockDatabase.products.map(p => [p.id, p.name, p.category, p.price, p.stock, p.active]),
        rowCount: mockDatabase.products.length,
        executionTimeMs: 4
      });
    } else if (cleanQuery.includes("select * from stores")) {
      res.json({
        columns: ["id", "name", "location", "status"],
        rows: mockDatabase.stores.map(s => [s.id, s.name, s.location, s.status]),
        rowCount: mockDatabase.stores.length,
        executionTimeMs: 2
      });
    } else if (cleanQuery.includes("select * from feature_flags") || cleanQuery.includes("select * from flags")) {
      res.json({
        columns: ["key", "description", "value", "environment"],
        rows: mockDatabase.featureFlags.map(f => [f.key, f.description, f.value, f.environment]),
        rowCount: mockDatabase.featureFlags.length,
        executionTimeMs: 3
      });
    } else if (cleanQuery.includes("select * from orders")) {
      res.json({
        columns: ["id", "store_id", "customer_name", "status", "delivery_method", "total_amount", "created_at"],
        rows: mockDatabase.orders.map(o => [o.id, o.store_id, o.customer_name, o.status, o.delivery_method, o.total_amount, o.created_at]),
        rowCount: mockDatabase.orders.length,
        executionTimeMs: 3
      });
    } else if (cleanQuery.includes("select * from order_items")) {
      res.json({
        columns: ["id", "order_id", "product_id", "quantity", "unit_price"],
        rows: mockDatabase.orderItems.map(oi => [oi.id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price]),
        rowCount: mockDatabase.orderItems.length,
        executionTimeMs: 3
      });
    } else if (cleanQuery.includes("select * from restock_forecasts")) {
      res.json({
        columns: ["id", "product_id", "current_stock", "predicted_sales_30d", "recommended_restock", "urgency", "run_date"],
        rows: mockDatabase.restockForecasts.map(f => [f.id, f.product_id, f.current_stock, f.predicted_sales_30d, f.recommended_restock, f.urgency, f.run_date]),
        rowCount: mockDatabase.restockForecasts.length,
        executionTimeMs: 4
      });
    } else {
      res.json({
        columns: ["message"],
        rows: [["Query executed successfully. (Supported SELECT tables: products, stores, feature_flags, orders, order_items, restock_forecasts)"]],
        rowCount: 1,
        executionTimeMs: 1
      });
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Server boot up
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

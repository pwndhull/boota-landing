import React, { useState } from "react";
import { BarChart2, Activity, Play, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface AnalyticsEvent {
  eventName: string;
  storeId: string;
  metadata: Record<string, any>;
  timestamp: string;
  networkTimeMs: number;
}

export default function AnalyticsDashboard() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [eventsList, setEventsList] = useState<AnalyticsEvent[]>([
    {
      eventName: "catalog_search_triggered",
      storeId: "store-harris-park-01",
      metadata: { keyword: "chakki atta 10kg", results_count: 4 },
      timestamp: new Date(Date.now() - 320000).toLocaleTimeString(),
      networkTimeMs: 14
    },
    {
      eventName: "product_details_viewed",
      storeId: "store-harris-park-01",
      metadata: { product_id: "p1", category: "Flours & Rice" },
      timestamp: new Date(Date.now() - 250000).toLocaleTimeString(),
      networkTimeMs: 8
    },
    {
      eventName: "cart_item_added",
      storeId: "store-harris-park-01",
      metadata: { product_id: "p1", quantity: 1, value_aud: 24.99 },
      timestamp: new Date(Date.now() - 140000).toLocaleTimeString(),
      networkTimeMs: 18
    }
  ]);

  // Aggregated analytics values for charts
  const metrics = {
    totalSessions: "1,482",
    cartConversionRate: "4.8%",
    averagePickTime: "11.2 min",
    directToBootRatio: "74%"
  };

  // Add simulated event triggers
  const triggerSimulatedEvent = (eventName: string, metadata: Record<string, any>) => {
    const newEvent: AnalyticsEvent = {
      eventName,
      storeId: "store-harris-park-01",
      metadata,
      timestamp: new Date().toLocaleTimeString(),
      networkTimeMs: Math.floor(Math.random() * 25) + 5
    };

    setEventsList([newEvent, ...eventsList]);
    setSuccessMsg(`Fired telemetry event: ${eventName}`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Telemetry Platform
          </span>
          <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
            Analytics & Live Telemetry Tracker
          </h2>
        </div>
        <p className="text-slate-500 text-xs max-w-3xl">
          Observe how the Boota Client SDK logs micro-interactions. Tweak events below to test our dynamic real-time ingestion pipelines and funnel reporting structures!
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Shopper Sessions", value: metrics.totalSessions, change: "+14% this week" },
          { label: "Cart Conversion Rate", value: metrics.cartConversionRate, change: "Industry top 10%" },
          { label: "Avg Picking Prep Time", value: metrics.averagePickTime, change: "-2.4m reduction" },
          { label: "Direct-to-Boot Choice", value: metrics.directToBootRatio, change: "Customer preferred" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</span>
            <p className="text-lg font-display font-bold text-slate-900 font-mono">{stat.value}</p>
            <span className="text-[10px] text-emerald-600 font-semibold">{stat.change}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left - Event Trigger Playground (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
              1. Event Ingestion Trigger
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Click buttons below to emulate physical shopper behaviors inside the React Native mobile app client:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => triggerSimulatedEvent("catalog_search_triggered", { keyword: "basmati rice", results: 8 })}
                className="w-full text-left p-3 rounded-lg border border-slate-150 hover:bg-slate-50 text-xs font-medium flex items-center justify-between transition-all cursor-pointer"
              >
                <span className="font-mono text-slate-800">catalog_search_triggered</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Trigger ➔</span>
              </button>

              <button
                onClick={() => triggerSimulatedEvent("product_details_viewed", { product_id: "p3", category: "Dairy & Ghee" })}
                className="w-full text-left p-3 rounded-lg border border-slate-150 hover:bg-slate-50 text-xs font-medium flex items-center justify-between transition-all cursor-pointer"
              >
                <span className="font-mono text-slate-800">product_details_viewed</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Trigger ➔</span>
              </button>

              <button
                onClick={() => triggerSimulatedEvent("cart_item_added", { product_id: "p3", value_aud: 21.0 })}
                className="w-full text-left p-3 rounded-lg border border-slate-150 hover:bg-slate-50 text-xs font-medium flex items-center justify-between transition-all cursor-pointer"
              >
                <span className="font-mono text-slate-800">cart_item_added</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Trigger ➔</span>
              </button>

              <button
                onClick={() => triggerSimulatedEvent("checkout_ticket_confirmed", { store_id: "s1", delivery_method: "Direct-to-Boot" })}
                className="w-full text-left p-3 rounded-lg border border-slate-150 hover:bg-slate-50 text-xs font-medium flex items-center justify-between transition-all cursor-pointer"
              >
                <span className="font-mono text-slate-800">checkout_ticket_confirmed</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Trigger ➔</span>
              </button>
            </div>
          </div>

          {/* Pretty Visual Charts using inline custom SVG (Conversion Funnel) */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
              2. Conversion Funnel Visualizer
            </h3>

            {/* Custom SVG Bar Chart */}
            <div className="space-y-3">
              {[
                { stage: "1. Search Catalog", count: "100%", value: 100, color: "bg-purple-600" },
                { stage: "2. View Details", count: "68%", value: 68, color: "bg-purple-500" },
                { stage: "3. Add To Cart", count: "32%", value: 32, color: "bg-purple-400" },
                { stage: "4. Checkout Order", count: "14%", value: 14, color: "bg-purple-350" }
              ].map((stage, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-600">
                    <span>{stage.stage}</span>
                    <span className="font-mono font-bold text-slate-900">{stage.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.value}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={`h-full ${stage.color} rounded-full`}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Live Event Stream Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 text-slate-300 p-5 rounded-xl border border-slate-850 shadow-lg min-h-[480px] flex flex-col justify-between">
            <div>
              {/* Terminal header */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-500" />
                  Live SDK Event Telemetry Stream
                </span>
                <span className="text-[9px] bg-slate-900 px-2.5 py-0.5 rounded text-slate-500 font-mono">
                  Socket: Connected
                </span>
              </div>

              {/* Success alert message overlay */}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 p-2.5 rounded-lg text-[10px] flex items-center gap-2 font-mono"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}

              {/* Events list log */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {eventsList.map((evt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-slate-900 border border-slate-900 rounded-lg space-y-1.5 hover:border-slate-800/60 transition-all font-mono text-[10px]"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-purple-400 font-bold font-mono">{evt.eventName}</span>
                      <div className="flex gap-2 text-slate-500 text-[9px]">
                        <span>{evt.timestamp}</span>
                        <span>{evt.networkTimeMs}ms</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-slate-800/50 pt-1.5 text-[9px] text-slate-400">
                      <div>
                        <span className="text-slate-600 block">store_id</span>
                        <span className="truncate block font-semibold">{evt.storeId}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-600 block">payload metadata</span>
                        <span className="truncate block text-slate-300 font-medium">
                          {JSON.stringify(evt.metadata)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-900/80 text-[10px] text-slate-500 flex justify-between font-mono mt-4">
              <span>Telemetry server: node-sydney-01</span>
              <span>Buffer: 100% stable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

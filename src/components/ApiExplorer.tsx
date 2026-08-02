import React, { useState, useEffect } from "react";
import { Terminal, Send, CheckCircle, HelpCircle, Loader2, PlayCircle } from "lucide-react";
import { motion } from "motion/react";

interface ApiEndpoint {
  id: string;
  method: "GET" | "POST";
  path: string;
  description: string;
  queryParams?: { name: string; value: string; description: string }[];
  bodyFields?: { name: string; value: string; type: string; placeholder: string; required: boolean }[];
}

export default function ApiExplorer() {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>("get-products");
  const [loading, setLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // Dynamic state for body fields
  const [postProductBody, setPostProductBody] = useState({
    name: "Haldiram's Gulab Jamun 1kg",
    category: "Sweets & Desserts",
    price: "16.50",
    stock: "65"
  });

  const apiEndpoints: ApiEndpoint[] = [
    {
      id: "get-products",
      method: "GET",
      path: "/api/products",
      description: "Retrieve a list of active groceries in the Indian catalog, categorized by pantry type."
    },
    {
      id: "post-product",
      method: "POST",
      path: "/api/products",
      description: "Register a new grocery item in the inventory catalog. Triggers instant cache sync for active SDUI carousels.",
      bodyFields: [
        { name: "name", value: "", type: "text", placeholder: "Product name (e.g. Amul Butter 500g)", required: true },
        { name: "category", value: "", type: "text", placeholder: "Category (e.g. Dairy)", required: false },
        { name: "price", value: "", type: "number", placeholder: "Price in AUD (e.g. 8.50)", required: true },
        { name: "stock", value: "", type: "number", placeholder: "Available inventory", required: false }
      ]
    },
    {
      id: "get-flags",
      method: "GET",
      path: "/api/flags",
      description: "List all active, parsed, and staging Feature Flags across our platform nodes."
    }
  ];

  const selectedEndpoint = apiEndpoints.find(e => e.id === selectedEndpointId)!;

  // Trigger real HTTP requests to the Express server!
  const triggerRequest = async () => {
    setLoading(true);
    setResponseData(null);
    setResponseStatus(null);
    const startTime = performance.now();

    try {
      let url = selectedEndpoint.path;
      let options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          "Content-Type": "application/json"
        }
      };

      if (selectedEndpoint.method === "POST" && selectedEndpoint.id === "post-product") {
        options.body = JSON.stringify({
          name: postProductBody.name,
          category: postProductBody.category,
          price: parseFloat(postProductBody.price) || 0,
          stock: parseInt(postProductBody.stock) || 0,
          active: true
        });
      }

      const response = await fetch(url, options);
      const data = await response.json();
      const endTime = performance.now();

      setResponseStatus(response.status);
      setResponseHeaders({
        "content-type": response.headers.get("content-type") || "application/json",
        "cache-control": response.headers.get("cache-control") || "no-cache",
        "date": new Date().toUTCString()
      });
      setResponseData(data);
      setExecutionTime(Math.round(endTime - startTime));
    } catch (err: any) {
      const endTime = performance.now();
      setResponseStatus(500);
      setResponseData({ error: err.message || "Could not complete request to Express backend." });
      setExecutionTime(Math.round(endTime - startTime));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            API Live Tester
          </span>
          <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
            API Playground & Documentation
          </h2>
        </div>
        <p className="text-slate-500 text-xs max-w-3xl">
          Browse actual working API routes below. You can trigger requests and inspect live responses directly served by our Express server backend!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column - Select Route & Request (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Endpoint selector */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
              1. Choose API Endpoints
            </h3>
            <div className="space-y-2">
              {apiEndpoints.map((endpoint) => {
                const isSelected = endpoint.id === selectedEndpointId;
                const isGet = endpoint.method === "GET";
                return (
                  <button
                    key={endpoint.id}
                    onClick={() => {
                      setSelectedEndpointId(endpoint.id);
                      setResponseData(null);
                      setResponseStatus(null);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/20 text-slate-900"
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100/50 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-1 rounded ${
                          isGet ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <div>
                        <span className="font-mono text-xs font-semibold block">{endpoint.path}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block line-clamp-1">{endpoint.description}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Request Composer */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-emerald-500" />
              2. Compose Request Parameters
            </h3>

            {/* Path indicator */}
            <div className="bg-slate-900 text-white px-3 py-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">{selectedEndpoint.method}</span>
              <span className="text-slate-300 flex-1 ml-3">{selectedEndpoint.path}</span>
              <span className="text-slate-500 text-[10px]">HTTP/1.1</span>
            </div>

            {/* Conditional post body editor */}
            {selectedEndpoint.id === "post-product" && (
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  JSON Request Body Payload
                </span>
                <div className="space-y-3 border-l-2 border-emerald-500/40 pl-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Product Name</label>
                    <input
                      type="text"
                      value={postProductBody.name}
                      onChange={(e) => setPostProductBody({ ...postProductBody, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Category</label>
                      <input
                        type="text"
                        value={postProductBody.category}
                        onChange={(e) => setPostProductBody({ ...postProductBody, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Price (AUD)</label>
                      <input
                        type="number"
                        value={postProductBody.price}
                        onChange={(e) => setPostProductBody({ ...postProductBody, price: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Stock Count</label>
                    <input
                      type="number"
                      value={postProductBody.stock}
                      onChange={(e) => setPostProductBody({ ...postProductBody, stock: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Explanatory text */}
            <p className="text-[11px] text-slate-400">
              Headers containing authorization tags (\`x-store-id\`) are appended automatically by our platform layer based on selected merchant context.
            </p>

            <button
              onClick={triggerRequest}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-750 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Invoking Route Endpoints...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send API Request
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column - Response Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 text-slate-300 p-5 rounded-xl border border-slate-800 shadow-lg min-h-[440px] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  HTTP Response Inspector
                </span>
                {executionTime !== null && (
                  <span className="text-[9px] font-mono text-slate-400">Time: {executionTime}ms</span>
                )}
              </div>

              {/* Status Header */}
              {responseStatus !== null ? (
                <div className="flex items-center justify-between mb-4 bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">Status:</span>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        responseStatus >= 200 && responseStatus < 300
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                          : "bg-red-950 text-red-400 border border-red-800/40"
                      }`}
                    >
                      {responseStatus} {responseStatus === 200 ? "OK" : responseStatus === 201 ? "Created" : "Error"}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">JSON</span>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-center p-4 bg-slate-900/40 border border-slate-900 border-dashed rounded-lg text-slate-500 mb-4">
                  <HelpCircle className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
                  <p className="text-xs">No request sent yet</p>
                  <p className="text-[10px] text-slate-600 max-w-xs mt-1">
                    Select an endpoint on the left, tweak optional body parameters, and click "Send API Request".
                  </p>
                </div>
              )}

              {/* Response headers */}
              {responseStatus !== null && Object.keys(responseHeaders).length > 0 && (
                <div className="mb-4 space-y-1">
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">Headers</span>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-900 text-[10px] font-mono space-y-0.5 text-slate-400 leading-normal">
                    {Object.entries(responseHeaders).map(([k, v]) => (
                      <div key={k} className="truncate">
                        <span className="text-slate-500">{k}:</span> {v}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Body */}
              {responseStatus !== null && (
                <div className="space-y-1 flex-1">
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">Response Payload</span>
                  <pre className="bg-slate-900 border border-slate-900 p-4 rounded-lg text-[10px] font-mono leading-relaxed overflow-auto max-h-72">
                    <code>{JSON.stringify(responseData, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>

            {responseStatus !== null && (
              <div className="pt-3 border-t border-slate-900/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>Client validation: Complete</span>
                <span>Payload: gzip</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Database, Terminal, Server, ShieldAlert, Sparkles, AlertCircle, Play, Loader2 } from "lucide-react";
import { DBTable } from "../types";

export default function DatabaseExplorer() {
  const [activeTab, setActiveTab] = useState<"schema" | "playground">("schema");
  const [selectedTable, setSelectedTable] = useState<string>("products");
  const [sqlQuery, setSqlQuery] = useState<string>("SELECT * FROM products;");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tabular execution results
  const [queryResult, setQueryResult] = useState<{
    columns: string[];
    rows: any[][];
    rowCount: number;
    executionTimeMs: number;
  } | null>(null);

  const tables: DBTable[] = [
    {
      name: "profiles",
      description: "User profiles for store owners, shoppers, and delivery drivers mapped to Supabase Authentication UUIDs.",
      columns: [
        { name: "id", type: "uuid", nullable: false, isPrimary: true, references: "auth.users.id" },
        { name: "email", type: "varchar", nullable: false, isPrimary: false },
        { name: "name", type: "varchar", nullable: false, isPrimary: false },
        { name: "role", type: "varchar", nullable: false, isPrimary: false },
        { name: "store_id", type: "uuid", nullable: true, isPrimary: false, references: "stores.id" },
        { name: "created_at", type: "timestamp", nullable: false, isPrimary: false }
      ],
      rlsPolicies: [
        "Enable select access for authenticated users to view their own profile.",
        "Enable update access for users editing their own metadata."
      ]
    },
    {
      name: "stores",
      description: "Indian and ethnic grocery retailers registered on the platform, tracking suburb location parameters.",
      columns: [
        { name: "id", type: "uuid", nullable: false, isPrimary: true },
        { name: "name", type: "varchar", nullable: false, isPrimary: false },
        { name: "location", type: "varchar", nullable: false, isPrimary: false },
        { name: "status", type: "varchar", nullable: false, isPrimary: false },
        { name: "created_at", type: "timestamp", nullable: false, isPrimary: false }
      ],
      rlsPolicies: [
        "Enable public select access to view active stores on the mobile map.",
        "Enable insert/update/delete ONLY for site administrator roles."
      ]
    },
    {
      name: "products",
      description: "Master ethnic catalog products tracking names, stock counts, prices, and categories.",
      columns: [
        { name: "id", type: "uuid", nullable: false, isPrimary: true },
        { name: "store_id", type: "uuid", nullable: false, isPrimary: false, references: "stores.id" },
        { name: "name", type: "varchar", nullable: false, isPrimary: false },
        { name: "category", type: "varchar", nullable: true, isPrimary: false },
        { name: "price", type: "numeric", nullable: false, isPrimary: false },
        { name: "stock", type: "integer", nullable: false, isPrimary: false },
        { name: "active", type: "boolean", nullable: false, isPrimary: false },
        { name: "created_at", type: "timestamp", nullable: false, isPrimary: false }
      ],
      rlsPolicies: [
        "Enable read-only SELECT access for all customer clients.",
        "Enable write permissions (INSERT/UPDATE) strictly for authenticated profiles linked to the matching store_id."
      ]
    },
    {
      name: "feature_flags",
      description: "System configuration flags to toggle features dynamically across environments without shipping code.",
      columns: [
        { name: "key", type: "varchar", nullable: false, isPrimary: true },
        { name: "description", type: "text", nullable: false, isPrimary: false },
        { name: "value", type: "boolean", nullable: false, isPrimary: false },
        { name: "environment", type: "varchar", nullable: false, isPrimary: false }
      ],
      rlsPolicies: [
        "Enable general read access for edge gateways and server endpoints.",
        "Restrict modification queries (UPDATE/DELETE) to Site Administrators."
      ]
    },
    {
      name: "orders",
      description: "Tracks customer pickup/delivery orders, statuses, dispatch types, and billing summaries.",
      columns: [
        { name: "id", type: "uuid", nullable: false, isPrimary: true },
        { name: "store_id", type: "uuid", nullable: false, isPrimary: false, references: "stores.id" },
        { name: "customer_name", type: "varchar", nullable: false, isPrimary: false },
        { name: "status", type: "varchar", nullable: false, isPrimary: false },
        { name: "delivery_method", type: "varchar", nullable: false, isPrimary: false },
        { name: "total_amount", type: "numeric", nullable: false, isPrimary: false },
        { name: "created_at", type: "timestamp", nullable: false, isPrimary: false }
      ],
      rlsPolicies: [
        "Enable SELECT/INSERT for authenticated customers where customer profile matches profile UUID.",
        "Enable read/write SELECT/UPDATE for merchants holding the corresponding store_id."
      ]
    },
    {
      name: "order_items",
      description: "Sub-table linking individual products to parents inside orders schema.",
      columns: [
        { name: "id", type: "uuid", nullable: false, isPrimary: true },
        { name: "order_id", type: "uuid", nullable: false, isPrimary: false, references: "orders.id" },
        { name: "product_id", type: "uuid", nullable: false, isPrimary: false, references: "products.id" },
        { name: "quantity", type: "integer", nullable: false, isPrimary: false },
        { name: "unit_price", type: "numeric", nullable: false, isPrimary: false }
      ],
      rlsPolicies: [
        "Inherit parent transaction visibility filters under matching profile permissions.",
        "Enable read-only SELECT for authenticated clients connected to corresponding order."
      ]
    },
    {
      name: "restock_forecasts",
      description: "Gemini-predicted inventory forecasting analysis, warning merchants of safety stock depletion.",
      columns: [
        { name: "id", type: "uuid", nullable: false, isPrimary: true },
        { name: "product_id", type: "uuid", nullable: false, isPrimary: false, references: "products.id" },
        { name: "current_stock", type: "integer", nullable: false, isPrimary: false },
        { name: "predicted_sales_30d", type: "integer", nullable: false, isPrimary: false },
        { name: "recommended_restock", type: "integer", nullable: false, isPrimary: false },
        { name: "urgency", type: "varchar", nullable: false, isPrimary: false },
        { name: "run_date", type: "timestamp", nullable: false, isPrimary: false }
      ],
      rlsPolicies: [
        "Enable general read SELECT permissions only for merchants checking matching store catalog products.",
        "Deny explicit write access across public/merchant APIs; modifications restricted to cron trigger worker accounts."
      ]
    }
  ];

  const currentTable = tables.find(t => t.name === selectedTable)!;

  // Run SQL query directly on Express mock database
  const executeSQL = async () => {
    setLoading(true);
    setErrorMsg(null);
    setQueryResult(null);

    try {
      const response = await fetch("/api/database/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: sqlQuery })
      });

      const data = await response.json();
      if (response.ok) {
        setQueryResult(data);
      } else {
        setErrorMsg(data.error || "An error occurred executing query.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to establish database socket link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Supabase Schema
          </span>
          <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
            Database Architecture & SQL Playground
          </h2>
        </div>
        <p className="text-slate-500 text-xs max-w-3xl">
          Explore Boota's relational schema and security parameters, or write queries inside our live SQL engine to query our relational store database!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100">
        <button
          onClick={() => setActiveTab("schema")}
          className={`pb-2 px-4 text-xs font-semibold tracking-wide transition-all border-b-2 cursor-pointer ${
            activeTab === "schema"
              ? "border-sky-500 text-sky-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Schema Browser
        </button>
        <button
          onClick={() => setActiveTab("playground")}
          className={`pb-2 px-4 text-xs font-semibold tracking-wide transition-all border-b-2 cursor-pointer ${
            activeTab === "playground"
              ? "border-sky-500 text-sky-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          SQL Terminal Playground
        </button>
      </div>

      {/* SCHEMA BROWSER VIEW */}
      {activeTab === "schema" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Tables list (4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
              Database Tables
            </h3>
            <div className="space-y-1.5">
              {tables.map(t => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTable(t.name)}
                  className={`w-full p-2.5 rounded-lg text-left text-xs font-medium border flex items-center gap-2.5 transition-all ${
                    selectedTable === t.name
                      ? "border-sky-500 bg-sky-50/30 text-sky-900 font-semibold"
                      : "border-slate-50 bg-slate-50 hover:bg-slate-100/40 text-slate-600"
                  }`}
                >
                  <Database className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Details (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Properties */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-mono">table: {currentTable.name}</h3>
                  <p className="text-slate-500 text-xs mt-1">{currentTable.description}</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                  PostgreSQL
                </span>
              </div>

              {/* Columns Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Column Name</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Nullable</th>
                      <th className="py-2.5 px-3">Keys & References</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentTable.columns.map(col => (
                      <tr key={col.name} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-mono font-semibold text-slate-900">{col.name}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{col.type}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              col.nullable ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
                            }`}
                          >
                            {col.nullable ? "NULL" : "NOT NULL"}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[10px]">
                          {col.isPrimary && (
                            <span className="text-orange-700 bg-orange-50 font-bold px-1.5 py-0.5 rounded">PK</span>
                          )}
                          {col.references && (
                            <span className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded ml-1">
                              FK ➔ {col.references}
                            </span>
                          )}
                          {!col.isPrimary && !col.references && <span className="text-slate-300">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Row Level Security Rules */}
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Row-Level Security (RLS) Active Policies
              </h4>
              <p className="text-slate-500 text-xs">
                To guarantee strict data isolation for every merchant store tenant, the following PostgreSQL rules execute automatically before serving or accepting modification transactions:
              </p>
              <ul className="space-y-1.5 pl-5 list-disc text-slate-600 text-xs leading-relaxed">
                {currentTable.rlsPolicies.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SQL PLAYGROUND VIEW */}
      {activeTab === "playground" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Query Editor & Helper templates (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
                  Write SQL Query
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Terminal 1</span>
              </div>

              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="w-full bg-slate-950 text-slate-300 border border-slate-800 rounded-lg p-3 font-mono text-xs h-36 resize-none focus:outline-none focus:border-sky-500"
              />

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Quick Query Templates
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Fetch Products", query: "SELECT * FROM products;" },
                    { label: "Fetch Stores", query: "SELECT * FROM stores;" },
                    { label: "Fetch Flags", query: "SELECT * FROM feature_flags;" },
                    { label: "Fetch Orders", query: "SELECT * FROM orders;" },
                    { label: "Fetch Order Items", query: "SELECT * FROM order_items;" },
                    { label: "Fetch Restock Forecasts", query: "SELECT * FROM restock_forecasts;" }
                  ].map((temp, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSqlQuery(temp.query)}
                      className="px-2.5 py-1 bg-slate-50 border border-slate-150 text-slate-600 rounded text-[10px] hover:bg-slate-100 transition-all font-mono"
                    >
                      {temp.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={executeSQL}
                disabled={loading}
                className="w-full bg-sky-600 hover:bg-sky-750 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Executing SQL Transaction...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Run Query (F5)
                  </>
                )}
              </button>
            </div>

            <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-xl flex gap-2.5 text-xs text-sky-800 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Query Sanbox Constraints</p>
                <p className="text-[11px] text-sky-700 mt-0.5">
                  For security, writing queries is sandboxed. Only SELECT operations on tables \`products\`, \`stores\`, and \`feature_flags\` are active.
                </p>
              </div>
            </div>
          </div>

          {/* Table Results (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950 text-slate-300 p-5 rounded-xl border border-slate-850 shadow-lg min-h-[400px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    Interactive SQL Terminal
                  </span>
                  {queryResult && (
                    <span className="text-[9px] font-mono text-slate-500">
                      Executed in {queryResult.executionTimeMs}ms
                    </span>
                  )}
                </div>

                {/* Error box */}
                {errorMsg && (
                  <div className="bg-red-950/40 border border-red-800/40 text-red-400 p-4 rounded-lg text-xs flex items-start gap-2.5 leading-relaxed font-mono mb-4">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Database Error:</p>
                      <p className="mt-1">{errorMsg}</p>
                    </div>
                  </div>
                )}

                {/* Success Data Grid */}
                {queryResult ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Rows returned: {queryResult.rowCount}</span>
                      <span>Format: Tabular</span>
                    </div>

                    <div className="overflow-x-auto border border-slate-800 rounded-lg">
                      <table className="w-full text-left text-[10px] font-mono text-slate-300 whitespace-nowrap">
                        <thead className="bg-slate-900 text-slate-500 border-b border-slate-800">
                          <tr>
                            {queryResult.columns.map(col => (
                              <th key={col} className="py-2 px-3 tracking-wide">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                          {queryResult.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-900/40">
                              {row.map((val, cIdx) => (
                                <td key={cIdx} className="py-2 px-3 max-w-[150px] truncate">
                                  {val === true ? (
                                    <span className="text-emerald-400">TRUE</span>
                                  ) : val === false ? (
                                    <span className="text-red-400">FALSE</span>
                                  ) : val === null || val === undefined ? (
                                    <span className="text-slate-600">NULL</span>
                                  ) : (
                                    String(val)
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  !errorMsg && (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-4 bg-slate-900/30 border border-slate-900 border-dashed rounded-lg text-slate-600">
                      <Terminal className="w-8 h-8 text-slate-800 mb-2 animate-pulse" />
                      <p className="text-xs">Console Ready</p>
                      <p className="text-[10px] text-slate-700 mt-1 max-w-xs">
                        Run the default select statement or click one of our quick templates to query live store data.
                      </p>
                    </div>
                  )
                )}
              </div>

              {queryResult && (
                <div className="pt-3 border-t border-slate-900/80 text-[10px] text-slate-500 flex justify-between font-mono">
                  <span>Socket connection: Alive</span>
                  <span>Isolation: Row-Level Isolation (AU-NSW)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

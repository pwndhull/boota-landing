import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ComponentStudio from "./components/ComponentStudio";
import ApiExplorer from "./components/ApiExplorer";
import DatabaseExplorer from "./components/DatabaseExplorer";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AiWorkspace from "./components/AiWorkspace";
import AdrViewer from "./components/AdrViewer";
import EngineeringHandbook from "./components/EngineeringHandbook";
import RoadmapKanban from "./components/RoadmapKanban";
import { docSections } from "./data/docsData";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, BookOpen, Cpu, Terminal, Database, BarChart2, Sparkles, Network, ArrowUpRight, CheckCircle2, ChevronRight, ListCollapse } from "lucide-react";

export default function App() {
  const checkDocsRoute = () => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;
    return path.includes("/internalDocs") || hash.includes("internalDocs") || search.includes("internalDocs");
  };

  const [isDocsRoute, setIsDocsRoute] = useState<boolean>(checkDocsRoute);
  const [activePageId, setActivePageId] = useState<string>("intro");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const handlePopState = () => {
      setIsDocsRoute(checkDocsRoute());
    };
    const handleHashChange = () => {
      setIsDocsRoute(checkDocsRoute());
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleEnterDocs = () => {
    setIsDocsRoute(true);
    try {
      // Build relative path safe for subdirectory hosting (like /boota-landing/)
      const currentPath = window.location.pathname;
      const separator = currentPath.endsWith("/") ? "" : "/";
      const targetPath = currentPath.includes("internalDocs") 
        ? currentPath 
        : currentPath + separator + "internalDocs";
      
      window.history.pushState({}, "", targetPath);
    } catch (e) {
      window.location.hash = "/internalDocs";
    }
  };

  // Handler to jump directly from Header or Landings to specific pages
  const handlePageSelect = (pageId: string) => {
    setActivePageId(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Find doc data if it's a documentation page
  const allDocPages = docSections.flatMap(s => s.pages);
  const activeDocPage = allDocPages.find(p => p.id === activePageId);

  // Render Page Content based on ID
  const renderPageContent = () => {
    switch (activePageId) {
      case "studio":
        return <ComponentStudio />;
      case "api":
        return <ApiExplorer />;
      case "database":
        return <DatabaseExplorer />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "ai":
        return <AiWorkspace />;
      case "adrs":
        return <AdrViewer />;
      case "handbook":
        return <EngineeringHandbook />;
      case "roadmap":
        return <RoadmapKanban />;
      default:
        if (activeDocPage) {
          return (
            <div className="space-y-6">
              {/* Doc Title & Description */}
              <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider font-mono">
                  {activeDocPage.category} docs
                </span>
                <h2 className="text-2xl font-display font-semibold text-slate-900 tracking-tight">
                  {activeDocPage.title}
                </h2>
                <p className="text-slate-500 text-xs leading-normal max-w-3xl">
                  {activeDocPage.description}
                </p>
              </div>

              {/* Render Landing Page Hero IF Intro is selected */}
              {activePageId === "intro" && (
                <div className="space-y-8">
                  {/* Premium Stripe-inspired Hero Header */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
                    {/* Glowing effect blobs */}
                    <div className="absolute -right-12 -top-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Left col text (7 cols) */}
                      <div className="lg:col-span-7 space-y-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="bg-orange-500/20 text-orange-300 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                            Engineers Hub
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Platform v1.4</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white leading-tight">
                          The engineering knowledge portal for <span className="text-orange-400">Boota</span>
                        </h1>

                        <p className="text-slate-300 text-xs leading-relaxed max-w-lg">
                          Vision, architecture, server-driven UI, API playgrounds, analytics telemetry, and the real-time AI workspace — a single, opinionated source of truth for how we build.
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                          <button
                            onClick={() => handlePageSelect("architecture")}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/10 transition-al[...]
                            >
                            Read the architecture
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handlePageSelect("studio")}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 font-medium px-4 py-2 rounded-lg text-xs transition-all cursor-pointer"
                          >
                            Explore components
                          </button>
                        </div>
                      </div>

                      {/* Right col code screen mockup (5 cols) */}
                      <div className="lg:col-span-5">
                        <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 font-mono text-[10px] text-slate-300 shadow-xl relative overflow-hidden leading-normal">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                            <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">boota-nexus.ts</span>
                            <div className="flex gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                              <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                              <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                            </div>
                          </div>
                          <span className="text-slate-500 block">// Boot up Boota Core</span>
                          <p className="mt-1"><span className="text-indigo-400">import</span> &#123; <span className="text-orange-400">Nexus</span> &#125; <span className="text-indigo-400">from</[...]
                          <p className="mt-2.5"><span className="text-indigo-400">const</span> <span className="text-blue-400">nexus</span> = <span className="text-indigo-400">new</span> <span cl[...]
                          <p className="pl-4">vision: <span className="text-emerald-400">"composable product platform"</span>,</p>
                          <p className="pl-4">runtime: <span className="text-emerald-400">"server-driven"</span>,</p>
                          <p className="pl-4">ai: &#123; agents: <span className="text-amber-400">true</span>, evals: <span className="text-amber-400">true</span> &#125;</p>
                          <p>&#125;);</p>
                          <p className="mt-3 text-slate-500">// -&gt; loading documentation...</p>
                          <p><span className="text-indigo-400">await</span> <span className="text-blue-400">nexus</span>.<span className="text-amber-400">boot</span>();</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Everything in the Nexus Grid (Stripe style directories) */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Everything in the Nexus
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { title: "Platform Architecture", desc: "System topology, tenant isolation with PostgreSQL RLS.", link: "architecture", tag: "blueprint", icon: <Cpu className="w-4 h-4 tex[...]
                        { title: "Server Driven UI", desc: "How screens are described by server and compiled client-side.", link: "sdui", tag: "core UI", icon: <ChevronRight className="w-4 h-4 te[...]
                        { title: "Component Studio", desc: "Interactive builder tool with live mock device frame.", link: "studio", tag: "builder", icon: <Sparkles className="w-4 h-4 text-amber-5[...]
                        { title: "API Explorer", desc: "Try out real API endpoints live on the server-side backend.", link: "api", tag: "testing", icon: <Terminal className="w-4 h-4 text-emerald-[...]
                        { title: "Database Schemas", desc: "Browse columns, keys, references, and run custom queries.", link: "database", tag: "data", icon: <Database className="w-4 h-4 text-sky-[...]
                        { title: "AI Workspace", desc: "Chat in real-time with our Gemini Architect assistant.", link: "ai", tag: "intelligence", icon: <Sparkles className="w-4 h-4 text-indigo-50[...]
                      ].map((card, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePageSelect(card.link)}
                          className="text-left bg-white p-5 rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all group cursor-pointer space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-orange-50 transition-colors">
                              {card.icon}
                            </div>
                            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-mono font-bold tracking-wider">
                              {card.tag}
                            </span>
                          </div>
                          <h4 className="font-display font-semibold text-slate-900 text-xs flex items-center gap-1 group-hover:text-orange-600 transition-colors">
                            {card.title}
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>
                          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                            {card.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Page Body Text content (rendered with nice typography spacing) */}
              <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed font-sans space-y-4 pt-2">
                {activeDocPage.content.split("\n\n").map((para, i) => {
                  // Basic markdown elements styling on the fly
                  if (para.startsWith("###")) {
                    return (
                      <h3 key={i} className="text-sm font-bold font-display text-slate-900 uppercase tracking-wider pt-4 pb-1 border-b border-slate-50">
                        {para.replace("###", "").trim()}
                      </h3>
                    );
                  }
                  if (para.startsWith("-") || para.startsWith("*")) {
                    return (
                      <ul key={i} className="list-disc pl-5 space-y-1.5 text-xs">
                        {para.split("\n").map((li, liIdx) => (
                          <li key={liIdx} className="text-slate-600 leading-relaxed">
                            {li.replace(/^[-*]\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (para.startsWith("```")) {
                    const codeText = para.replace(/```[a-z]*/g, "").trim();
                    return (
                      <pre key={i} className="bg-slate-950 text-slate-300 p-4 rounded-xl border border-slate-900 font-mono text-[10px] leading-normal overflow-x-auto my-3">
                        <code>{codeText}</code>
                      </pre>
                    );
                  }
                  if (para.startsWith("|")) {
                    // Simple table parser
                    const rows = para.split("\n").filter(r => r.trim() !== "");
                    return (
                      <div key={i} className="overflow-x-auto my-3 border border-slate-100 rounded-lg">
                        <table className="w-full text-left text-xs text-slate-600">
                          <tbody className="divide-y divide-slate-100">
                            {rows.map((row, rIdx) => {
                              const cols = row.split("|").map(c => c.trim()).filter(c => c !== "");
                              const isHeader = rIdx === 0;
                              const isDivider = row.includes("---");
                              if (isDivider) return null;
                              return (
                                <tr key={rIdx} className={isHeader ? "bg-slate-50 font-semibold text-slate-700" : "hover:bg-slate-50/30"}>
                                  {cols.map((col, cIdx) => (
                                    <td key={cIdx} className="py-2.5 px-4 font-sans leading-normal">
                                      {col}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="text-xs text-slate-600 leading-relaxed">
                      {para}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        }
        return <div className="text-slate-500 text-xs">Page not found</div>;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        activePageId={activePageId}
        onPageSelect={handlePageSelect}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main shell */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Dynamic portal top bar */}
        <Header onEnterPlayground={handlePageSelect} />

        {/* Content canvas with transitions */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePageId}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {renderPageContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

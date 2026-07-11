import React from "react";
import { docSections } from "../data/docsData";
import { BookOpen, Monitor, Play, FileCode, Search, Terminal, Database, BarChart2, ShieldAlert, Cpu, Sparkles, Network } from "lucide-react";

interface SidebarProps {
  activePageId: string;
  onPageSelect: (pageId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Sidebar({
  activePageId,
  onPageSelect,
  searchQuery,
  setSearchQuery
}: SidebarProps) {
  // Map icons to categories or special pages
  const getIcon = (id: string) => {
    switch (id) {
      case "intro": return <BookOpen className="w-4 h-4" />;
      case "vision": return <Network className="w-4 h-4" />;
      case "product": return <Monitor className="w-4 h-4" />;
      case "architecture": return <Cpu className="w-4 h-4" />;
      case "sdui": return <FileCode className="w-4 h-4" />;
      case "studio": return <Sparkles className="w-4 h-4 text-amber-500" />;
      case "api": return <Terminal className="w-4 h-4 text-emerald-500" />;
      case "database": return <Database className="w-4 h-4 text-sky-500" />;
      case "analytics": return <BarChart2 className="w-4 h-4 text-purple-500" />;
      case "ai": return <Sparkles className="w-4 h-4 text-indigo-500" />;
      case "adrs": return <ShieldAlert className="w-4 h-4" />;
      case "handbook": return <BookOpen className="w-4 h-4" />;
      case "roadmap": return <Play className="w-4 h-4" />;
      default: return <FileCode className="w-4 h-4" />;
    }
  };

  const menuSections = [
    {
      title: "Overview",
      items: docSections.find(s => s.id === "overview")?.pages.map(p => ({ id: p.id, title: p.title })) || []
    },
    {
      title: "Platform",
      items: docSections.find(s => s.id === "platform")?.pages.map(p => ({ id: p.id, title: p.title })) || []
    },
    {
      title: "Builders (Playgrounds)",
      items: [
        { id: "studio", title: "Component Studio" },
        { id: "api", title: "API Explorer" },
        { id: "database", title: "Database Schema" },
        { id: "analytics", title: "Analytics Tracker" },
        { id: "ai", title: "AI Workspace" }
      ]
    },
    {
      title: "Engineering",
      items: [
        { id: "adrs", title: "Architectural Decisions" },
        { id: "handbook", title: "Developer Handbook" },
        { id: "roadmap", title: "Technical Roadmap" }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen overflow-y-auto shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-display font-bold text-white text-lg tracking-wider shadow-md shadow-orange-500/20">
          B
        </div>
        <div>
          <h1 className="font-display font-semibold text-white tracking-tight text-md">Boota Nexus</h1>
          <span className="text-[10px] text-orange-400 font-mono tracking-wider uppercase font-medium">Knowledge Portal</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search docs & builders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-4 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Menu Sections */}
      <nav className="flex-1 px-4 py-3 space-y-6">
        {menuSections.map((section, idx) => {
          const filteredItems = section.items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1.5">
              <h3 className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase px-2">
                {section.title}
              </h3>
              <ul className="space-y-0.5">
                {filteredItems.map(item => {
                  const isActive = activePageId === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onPageSelect(item.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-left transition-all ${
                          isActive
                            ? "bg-slate-800 text-white border-l-2 border-orange-500 pl-2"
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                        }`}
                      >
                        {getIcon(item.id)}
                        <span className="truncate">{item.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer Meta */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 text-[11px] text-slate-500 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-slate-400">Environment: Prod-AU</span>
        </div>
        <p className="text-[10px]">Release: v1.4.2-Nexus</p>
      </div>
    </aside>
  );
}

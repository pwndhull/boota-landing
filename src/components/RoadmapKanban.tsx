import React, { useState } from "react";
import { roadmapItems } from "../data/docsData";
import { RoadmapItem } from "../types";
import { Target, Star, Compass, Loader2 } from "lucide-react";

export default function RoadmapKanban() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Builders", "Core Engine", "Infrastructure", "Loyalty"];

  const filteredItems = selectedCategory === "All"
    ? roadmapItems
    : roadmapItems.filter(item => item.category === selectedCategory);

  const getStatusColor = (status: "Now" | "Next" | "Later") => {
    switch (status) {
      case "Now": return "border-orange-500 bg-orange-50 text-orange-800";
      case "Next": return "border-blue-500 bg-blue-50 text-blue-800";
      case "Later": return "border-slate-400 bg-slate-50 text-slate-700";
    }
  };

  const getStatusIcon = (status: "Now" | "Next" | "Later") => {
    switch (status) {
      case "Now": return <Target className="w-4 h-4 text-orange-500" />;
      case "Next": return <Star className="w-4 h-4 text-blue-500" />;
      case "Later": return <Compass className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Quarterly Roadmap
          </span>
          <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
            Technical Roadmap Commitments
          </h2>
        </div>
        <p className="text-slate-500 text-xs max-w-3xl">
          Track active projects and engineering deliverables across quarters. Filter items below to inspect strategic objectives.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-50">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              selectedCategory === cat
                ? "border-orange-500 bg-orange-50 text-orange-800 font-semibold"
                : "border-slate-150 bg-slate-50 hover:bg-slate-100 text-slate-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Kanban grid columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NOW column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              1. Commited (Now)
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-mono font-bold px-2 py-0.5 rounded">
              Active Q3
            </span>
          </div>

          <div className="space-y-3.5">
            {filteredItems.filter(item => item.status === "Now").length === 0 ? (
              <p className="text-slate-400 text-xs italic p-4 text-center border border-slate-100 border-dashed rounded-lg">
                No active projects
              </p>
            ) : (
              filteredItems.filter(item => item.status === "Now").map(item => (
                <div key={item.id} className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs space-y-3">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[9px] bg-orange-50 text-orange-700 font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">{item.description}</p>
                  
                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>Progress</span>
                      <span className="font-bold text-slate-700">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NEXT column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              2. Backlog (Next)
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-mono font-bold px-2 py-0.5 rounded">
              Planned Q4
            </span>
          </div>

          <div className="space-y-3.5">
            {filteredItems.filter(item => item.status === "Next").length === 0 ? (
              <p className="text-slate-400 text-xs italic p-4 text-center border border-slate-100 border-dashed rounded-lg">
                No active projects
              </p>
            ) : (
              filteredItems.filter(item => item.status === "Next").map(item => (
                <div key={item.id} className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs space-y-3">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[9px] bg-blue-50 text-blue-700 font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">{item.description}</p>
                  
                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>Progress</span>
                      <span className="font-bold text-slate-700">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* LATER column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              3. Proposed (Later)
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-mono font-bold px-2 py-0.5 rounded">
              Research H1
            </span>
          </div>

          <div className="space-y-3.5">
            {filteredItems.filter(item => item.status === "Later").length === 0 ? (
              <p className="text-slate-400 text-xs italic p-4 text-center border border-slate-100 border-dashed rounded-lg">
                No active projects
              </p>
            ) : (
              filteredItems.filter(item => item.status === "Later").map(item => (
                <div key={item.id} className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs space-y-3">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[9px] bg-slate-50 text-slate-700 border border-slate-150 font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">{item.description}</p>
                  
                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>Progress</span>
                      <span className="font-bold text-slate-700">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

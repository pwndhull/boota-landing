import React from "react";
import { adrs } from "../data/docsData";
import { CheckCircle2, AlertCircle, FileText, ArrowRight } from "lucide-react";

export default function AdrViewer() {
  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Architecture History
          </span>
          <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
            Architectural Decision Records (ADRs)
          </h2>
        </div>
        <p className="text-slate-500 text-xs max-w-3xl">
          Review historic and active design definitions. ADRs capture the constraints, options, trade-offs, and final consensuses that form Boota's technology stack.
        </p>
      </div>

      {/* ADR Items */}
      <div className="space-y-5">
        {adrs.map(adr => {
          const isAccepted = adr.status === "Accepted";
          return (
            <div
              key={adr.id}
              className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Header card */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-400">{adr.id}</span>
                  <h3 className="font-display font-semibold text-slate-900 text-sm">{adr.title}</h3>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-400 font-mono">{adr.date}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 uppercase tracking-wider ${
                      isAccepted
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                        : "bg-amber-50 text-amber-800 border border-amber-100"
                    }`}
                  >
                    {isAccepted ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {adr.status}
                  </span>
                </div>
              </div>

              {/* Grid content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
                {/* Context */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Context & Constraints</h4>
                  <p>{adr.context}</p>
                </div>

                {/* Decision */}
                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Decision Proposal</h4>
                  <p className="font-medium text-slate-800">{adr.decision}</p>
                </div>

                {/* Consequences */}
                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consequences</h4>
                  <p>{adr.consequences}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

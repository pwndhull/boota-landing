import React from "react";
import { Search, ExternalLink, ArrowRight, Github, BookOpen, Layers } from "lucide-react";

interface HeaderProps {
  onEnterPlayground: (playgroundId: string) => void;
}

export default function Header({ onEnterPlayground }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Layers className="w-4 h-4 text-orange-500" />
        <span>Boota Platform</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800 font-semibold font-display">Developer Portal</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Rapid Playground entry buttons */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
          <button
            onClick={() => onEnterPlayground("studio")}
            className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
          >
            Component Studio
          </button>
          <button
            onClick={() => onEnterPlayground("api")}
            className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
          >
            API Playground
          </button>
          <button
            onClick={() => onEnterPlayground("ai")}
            className="px-2.5 py-1 rounded-md text-[11px] font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
          >
            AI Architect
          </button>
        </div>

        {/* Action icons */}
        <a
          href="https://github.com"
          target="_blank"
          referrerPolicy="no-referrer"
          className="text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}

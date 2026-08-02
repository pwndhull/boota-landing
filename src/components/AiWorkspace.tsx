import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Brain, Bot, HelpCircle, Loader2, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function AiWorkspace() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "model", text: "Hello! I am the Gemini-powered Boota Nexus Architect. Ask me anything about our platform topology, Row-Level Security isolation, or our custom Server-Driven UI JSON schemas." }
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [promptTemplateSelected, setPromptTemplateSelected] = useState<string>("");

  // Prompt Tuner configurations
  const [temperature, setTemperature] = useState<number>(0.7);
  const [modelType, setModelType] = useState<string>("gemini-3.5-flash");

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const prePromptTemplates = [
    { label: "Explain SDUI Rendering", text: "How does Boota parse JSON layouts dynamically on client devices? Show me a React Native mapping example." },
    { label: "Query Tenant Security", text: "How do we enforce strict multi-tenant merchant boundaries in Supabase PostgreSQL? Give a Row-Level Security policy snippet." },
    { label: "Show Banner SDUI Schema", text: "Show a sample Server-Driven UI JSON payload representing a Promo Banner with red accent color and a navigation button action." }
  ];

  // Send message to Express-server proxying Gemini API!
  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(1), // omit initial greeting to reduce prompt length if needed
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMessages(prev => [...prev, { role: "model", text: data.text }]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: "model", text: `⚠️ API Error: ${data.error || "The Express server encountered a Gemini gateway error."}` }
        ]);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: "model", text: `⚠️ Connection Error: Failed to execute socket callback to Express backend. Please ensure GEMINI_API_KEY is active in your platform panel.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectPrePrompt = (text: string) => {
    setPromptTemplateSelected(text);
    setInputMessage(text);
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            AI Grounding Sandbox
          </span>
          <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
            AI Workspace & Prompts Laboratory
          </h2>
        </div>
        <p className="text-slate-500 text-xs max-w-3xl">
          Test customized prompt matrices directly. Ask questions below to talk with our real server-side Gemini system grounded in our architecture specifications!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column - Prompts & Tuners (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Prompt Templates */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
              1. Architectural Pre-Prompts
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Inject these specialized, pre-composed prompt directives to analyze specific parts of Boota's stack:
            </p>

            <div className="space-y-2">
              {prePromptTemplates.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => selectPrePrompt(item.text)}
                  className="w-full text-left p-3 rounded-lg border border-slate-150 hover:bg-slate-50 text-xs font-medium block transition-all hover:border-indigo-400 cursor-pointer"
                >
                  <span className="text-indigo-600 block mb-1">✦ {item.label}</span>
                  <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2">{item.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Model tuner configuration */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-500" />
              2. Parameter Sandbox
            </h3>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Temperature</span>
                  <span className="font-mono">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Target GenAI Model
                </label>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 focus:outline-none"
                >
                  <option value="gemini-3.5-flash">gemini-3.5-flash (Standard text tasks)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Paid Reasoning)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Real Chat Terminal (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-slate-950 text-slate-300 p-5 rounded-xl border border-slate-850 shadow-lg h-[480px] flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-3 shrink-0">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-slate-500" />
                Gemini Nexus Architect
              </span>
              <span className="text-[9px] bg-indigo-950 text-indigo-400 border border-indigo-900/60 px-2.5 py-0.5 rounded font-mono">
                Active Grounding
              </span>
            </div>

            {/* Scrolling chat logs */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3.5 leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-none font-medium shadow-sm"
                        : "bg-slate-900 text-slate-200 border border-slate-900 rounded-bl-none whitespace-pre-wrap"
                    }`}
                  >
                    <p className="font-sans text-[11px] whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-900 text-slate-400 rounded-xl rounded-bl-none p-3.5 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    <span className="font-mono text-[10px]">Gemini reasoning...</span>
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Input field */}
            <div className="mt-3 pt-3 border-t border-slate-850/60 flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Ask architect about SDUI, Supabase isolation, or picklists..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !inputMessage.trim()}
                className="bg-indigo-600 hover:bg-indigo-750 text-white font-medium p-2 rounded-lg text-xs flex items-center justify-center shadow-sm cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

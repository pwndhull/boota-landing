import React from "react";
import { BookOpen, Code2, ShieldAlert, GitPullRequest, Milestone } from "lucide-react";

export default function EngineeringHandbook() {
  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Operational Rituals
          </span>
          <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
            Engineering Handbook & Coding Standards
          </h2>
        </div>
        <p className="text-slate-500 text-xs max-w-3xl">
          Guidelines and standards for how we code, conduct peer reviews, deploy to production, and maintain our multi-tenant cloud-native systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code Quality Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-slate-800 tracking-wider uppercase flex items-center gap-2">
            <Code2 className="w-4 h-4 text-orange-500" />
            1. Language & Type Standards
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All codebases across the customer mobile apps, driver routing networks, and merchant dashboards are compiled under strict TypeScript specifications:
          </p>
          <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc leading-relaxed">
            <li>
              <strong>Enforce absolute type declarations:</strong> No usage of \`any\` or uncasted objects in shared packages.
            </li>
            <li>
              <strong>Explicit validation schemas:</strong> Every Server-Driven UI response payload from the backend is parsed and validated using Zod schemas before compiling visual blocks.
            </li>
            <li>
              <strong>Prefer descriptive enums:</strong> Do not use magic integers or strings for order statusses, delivery modes, or tenant states. Use standard enums.
            </li>
          </ul>
        </div>

        {/* Git & Deploy Pipeline */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-slate-800 tracking-wider uppercase flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-emerald-500" />
            2. Deployment & Pull Requests
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We operate on a continuous deployment (CD) cycle. Code changes that pass visual regressions are pushed to staging instantly:
          </p>
          <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc leading-relaxed">
            <li>
              <strong>Short-lived branch strategy:</strong> Feature branches are merged back to main within 48 hours.
            </li>
            <li>
              <strong>Double approvals for migrations:</strong> Altering database schema tables or updating Supabase Row-Level security policies requires explicit sign-off from two senior engineers.
            </li>
            <li>
              <strong>No hardcoded variables:</strong> Secrets, API tokens, and credentials must strictly utilize environment variables proxying secret managers.
            </li>
          </ul>
        </div>

        {/* Security Checklist */}
        <div className="bg-slate-50 border border-slate-150 p-6 rounded-xl md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            3. Multi-Tenant Security & Isolation Protocol
          </h4>
          <p className="text-slate-500 text-xs">
            As a multi-tenant marketplace platform with direct financial integrations, maintaining data boundaries is our primary concern:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            <div className="bg-white p-3.5 rounded-lg border border-slate-150 space-y-1">
              <span className="font-bold text-slate-800">1. Isolation</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Ensure every database query references merchant tenants via authorized profiles associated on server-side.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-150 space-y-1">
              <span className="font-bold text-slate-800">2. Input Cleansing</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Sanitize user-provided text inputs to prevent XSS payloads in shared loyalty feedback logs.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-150 space-y-1">
              <span className="font-bold text-slate-800">3. Encryption</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Ensure shopper profile variables are encrypted securely within Supabase buckets during transmission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

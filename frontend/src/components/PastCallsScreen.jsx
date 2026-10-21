import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  Building2, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  PhoneOff, 
  ChevronRight,
  Sparkles,
  BarChart2
} from "lucide-react";
import { OUTCOMES, STAGES } from "../data/stagesData";

export function PastCallsScreen({ calls = [], onSelectCall, onStartNewCall }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      (call.prospect_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (call.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (call.notes || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOutcome = outcomeFilter === "all" || call.outcome === outcomeFilter;
    const matchesStage = stageFilter === "all" || String(call.stage_reached) === String(stageFilter);

    return matchesSearch && matchesOutcome && matchesStage;
  });

  const formatDuration = (sec) => {
    if (!sec) return "0s";
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatTimestamp = (isoStr) => {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffHours < 48) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const getOutcomeBadge = (outcomeVal) => {
    const outcome = OUTCOMES.find((o) => o.value === outcomeVal) || {
      label: outcomeVal || "Not Logged",
      color: "zinc"
    };

    const colorClasses = {
      emerald: "bg-emerald-950/60 text-emerald-300 border-emerald-800/80",
      blue: "bg-blue-950/60 text-blue-300 border-blue-800/80",
      cyan: "bg-cyan-950/60 text-cyan-300 border-cyan-800/80",
      amber: "bg-amber-950/60 text-amber-300 border-amber-800/80",
      orange: "bg-orange-950/60 text-orange-300 border-orange-800/80",
      rose: "bg-rose-950/60 text-rose-300 border-rose-800/80",
      red: "bg-red-950/60 text-red-300 border-red-800/80",
      slate: "bg-slate-800 text-slate-300 border-slate-700",
      gray: "bg-gray-800 text-gray-300 border-gray-700",
      zinc: "bg-zinc-800 text-zinc-400 border-zinc-700"
    };

    const cls = colorClasses[outcome.color] || colorClasses.zinc;

    return (
      <span className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border ${cls}`}>
        {outcome.label}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-900 px-2 py-0.5 rounded">
              Saved Call Logs · Supabase
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Past Calls & Stage Drop-off
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            A list like this is how a caller sees where their calls end, what happened at each stage, and what prospects actually said.
          </p>
        </div>

        <button
          onClick={onStartNewCall}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-lg transition-all shadow-md shadow-blue-600/30 shrink-0"
        >
          + Start New Call
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prospect or company..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Outcome Filter */}
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500"
          >
            <option value="all">All Outcomes</option>
            {OUTCOMES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Stage Reached Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500"
          >
            <option value="all">All Stages</option>
            {STAGES.map((s) => (
              <option key={s.stage} value={s.stage}>
                Stage {s.stage}: {s.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calls List */}
      <div className="space-y-3">
        {filteredCalls.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
            <PhoneOff className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-medium text-slate-400">No calls matching your search/filter.</p>
            <p className="text-xs text-slate-600 mt-1">Start a call or clear filters to see past calls.</p>
          </div>
        ) : (
          filteredCalls.map((call) => {
            const stageInfo = STAGES.find((s) => s.stage === call.stage_reached) || STAGES[0];
            return (
              <div
                key={call.id}
                onClick={() => onSelectCall(call.id)}
                className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-4 md:p-5 rounded-xl transition-all cursor-pointer shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Prospect & Notes */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-sm md:text-base text-white group-hover:text-blue-300 transition-colors">
                      {call.prospect_name}
                    </span>
                    <span className="text-xs text-slate-400">· {call.company_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {call.company_kind}
                    </span>
                  </div>

                  {/* Notes / prospect words excerpt */}
                  <p className="text-xs text-slate-300 font-medium line-clamp-1">
                    {call.notes || call.ai_summary || "Call logged with stage notes"}
                  </p>
                </div>

                {/* Right: Stage, Outcome, Timestamp & Duration */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap md:flex-nowrap justify-between md:justify-end">
                  {/* Stage Reached Badge */}
                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-mono font-semibold text-slate-300">
                      Stage {call.stage_reached}: {stageInfo.shortName}
                    </span>
                  </div>

                  {/* Outcome Badge */}
                  <div>{getOutcomeBadge(call.outcome)}</div>

                  {/* Duration & Time */}
                  <div className="text-right text-xs font-mono text-slate-400 min-w-[90px]">
                    <div className="text-slate-300 font-medium">{formatTimestamp(call.created_at)}</div>
                    <div className="text-[11px] text-slate-400">{formatDuration(call.duration_seconds)}</div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

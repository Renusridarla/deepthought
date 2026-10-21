import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { STAGES } from "../data/stagesData";

export function StageTracker({ currentStageNumber, onSelectStage, stagesRecorded = {} }) {
  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 md:px-8 py-2.5 overflow-x-auto">
      <div className="flex items-center min-w-max gap-1 md:gap-2">
        {STAGES.map((s, idx) => {
          const isCurrent = s.stage === currentStageNumber;
          const isCompleted = s.stage < currentStageNumber || !!stagesRecorded[s.stage];
          const hasRecord = !!stagesRecorded[s.stage];

          return (
            <React.Fragment key={s.stage}>
              <button
                onClick={() => onSelectStage(s.stage)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : isCompleted
                    ? "bg-slate-800/90 text-slate-200 hover:bg-slate-700/80 border border-slate-700/60"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-slate-800/50"
                }`}
              >
                {/* Stage Number / Check Icon */}
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[11px] font-bold ${
                    isCurrent
                      ? "bg-white text-blue-700 font-extrabold"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isCompleted && !isCurrent ? <Check className="w-3 h-3 stroke-[3]" /> : s.stage}
                </span>

                {/* Stage Short Name */}
                <span className="whitespace-nowrap tracking-tight">{s.shortName}</span>

                {/* Dot indicator if words/tap logged */}
                {hasRecord && !isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Data captured" />
                )}
              </button>

              {idx < STAGES.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

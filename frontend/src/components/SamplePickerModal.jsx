import React from "react";
import { X, Sparkles, PhoneCall, Building2, User, ArrowRight } from "lucide-react";
import { SAMPLE_CALLS } from "../data/sampleCalls";

export function SamplePickerModal({ isOpen, onClose, onSelectSample }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                Select Benchmark Call from 100 Transcripts
              </h2>
              <p className="text-xs text-slate-400">
                Use one of these real rewritten calls for testing or your 6-minute video walkthrough.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {SAMPLE_CALLS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => {
                onSelectSample(sample);
                onClose();
              }}
              className="group bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-blue-600/60 p-4 rounded-xl cursor-pointer transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-blue-950 text-blue-400 border border-blue-900 px-2 py-0.5 rounded">
                    {sample.id}
                  </span>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {sample.company}
                  </h3>
                  <span className="text-xs text-slate-400">({sample.companyKind})</span>
                </div>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-900/60 px-2 py-0.5 rounded">
                  Outcome: {sample.outcome}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>{sample.prospectName} · {sample.prospectRole}</span>
                </div>
                <div className="flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Caller: {sample.caller}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-medium line-clamp-2 bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                {sample.summary}
              </p>

              <div className="flex items-center justify-between text-xs text-blue-400 font-medium group-hover:text-blue-300">
                <span>Key prospect words: "{sample.keyWords.slice(0, 50)}..."</span>
                <span className="flex items-center gap-1 font-bold">
                  Load into Call Surface <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

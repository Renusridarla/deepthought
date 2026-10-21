import React, { useState } from "react";
import { 
  X, 
  Clock, 
  Calendar, 
  Building2, 
  User, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  Copy, 
  Check, 
  FileCheck2,
  FileText
} from "lucide-react";
import { OUTCOMES, STAGES } from "../data/stagesData";

export function CallDetailModal({ isOpen, onClose, call }) {
  if (!isOpen || !call) return null;

  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const stageInfo = STAGES.find(s => s.stage === call.stage_reached) || STAGES[0];
  const outcomeInfo = OUTCOMES.find(o => o.value === call.outcome) || { label: call.outcome || "Not Logged" };

  const formatDuration = (sec) => {
    if (!sec) return "0s";
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const handleCopyWhatsApp = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">{call.prospect_name}</h2>
                <span className="text-xs text-slate-400">({call.prospect_role || "Director"})</span>
              </div>
              <p className="text-xs text-slate-400">
                {call.company_name} · <span className="font-mono text-slate-400">{call.company_kind}</span>
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
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Stage Reached</span>
              <span className="font-bold text-blue-400">
                Stage {call.stage_reached}: {stageInfo.shortName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Outcome</span>
              <span className="font-bold text-emerald-400">{outcomeInfo.label}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Duration</span>
              <span className="font-bold text-slate-200 font-mono">{formatDuration(call.duration_seconds)}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Caller</span>
              <span className="font-bold text-slate-200">{call.caller_name || "Caller"}</span>
            </div>
          </div>

          {/* Notes */}
          {call.notes && (
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-xs space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Caller Notes
              </span>
              <p className="text-slate-200 font-medium leading-relaxed">{call.notes}</p>
            </div>
          )}

          {/* AI Validation & Summary */}
          {(call.ai_summary || call.ai_validation) && (
            <div className="bg-blue-950/20 border border-blue-900/40 p-4 rounded-xl text-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  AI Call Audit & Validation (Gemini)
                </span>
              </div>
              {call.ai_summary && (
                <p className="text-slate-200 leading-relaxed font-medium">
                  <span className="text-blue-400 font-semibold">Summary: </span>
                  {call.ai_summary}
                </p>
              )}
              {call.ai_validation && (
                <p className="text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 font-semibold">Validation: </span>
                  {call.ai_validation}
                </p>
              )}
            </div>
          )}

          {/* WhatsApp Message */}
          {call.whatsapp_message && (
            <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Follow-up WhatsApp Message Drafted
                </span>
                <button
                  onClick={() => handleCopyWhatsApp(call.whatsapp_message)}
                  className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-1 rounded transition-colors"
                >
                  {copiedWhatsApp ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedWhatsApp ? "Copied" : "Copy Message"}
                </button>
              </div>
              <p className="text-slate-200 italic font-sans whitespace-pre-wrap bg-slate-950/60 p-3 rounded border border-slate-800">
                {call.whatsapp_message}
              </p>
            </div>
          )}

          {/* Chronological Stages Breakdown */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              Stage-by-Stage Call Progression ({call.stages?.length || 0} stages recorded)
            </h3>

            {(!call.stages || call.stages.length === 0) ? (
              <p className="text-xs text-slate-400 italic bg-slate-950 p-4 rounded-xl border border-slate-800">
                Direct outcome logged at Stage {call.stage_reached}.
              </p>
            ) : (
              <div className="space-y-2.5">
                {call.stages.map((st, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/30 font-mono font-bold text-[11px] flex items-center justify-center">
                          {st.stage_number}
                        </span>
                        <span className="font-bold text-slate-200">{st.stage_name}</span>
                      </div>
                      <span className="text-[10px] text-blue-400 font-mono bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900">
                        {st.what_happened}
                      </span>
                    </div>

                    {st.prospect_words && (
                      <div className="pl-7 pt-1">
                        <span className="text-[10px] font-mono uppercase text-slate-400 block">
                          Verbatim Words:
                        </span>
                        <p className="italic text-slate-300">"{st.prospect_words}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs md:text-sm bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

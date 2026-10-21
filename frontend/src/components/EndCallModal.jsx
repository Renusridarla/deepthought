import React, { useState } from "react";
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Check, 
  Save, 
  Clock, 
  PhoneOff, 
  MessageCircle,
  FileCheck2
} from "lucide-react";
import { OUTCOMES, STAGES } from "../data/stagesData";

export function EndCallModal({
  isOpen,
  onClose,
  callState,
  stagesRecorded,
  onSaveAndClose,
  isSaving
}) {
  if (!isOpen) return null;

  const currentStageInfo = STAGES.find(s => s.stage === callState.currentStage) || STAGES[0];
  
  // Suggest a default outcome based on where the call ended
  const [selectedOutcome, setSelectedOutcome] = useState(
    callState.outcome || currentStageInfo.defaultOutcomeIfEnded || "not_logged"
  );
  const [notes, setNotes] = useState(callState.notes || "");
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [aiValidation, setAiValidation] = useState(null);
  const [isValidatingAI, setIsValidatingAI] = useState(false);

  // Format duration
  const mins = Math.floor((callState.durationSeconds || 0) / 60);
  const secs = (callState.durationSeconds || 0) % 60;
  const durationFormatted = `${mins}m ${secs}s`;

  // Get verbatim words captured across stages (especially stage 5)
  const stage5Words = stagesRecorded[5]?.prospectWords || "";
  const allRecordedWords = Object.entries(stagesRecorded)
    .filter(([_, data]) => data.prospectWords)
    .map(([num, data]) => `Stage ${num}: "${data.prospectWords}"`)
    .join("; ");

  const handleRunAIValidation = async () => {
    setIsValidatingAI(true);
    try {
      const stagesArray = Object.entries(stagesRecorded).map(([stNum, data]) => ({
        stage_number: Number(stNum),
        stage_name: STAGES.find(s => s.stage === Number(stNum))?.name || `Stage ${stNum}`,
        what_happened: data.whatHappened || "",
        prospect_words: data.prospectWords || ""
      }));

      const res = await fetch("/api/ai/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stages: stagesArray,
          outcome: selectedOutcome,
          prospectName: callState.prospectName,
          prospectRole: callState.prospectRole,
          companyName: callState.companyName,
          notes
        })
      });
      const data = await res.json();
      if (data.success && data.debrief) {
        setAiValidation(data.debrief);
      }
    } catch (e) {
      console.warn("AI validation error:", e);
    } finally {
      setIsValidatingAI(false);
    }
  };

  const handleCopyWhatsApp = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  const handleSave = () => {
    onSaveAndClose({
      outcome: selectedOutcome,
      notes,
      aiSummary: aiValidation?.summary || "",
      aiValidation: aiValidation?.outcomeAnalysis || "",
      whatsappMessage: aiValidation?.whatsappMessage || ""
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <PhoneOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Close Call & Save Record</h2>
              <p className="text-xs text-slate-400">
                End call clearly: record the stage reached, outcome, and prospect's words.
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

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Call Meta Summary */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Prospect</span>
              <span className="font-semibold text-slate-200">{callState.prospectName}</span>
              <span className="text-slate-400 block text-[11px] truncate">{callState.companyName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Stage Reached</span>
              <span className="font-semibold text-blue-400">
                Stage {callState.currentStage}: {currentStageInfo.shortName}
              </span>
              <span className="text-slate-400 block text-[11px]">of 8 stages</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Call Duration</span>
              <span className="font-semibold text-emerald-400 font-mono">{durationFormatted}</span>
              <span className="text-slate-400 block text-[11px]">{callState.callType}</span>
            </div>
          </div>

          {/* Captured Verbatim Words Preview */}
          {stage5Words && (
            <div className="bg-amber-950/20 border border-amber-900/50 p-3.5 rounded-xl text-xs">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Stage 5 Prospect Words (Need):
              </span>
              <p className="italic text-amber-100">"{stage5Words}"</p>
            </div>
          )}

          {/* Outcome Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Final Call Outcome (Required)
              </label>
              <span className="text-[10px] text-slate-400 font-mono">10 Standard Outcomes</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OUTCOMES.map((o) => {
                const isSelected = selectedOutcome === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setSelectedOutcome(o.value)}
                    className={`p-2.5 rounded-lg text-xs font-medium text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 font-semibold"
                        : "bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800"
                    }`}
                  >
                    <span>{o.label}</span>
                    <span className={`text-[10px] block mt-1 line-clamp-1 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                      {o.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caller Notes */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Caller Notes / Next Steps
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Founder Vikram to join Tuesday 2 PM Google Meet. Send 3-page chemical margin report."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-3 text-xs md:text-sm text-slate-100 placeholder:text-slate-600 outline-none resize-none"
            />
          </div>

          {/* AI Outcome Validation & WhatsApp Generator */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  AI Outcome Audit & WhatsApp Drafter
                </span>
              </div>
              <button
                onClick={handleRunAIValidation}
                disabled={isValidatingAI}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-900/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isValidatingAI ? "animate-spin" : ""}`} />
                {isValidatingAI ? "Analyzing Call..." : "Run AI Audit"}
              </button>
            </div>

            {aiValidation ? (
              <div className="space-y-3 pt-2">
                {/* Accuracy Badge */}
                <div className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5 ${
                  aiValidation.isOutcomeAccurate
                    ? "bg-emerald-950/30 border-emerald-800/60 text-emerald-200"
                    : "bg-amber-950/30 border-amber-800/60 text-amber-200"
                }`}>
                  {aiValidation.isOutcomeAccurate ? (
                    <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block mb-0.5">
                      {aiValidation.isOutcomeAccurate ? "Outcome Verified by AI" : "Potential Outcome Discrepancy Flagged"}
                    </span>
                    {aiValidation.outcomeAnalysis}
                  </div>
                </div>

                {/* WhatsApp Message Draft */}
                {aiValidation.whatsappMessage && (
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Ready-to-Send WhatsApp Follow-up:
                      </span>
                      <button
                        onClick={() => handleCopyWhatsApp(aiValidation.whatsappMessage)}
                        className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-1 rounded transition-colors"
                      >
                        {copiedWhatsApp ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedWhatsApp ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-slate-300 italic whitespace-pre-wrap font-sans text-xs bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
                      {aiValidation.whatsappMessage}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Click 'Run AI Audit' to verify if the prospect's recorded words match your chosen outcome (preventing false 'interested' logs) and draft a personalized WhatsApp message.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs md:text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cancel / Return to Call
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-xs md:text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving to Supabase..." : "Save Call Record"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

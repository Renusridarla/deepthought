import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  PhoneOff, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  HelpCircle,
  Lightbulb
} from "lucide-react";
import { STAGES } from "../data/stagesData";

export function StageScreen({
  currentStage,
  stageData,
  onSaveStageData,
  onNextStage,
  onPrevStage,
  onEndCall,
  onRequestAIAssist,
  aiAssistText,
  isAILoading,
  prospectName,
  prospectRole,
  companyName
}) {
  const [selectedTap, setSelectedTap] = useState(stageData?.whatHappened || "");
  const [words, setWords] = useState(stageData?.prospectWords || "");
  const [copiedQuote, setCopiedQuote] = useState(null);

  // Update local state when stage changes
  React.useEffect(() => {
    setSelectedTap(stageData?.whatHappened || "");
    setWords(stageData?.prospectWords || "");
  }, [currentStage.stage, stageData]);

  // Handle selecting a tap
  const handleTap = (tap) => {
    setSelectedTap(tap);
    onSaveStageData(currentStage.stage, {
      whatHappened: tap,
      prospectWords: words
    });
  };

  // Handle words change
  const handleWordsChange = (e) => {
    const val = e.target.value;
    setWords(val);
    onSaveStageData(currentStage.stage, {
      whatHappened: selectedTap,
      prospectWords: val
    });
  };

  // Quick-quote click: clicking a "Prospect may say" quote pastes it or appends it
  const handleQuoteClick = (quote) => {
    const cleanQuote = quote.replace(/^["']|["']$/g, "");
    setWords(cleanQuote);
    setCopiedQuote(quote);
    setTimeout(() => setCopiedQuote(null), 1500);
    onSaveStageData(currentStage.stage, {
      whatHappened: selectedTap,
      prospectWords: cleanQuote
    });
  };

  const nextStage = STAGES.find(s => s.stage === currentStage.stage + 1);
  const isStage5 = currentStage.stage === 5;
  const isStage8 = currentStage.stage === 8;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* 1. Stage Header & Purpose Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center bg-blue-600 font-mono text-xs font-black text-white px-2 py-0.5 rounded">
                Stage {currentStage.stage} of 8
              </span>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {currentStage.name}
              </h1>
            </div>
            
            {/* What it is for (One glance line) */}
            <div className="mt-2.5 flex items-start gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-blue-400 shrink-0 mt-0.5 bg-blue-950/70 border border-blue-900 px-1.5 py-0.5 rounded">
                What it is for
              </span>
              <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed">
                {currentStage.purpose}
              </p>
            </div>
          </div>

          {/* Caller Focus Tip */}
          <div className="hidden lg:block max-w-xs text-xs text-slate-400 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
              Caller Posture
            </span>
            {currentStage.callerContext}
          </div>
        </div>
      </div>

      {/* 2. Interactive Tri-Card Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CARD A: What prospects tend to say (4 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Prospect May Say
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">From 100 transcripts</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Real phrases from actual calls. Click any quote to insert into their words:
            </p>

            <div className="space-y-2.5">
              {currentStage.prospectMaySay.map((quote, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuoteClick(quote)}
                  className="w-full text-left p-3 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all text-xs text-slate-300 group flex items-start justify-between gap-2"
                >
                  <span className="italic leading-relaxed group-hover:text-white transition-colors">
                    {quote}
                  </span>
                  <span className="shrink-0 text-slate-400 group-hover:text-blue-400 mt-0.5">
                    {copiedQuote === quote ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Coach Hint */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-snug">{currentStage.aiTip}</p>
          </div>
        </div>

        {/* CARD B & C: Taps and Verbatim Box (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CARD B: What Happened (Taps) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  What Happened
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Single tap selection</span>
            </div>
            <p className="text-xs text-slate-400 mb-3.5">
              Tap the option that fits what happened. The fewer words you type, the more you hear:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentStage.taps.map((tap, idx) => {
                const isSelected = selectedTap === tap;
                return (
                  <button
                    key={idx}
                    onClick={() => handleTap(tap)}
                    className={`p-3 rounded-lg text-xs font-medium text-left transition-all flex items-center justify-between border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 font-semibold"
                        : "bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800/60 border-slate-800"
                    }`}
                  >
                    <span>{tap}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0 ml-1.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD C: Prospect's Own Words */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Their Words
                </h3>
                {isStage5 && (
                  <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                    Crucial Stage · Capture Verbatim
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {words.length} chars
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-2.5">
              {isStage5
                ? "This is the ONE stage where you write down their exact words. What are they trying to do or struggling with?"
                : "The only free text on this screen. Write verbatim phrases they used."}
            </p>

            <textarea
              value={words}
              onChange={handleWordsChange}
              placeholder={
                isStage5
                  ? "e.g., 'Plant running at 60% capacity... raw material margins are shrinking...'"
                  : "e.g., 'accounting for what, we already have a CA who files everything...'"
              }
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 text-xs md:text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all resize-none"
            />
          </div>

          {/* CARD D: Live Gemini AI Pivot Copilot */}
          <div className="bg-slate-900/90 border border-blue-900/50 rounded-xl p-4.5 bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                  Live AI Objection & Pivot Copilot
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-900/60 text-blue-300 border border-blue-700">
                  Gemini 2.5 Flash
                </span>
              </div>

              <button
                onClick={() => onRequestAIAssist(currentStage, selectedTap, words)}
                disabled={isAILoading}
                className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all shadow-sm shadow-blue-500/20"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAILoading ? "animate-spin" : ""}`} />
                {isAILoading ? "Analyzing..." : "⚡ Get AI Pivot"}
              </button>
            </div>

            {aiAssistText ? (
              <div className="mt-2.5 p-3 rounded-lg bg-blue-950/60 border border-blue-800/80 text-xs md:text-sm text-blue-100 font-medium leading-relaxed animate-fadeIn">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block mb-1">
                  Suggested Words to Say Now:
                </span>
                "{aiAssistText}"
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Tap an option or type prospect's words above, then click '⚡ Get AI Pivot' for a high-converting, polite Indian B2B response.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Action Navigation Bar */}
      <div className="sticky bottom-4 z-30 bg-slate-950/95 backdrop-blur border border-slate-800 p-4 rounded-xl shadow-xl flex items-center justify-between gap-4">
        {/* Back Button */}
        <div>
          {currentStage.stage > 1 ? (
            <button
              onClick={onPrevStage}
              className="text-xs md:text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Stage {currentStage.stage - 1}</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400 font-mono pl-2">Call Initiated</div>
          )}
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-3">
          {/* End Call Button (Accessible from ANY stage) */}
          <button
            onClick={onEndCall}
            className="text-xs md:text-sm bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800/80 px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium"
            title="End call now and save outcome (most calls end early)"
          >
            <PhoneOff className="w-4 h-4 text-rose-400" />
            <span>End Call</span>
          </button>

          {/* Next Stage Button */}
          {!isStage8 ? (
            <button
              onClick={onNextStage}
              className="text-xs md:text-sm bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30"
            >
              <span>Next: {nextStage?.shortName}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onEndCall}
              className="text-xs md:text-sm bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
            >
              <span>Complete & Save Call</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Phone, Clock, FileText, PlusCircle, Activity, Sparkles, Building2, User } from "lucide-react";

export function CallHeader({
  callState,
  onNewCall,
  onOpenSamplePicker,
  onEndCall,
  activeTab,
  setActiveTab,
  backendStatus
}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (callState.isActive && !callState.isEnded) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState.isActive, callState.isEnded]);

  // Sync elapsed seconds back to parent when ended
  useEffect(() => {
    if (callState.isEnded) {
      callState.durationSeconds = seconds;
    }
  }, [callState.isEnded, seconds]);

  // Reset timer on new call
  useEffect(() => {
    if (!callState.isEnded && callState.startedAt) {
      setSeconds(0);
    }
  }, [callState.id]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 md:px-8 py-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white uppercase font-mono">
                  Meridian <span className="text-blue-400">Growth Partners</span>
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  Call Guide
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Cold Call Guidance Surface</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("live")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "live"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Active Call
              {callState.isActive && !callState.isEnded && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "past"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Past Calls (CRM)
            </button>
          </nav>
        </div>

        {/* Prospect & Call Status Bar */}
        <div className="flex items-center flex-wrap gap-3">
          {activeTab === "live" && (
            <>
              {/* Prospect Meta Pill */}
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5">
                <div className="flex items-center gap-1.5 text-xs">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-slate-100">{callState.prospectName}</span>
                  <span className="text-slate-400">({callState.prospectRole})</span>
                </div>
                <div className="h-3 w-px bg-slate-700 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{callState.companyName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">· {callState.callType}</span>
                </div>
              </div>

              {/* Live Timer */}
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-sm">
                <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-bold tracking-wider text-emerald-400">{formatTime(seconds)}</span>
              </div>
            </>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSamplePicker}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              title="Load one of the 100 cold-call transcripts for testing or camera walkthrough"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Load Sample Call</span>
              <span className="sm:hidden">Sample</span>
            </button>

            <button
              onClick={onNewCall}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Start a new blank cold call"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">New Call</span>
            </button>

            {activeTab === "live" && !callState.isEnded && (
              <button
                onClick={onEndCall}
                className="text-xs bg-rose-600/90 hover:bg-rose-600 text-white font-medium px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shadow-rose-900/30"
              >
                <Phone className="w-3.5 h-3.5 rotate-[135deg]" />
                End Call
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

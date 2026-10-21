import React, { useState, useEffect } from "react";
import { CallHeader } from "./components/CallHeader";
import { StageTracker } from "./components/StageTracker";
import { StageScreen } from "./components/StageScreen";
import { PastCallsScreen } from "./components/PastCallsScreen";
import { EndCallModal } from "./components/EndCallModal";
import { CallDetailModal } from "./components/CallDetailModal";
import { SamplePickerModal } from "./components/SamplePickerModal";
import { NewCallModal } from "./components/NewCallModal";
import { STAGES } from "./data/stagesData";
import { api } from "./services/api";

export function App() {
  const [activeTab, setActiveTab] = useState("live");
  
  // Active Call State
  const [callState, setCallState] = useState({
    id: "call-" + Date.now(),
    prospectName: "Mr. Dev",
    prospectRole: "Technical Services Director",
    companyName: "Kalpana Chem Supplies",
    companyKind: "mid-size private company",
    callerName: "Priya",
    phoneNumber: "+91 98490 23456",
    callType: "first call",
    currentStage: 1,
    isActive: true,
    isEnded: false,
    startedAt: Date.now(),
    durationSeconds: 0,
    outcome: "not_logged",
    notes: ""
  });

  // Recorded stages data for current call: { [stageNumber]: { whatHappened, prospectWords } }
  const [stagesRecorded, setStagesRecorded] = useState({});

  // AI suggestions per stage
  const [aiAssistByStage, setAiAssistByStage] = useState({});
  const [isAILoading, setIsAILoading] = useState(false);

  // Past calls list & detail
  const [pastCalls, setPastCalls] = useState([]);
  const [selectedCallDetail, setSelectedCallDetail] = useState(null);

  // Modals
  const [isEndCallModalOpen, setIsEndCallModalOpen] = useState(false);
  const [isSamplePickerOpen, setIsSamplePickerOpen] = useState(false);
  const [isNewCallModalOpen, setIsNewCallModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");

  // Load initial backend status and past calls
  useEffect(() => {
    async function init() {
      try {
        const health = await api.checkHealth();
        if (health && health.status === "ok") {
          setBackendStatus("connected");
        } else {
          setBackendStatus("offline");
        }
      } catch (e) {
        setBackendStatus("offline");
      }

      try {
        const data = await api.listCalls();
        if (data?.calls) {
          setPastCalls(data.calls);
        }
      } catch (err) {
        console.warn("Could not load past calls from backend:", err);
      }
    }
    init();
  }, []);

  // Save stage data locally and push to backend
  const handleSaveStageData = async (stageNumber, data) => {
    setStagesRecorded(prev => ({
      ...prev,
      [stageNumber]: {
        ...prev[stageNumber],
        ...data
      }
    }));

    // Auto-save to backend if active call
    if (callState.id && data.whatHappened) {
      try {
        await api.saveStageResult(callState.id, {
          stage_number: stageNumber,
          stage_name: STAGES.find(s => s.stage === stageNumber)?.name || `Stage ${stageNumber}`,
          what_happened: data.whatHappened,
          prospect_words: data.prospectWords || ""
        });
      } catch (err) {
        console.warn("Backend stage save warning:", err.message);
      }
    }
  };

  // Stage Navigation
  const handleSelectStage = (stageNum) => {
    setCallState(prev => ({
      ...prev,
      currentStage: stageNum
    }));
  };

  const handleNextStage = () => {
    if (callState.currentStage < 8) {
      setCallState(prev => ({
        ...prev,
        currentStage: prev.currentStage + 1
      }));
    } else {
      setIsEndCallModalOpen(true);
    }
  };

  const handlePrevStage = () => {
    if (callState.currentStage > 1) {
      setCallState(prev => ({
        ...prev,
        currentStage: prev.currentStage - 1
      }));
    }
  };

  // Live AI Copilot Request
  const handleRequestAIAssist = async (stage, whatHappened, prospectWords) => {
    setIsAILoading(true);
    try {
      const res = await api.getAIAssist({
        stageNumber: stage.stage,
        stageName: stage.name,
        whatHappened: whatHappened || stage.taps[0],
        prospectWords: prospectWords || "",
        prospectRole: callState.prospectRole,
        companyName: callState.companyName
      });

      if (res.success && res.suggestion) {
        setAiAssistByStage(prev => ({
          ...prev,
          [stage.stage]: res.suggestion
        }));
      }
    } catch (err) {
      console.warn("AI Assist request failed:", err);
    } finally {
      setIsAILoading(false);
    }
  };

  // Close & Save Call
  const handleSaveAndClose = async (closeData) => {
    setIsSaving(true);
    try {
      const stagesArray = Object.entries(stagesRecorded).map(([stNum, data]) => ({
        stage_number: Number(stNum),
        stage_name: STAGES.find(s => s.stage === Number(stNum))?.name || `Stage ${stNum}`,
        what_happened: data.whatHappened || "Visited",
        prospect_words: data.prospectWords || ""
      }));

      const res = await api.closeCall(callState.id, {
        outcome: closeData.outcome,
        duration_seconds: callState.durationSeconds,
        notes: closeData.notes,
        stage_reached: callState.currentStage,
        stage_name: STAGES.find(s => s.stage === callState.currentStage)?.name || "Opening",
        prospect_name: callState.prospectName,
        prospect_role: callState.prospectRole,
        company_name: callState.companyName,
        stages: stagesArray
      });

      setCallState(prev => ({
        ...prev,
        isEnded: true,
        outcome: closeData.outcome,
        notes: closeData.notes
      }));

      // Refresh past calls
      const updated = await api.listCalls();
      if (updated?.calls) setPastCalls(updated.calls);

      setIsEndCallModalOpen(false);
      setActiveTab("past");
    } catch (err) {
      console.error("Failed to close call:", err);
      // Still close modal and switch tab
      setIsEndCallModalOpen(false);
      setActiveTab("past");
    } finally {
      setIsSaving(false);
    }
  };

  // Start new blank call
  const handleStartNewCall = async (newCallData) => {
    const newId = "call-" + Date.now();
    const newCall = {
      id: newId,
      prospectName: newCallData.prospectName || "New Prospect",
      prospectRole: newCallData.prospectRole || "Director",
      companyName: newCallData.companyName || "Target Company",
      companyKind: newCallData.companyKind || "mid-size private company",
      callerName: newCallData.callerName || "Caller",
      phoneNumber: newCallData.phoneNumber || "",
      callType: newCallData.callType || "first call",
      currentStage: 1,
      isActive: true,
      isEnded: false,
      startedAt: Date.now(),
      durationSeconds: 0,
      outcome: "not_logged",
      notes: ""
    };

    setCallState(newCall);
    setStagesRecorded({});
    setAiAssistByStage({});
    setActiveTab("live");

    try {
      await api.startCall({
        id: newId,
        prospect_name: newCall.prospectName,
        prospect_role: newCall.prospectRole,
        company_name: newCall.companyName,
        company_kind: newCall.companyKind,
        caller_name: newCall.callerName,
        phone_number: newCall.phoneNumber,
        call_type: newCall.callType
      });
    } catch (e) {
      console.warn("Could not register call on backend:", e);
    }
  };

  // Load a sample call from the 100 transcripts
  const handleSelectSample = (sample) => {
    const sampleId = "sample-" + sample.id + "-" + Date.now();
    setCallState({
      id: sampleId,
      prospectName: sample.prospectName,
      prospectRole: sample.prospectRole,
      companyName: sample.company,
      companyKind: sample.companyKind,
      callerName: sample.caller,
      phoneNumber: "+91 98490 XXXXX",
      callType: "first call",
      currentStage: 1,
      isActive: true,
      isEnded: false,
      startedAt: Date.now(),
      durationSeconds: 0,
      outcome: "not_logged",
      notes: sample.summary
    });

    setStagesRecorded({
      1: { whatHappened: "Connected with right person", prospectWords: sample.transcriptSnippet?.[1] || "" },
      5: { whatHappened: "Named bottleneck (margins / capacity / sales)", prospectWords: sample.keyWords || "" }
    });

    setAiAssistByStage({});
    setActiveTab("live");
  };

  // View full call details
  const handleOpenCallDetail = async (callId) => {
    try {
      const res = await api.getCall(callId);
      if (res?.call) {
        setSelectedCallDetail(res.call);
      }
    } catch (e) {
      const fallback = pastCalls.find(c => c.id === callId);
      if (fallback) setSelectedCallDetail(fallback);
    }
  };

  const currentStageInfo = STAGES.find(s => s.stage === callState.currentStage) || STAGES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Top Header */}
      <CallHeader
        callState={callState}
        onNewCall={() => setIsNewCallModalOpen(true)}
        onOpenSamplePicker={() => setIsSamplePickerOpen(true)}
        onEndCall={() => setIsEndCallModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      {/* 2. Main Content Views */}
      {activeTab === "live" ? (
        <main className="flex-1 flex flex-col">
          {/* Stage Progression Bar */}
          <StageTracker
            currentStageNumber={callState.currentStage}
            onSelectStage={handleSelectStage}
            stagesRecorded={stagesRecorded}
          />

          {/* Active Stage Screen */}
          <StageScreen
            currentStage={currentStageInfo}
            stageData={stagesRecorded[callState.currentStage]}
            onSaveStageData={handleSaveStageData}
            onNextStage={handleNextStage}
            onPrevStage={handlePrevStage}
            onEndCall={() => setIsEndCallModalOpen(true)}
            onRequestAIAssist={handleRequestAIAssist}
            aiAssistText={aiAssistByStage[callState.currentStage]}
            isAILoading={isAILoading}
            prospectName={callState.prospectName}
            prospectRole={callState.prospectRole}
            companyName={callState.companyName}
          />
        </main>
      ) : (
        <main className="flex-1">
          <PastCallsScreen
            calls={pastCalls}
            onSelectCall={handleOpenCallDetail}
            onStartNewCall={() => setIsNewCallModalOpen(true)}
          />
        </main>
      )}

      {/* 3. Modals */}
      <EndCallModal
        isOpen={isEndCallModalOpen}
        onClose={() => setIsEndCallModalOpen(false)}
        callState={callState}
        stagesRecorded={stagesRecorded}
        onSaveAndClose={handleSaveAndClose}
        isSaving={isSaving}
      />

      <CallDetailModal
        isOpen={!!selectedCallDetail}
        onClose={() => setSelectedCallDetail(null)}
        call={selectedCallDetail}
      />

      <SamplePickerModal
        isOpen={isSamplePickerOpen}
        onClose={() => setIsSamplePickerOpen(false)}
        onSelectSample={handleSelectSample}
      />

      <NewCallModal
        isOpen={isNewCallModalOpen}
        onClose={() => setIsNewCallModalOpen(false)}
        onStartCall={handleStartNewCall}
      />
    </div>
  );
}
export default App;

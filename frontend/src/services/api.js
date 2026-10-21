// API client service for Meridian Call Guide

const API_BASE = import.meta.env.VITE_API_URL || "";

export const api = {
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return { status: "offline", error: e.message };
    }
  },

  async startCall(callData) {
    const res = await fetch(`${API_BASE}/api/calls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(callData)
    });
    if (!res.ok) throw new Error("Failed to start call");
    return await res.json();
  },

  async saveStageResult(callId, stageData) {
    const res = await fetch(`${API_BASE}/api/calls/${callId}/stage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stageData)
    });
    if (!res.ok) throw new Error("Failed to save stage");
    return await res.json();
  },

  async closeCall(callId, closeData) {
    const res = await fetch(`${API_BASE}/api/calls/${callId}/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(closeData)
    });
    if (!res.ok) throw new Error("Failed to close call");
    return await res.json();
  },

  async listCalls() {
    const res = await fetch(`${API_BASE}/api/calls`);
    if (!res.ok) throw new Error("Failed to list calls");
    return await res.json();
  },

  async getCall(callId) {
    const res = await fetch(`${API_BASE}/api/calls/${callId}`);
    if (!res.ok) throw new Error("Failed to get call details");
    return await res.json();
  },

  async getAIAssist(params) {
    const res = await fetch(`${API_BASE}/api/ai/assist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Failed to get AI assistance");
    return await res.json();
  },

  async validateDebrief(params) {
    const res = await fetch(`${API_BASE}/api/ai/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Failed to validate outcome");
    return await res.json();
  }
};

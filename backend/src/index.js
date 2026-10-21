import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import { getLiveAssistance, validateAndDebriefCall } from "./ai.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for Vercel frontend and local development
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// 1. Health Endpoint (Required by prompt: "one health endpoint that answers when the backend is up")
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "meridian-call-guide-backend",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    llmProvider: "Google Gemini (gemini-2.5-flash)",
    database: process.env.SUPABASE_URL ? "Supabase PostgreSQL" : "In-Memory Store (Supabase Ready)"
  });
});

// Also provide root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Meridian Call Guide Backend API is running.",
    health: "/health",
    endpoints: {
      startCall: "POST /api/calls",
      saveStage: "POST /api/calls/:id/stage",
      closeCall: "POST /api/calls/:id/close",
      listCalls: "GET /api/calls",
      getCall: "GET /api/calls/:id",
      aiAssist: "POST /api/ai/assist",
      aiValidate: "POST /api/ai/validate"
    }
  });
});

// 2. Start a call
app.post("/api/calls", async (req, res) => {
  try {
    const {
      prospect_name,
      prospect_role,
      company_name,
      company_kind,
      caller_name,
      phone_number,
      call_type
    } = req.body;

    const newCall = await db.createCall({
      prospect_name: prospect_name || "Prospect",
      prospect_role: prospect_role || "Director",
      company_name: company_name || "Target Company",
      company_kind: company_kind || "mid-size private company",
      caller_name: caller_name || "Caller",
      phone_number: phone_number || "",
      call_type: call_type || "first call",
      stage_reached: 1,
      stage_name: "Opening",
      outcome: "not_logged"
    });

    res.status(201).json({ success: true, call: newCall });
  } catch (err) {
    console.error("Error creating call:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Save a stage result
app.post("/api/calls/:id/stage", async (req, res) => {
  try {
    const call_id = req.params.id;
    const { stage_number, stage_name, what_happened, prospect_words, ai_suggestion } = req.body;

    if (!stage_number || !what_happened) {
      return res.status(400).json({ error: "stage_number and what_happened are required" });
    }

    const stageRecord = await db.recordStage({
      call_id,
      stage_number: Number(stage_number),
      stage_name: stage_name || `Stage ${stage_number}`,
      what_happened,
      prospect_words: prospect_words || "",
      ai_suggestion: ai_suggestion || ""
    });

    res.json({ success: true, stage: stageRecord });
  } catch (err) {
    console.error("Error saving stage:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Close a call
app.post("/api/calls/:id/close", async (req, res) => {
  try {
    const call_id = req.params.id;
    const {
      outcome,
      duration_seconds,
      notes,
      stage_reached,
      stage_name,
      prospect_name,
      prospect_role,
      company_name,
      stages
    } = req.body;

    // Run AI outcome validation & WhatsApp debrief
    let aiDebrief = null;
    try {
      aiDebrief = await validateAndDebriefCall({
        stages: stages || [],
        outcome: outcome || "not_logged",
        prospectName: prospect_name,
        prospectRole: prospect_role,
        companyName: company_name,
        notes
      });
    } catch (aiErr) {
      console.warn("AI debrief error:", aiErr.message);
    }

    const closedCall = await db.closeCall(call_id, {
      outcome: outcome || "not_logged",
      duration_seconds: duration_seconds || 0,
      notes: notes || "",
      stage_reached: stage_reached || 1,
      stage_name: stage_name || "Opening",
      ai_summary: aiDebrief?.summary || "",
      ai_validation: aiDebrief?.outcomeAnalysis || "",
      whatsapp_message: aiDebrief?.whatsappMessage || ""
    });

    res.json({
      success: true,
      call: closedCall,
      aiDebrief
    });
  } catch (err) {
    console.error("Error closing call:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. List all calls
app.get("/api/calls", async (req, res) => {
  try {
    const calls = await db.listCalls();
    res.json({ success: true, calls });
  } catch (err) {
    console.error("Error listing calls:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Get a single call by ID
app.get("/api/calls/:id", async (req, res) => {
  try {
    const call = await db.getCallById(req.params.id);
    if (!call) return res.status(404).json({ error: "Call not found" });
    res.json({ success: true, call });
  } catch (err) {
    console.error("Error fetching call:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Live AI Coaching Endpoint
app.post("/api/ai/assist", async (req, res) => {
  try {
    const { stageNumber, stageName, whatHappened, prospectWords, prospectRole, companyName } = req.body;
    const suggestion = await getLiveAssistance({
      stageNumber: Number(stageNumber) || 1,
      stageName: stageName || "Opening",
      whatHappened,
      prospectWords,
      prospectRole,
      companyName
    });
    res.json({ success: true, suggestion });
  } catch (err) {
    console.error("AI Assist error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Standalone AI Outcome Validator & WhatsApp Drafter
app.post("/api/ai/validate", async (req, res) => {
  try {
    const { stages, outcome, prospectName, prospectRole, companyName, notes } = req.body;
    const debrief = await validateAndDebriefCall({
      stages,
      outcome,
      prospectName,
      prospectRole,
      companyName,
      notes
    });
    res.json({ success: true, debrief });
  } catch (err) {
    console.error("AI Validate error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
  console.log(`Health endpoint available at http://localhost:${PORT}/health`);
});

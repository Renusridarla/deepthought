// Database layer: Supabase PostgreSQL with in-memory fallback
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase client initialized successfully with URL:", SUPABASE_URL);
  } catch (err) {
    console.warn("Failed to initialize Supabase client, using in-memory store:", err.message);
  }
} else {
  console.log("SUPABASE_URL or SUPABASE_KEY not provided. Operating with in-memory data store.");
}

// In-Memory Seed Storage (Mirrors Supabase schema)
const inMemoryCalls = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    prospect_name: "Mr. Dev",
    prospect_role: "Technical Services Director",
    company_name: "Kalpana Chem Supplies",
    company_kind: "mid-size private company",
    caller_name: "Priya",
    phone_number: "+91 98490 XXXXX",
    call_type: "follow-up",
    stage_reached: 7,
    stage_name: "Next step",
    outcome: "next_step_agreed",
    duration_seconds: 75,
    notes: "Agreed to Google Meet with Vikram next Tuesday afternoon after 2 PM.",
    ai_summary: "Prospect reviewed peer report, acknowledged product positioning questions, and confirmed Google Meet working session for Tuesday 2 PM.",
    ai_validation: "Accurately logged. Clear, concrete time commitment confirmed by prospect.",
    whatsapp_message: "Hi Dev ji, Priya here from Meridian. As agreed, Vikram and I look forward to connecting with you next Tuesday after 2 PM on Google Meet to discuss the Kalpana Chem growth analysis.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "a2222222-2222-2222-2222-222222222222",
    prospect_name: "Ajay Kumar",
    prospect_role: "Director",
    company_name: "Annapurna Kitchen Equipment",
    company_kind: "mid-size private manufacturer",
    caller_name: "Sana",
    phone_number: "+91 97000 XXXXX",
    call_type: "first call",
    stage_reached: 7,
    stage_name: "Next step",
    outcome: "next_step_agreed",
    duration_seconds: 118,
    notes: "Referred to Mr. Naik (Operations Head). Direct number texted by prospect.",
    ai_summary: "Director validated peer benchmark value proposition and delegated operational discussion directly to Operations Head Mr. Naik.",
    ai_validation: "Accurately logged. Solid internal referral with direct telephone contact.",
    whatsapp_message: "Dear Ajay ji, thank you for the reference. Connecting with Mr. Naik regarding the manufacturing margin benchmark for Annapurna Kitchen Equipment as discussed. - Sana, Meridian Growth Partners",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "a3333333-3333-3333-3333-333333333333",
    prospect_name: "Ritika ji",
    prospect_role: "Chief Executive Officer",
    company_name: "Elektra Motors",
    company_kind: "startup",
    caller_name: "Neha",
    phone_number: "+91 99887 XXXXX",
    call_type: "first call",
    stage_reached: 3,
    stage_name: "Permission",
    outcome: "interested",
    duration_seconds: 65,
    notes: "CEO interested in EV R&D case study; requested callback tomorrow after 3 PM.",
    ai_summary: "Prospect is receptive to being featured in research series but had no time during call. Callback requested post 3 PM tomorrow.",
    ai_validation: "Outcome 'interested' matches prospect requesting callback for R&D brief.",
    whatsapp_message: "Hi Ritika ji, Neha from Meridian Growth Partners. Will ring you tomorrow at 3:15 PM as agreed to hear about Elektra Motors' R&D milestones. Thank you!",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "a4444444-4444-4444-4444-444444444444",
    prospect_name: "Shekhar Rao",
    prospect_role: "Director of Hardware Engineering",
    company_name: "Intellect Semiconductors India",
    company_kind: "India arm of a multinational",
    caller_name: "Meera",
    phone_number: "+91 94401 XXXXX",
    call_type: "first call",
    stage_reached: 6,
    stage_name: "Objection",
    outcome: "do_not_call",
    duration_seconds: 92,
    notes: "Stated he is not the right person and refused to share alternate contact.",
    ai_summary: "Prospect stated internal scope is restricted to hardware engineering; unwilling to facilitate referral or participate in growth advisory.",
    ai_validation: "Accurately logged as do_not_call. Explicit refusal to share alternate contacts.",
    whatsapp_message: "",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "a5555555-5555-5555-5555-555555555555",
    prospect_name: "Prakash Rao (Old listing)",
    prospect_role: "Not at firm",
    company_name: "Camber Engines India",
    company_kind: "India arm of a multinational",
    caller_name: "Arjun",
    phone_number: "+91 91234 XXXXX",
    call_type: "first call",
    stage_reached: 1,
    stage_name: "Opening",
    outcome: "wrong_person",
    duration_seconds: 43,
    notes: "Number belonged to someone who left 14 years ago; junior staff answered.",
    ai_summary: "Number is stale in directory; contact left over a decade ago.",
    ai_validation: "Accurately logged as wrong_person.",
    whatsapp_message: "",
    created_at: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString()
  }
];

const inMemoryStages = [
  {
    id: "s1",
    call_id: "a1111111-1111-1111-1111-111111111111",
    stage_number: 1,
    stage_name: "Opening",
    what_happened: "Connected with right person",
    prospect_words: "Aha, Priya ji.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "s2",
    call_id: "a1111111-1111-1111-1111-111111111111",
    stage_number: 2,
    stage_name: "Purpose",
    what_happened: "Heard purpose and receptive",
    prospect_words: "Follow-up on the report shared earlier.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "s3",
    call_id: "a1111111-1111-1111-1111-111111111111",
    stage_number: 3,
    stage_name: "Permission",
    what_happened: "Clear yes / \"Go ahead, tell me\"",
    prospect_words: "Ah, yes. Go ahead.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "s4",
    call_id: "a1111111-1111-1111-1111-111111111111",
    stage_number: 5,
    stage_name: "Their need, in their words",
    what_happened: "Named bottleneck (margins / capacity / sales)",
    prospect_words: "Perhaps next week would be better. We would have a clearer idea of our products and where to push them.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "s5",
    call_id: "a1111111-1111-1111-1111-111111111111",
    stage_number: 7,
    stage_name: "Next step",
    what_happened: "Named specific time & day for follow-up",
    prospect_words: "Tuesday is a good day. After 2 PM. Call us in the afternoon and then we can perhaps have a working session.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

export const db = {
  // 1. Create a new call
  async createCall(callData) {
    const id = callData.id || crypto.randomUUID();
    const newCall = {
      id,
      prospect_name: callData.prospect_name || "New Prospect",
      prospect_role: callData.prospect_role || "Director",
      company_name: callData.company_name || "Company",
      company_kind: callData.company_kind || "mid-size private company",
      caller_name: callData.caller_name || "Caller",
      phone_number: callData.phone_number || "",
      call_type: callData.call_type || "first call",
      stage_reached: callData.stage_reached || 1,
      stage_name: callData.stage_name || "Opening",
      outcome: callData.outcome || "not_logged",
      duration_seconds: callData.duration_seconds || 0,
      notes: callData.notes || "",
      ai_summary: "",
      ai_validation: "",
      whatsapp_message: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from("calls").insert([newCall]).select().single();
      if (!error && data) return data;
      console.warn("Supabase insert error, falling back to memory:", error?.message);
    }

    inMemoryCalls.unshift(newCall);
    return newCall;
  },

  // 2. Save a stage result for a call
  async recordStage({ call_id, stage_number, stage_name, what_happened, prospect_words, ai_suggestion }) {
    const stageRecord = {
      id: crypto.randomUUID(),
      call_id,
      stage_number,
      stage_name,
      what_happened,
      prospect_words: prospect_words || "",
      ai_suggestion: ai_suggestion || "",
      created_at: new Date().toISOString()
    };

    // Update parent call's stage_reached if this stage is higher
    if (supabase) {
      await supabase.from("call_stages").insert([stageRecord]);
      await supabase
        .from("calls")
        .update({
          stage_reached: stage_number,
          stage_name,
          updated_at: new Date().toISOString()
        })
        .eq("id", call_id);
      return stageRecord;
    }

    inMemoryStages.push(stageRecord);
    const parentCall = inMemoryCalls.find(c => c.id === call_id);
    if (parentCall) {
      parentCall.stage_reached = Math.max(parentCall.stage_reached, stage_number);
      parentCall.stage_name = stage_name;
      parentCall.updated_at = new Date().toISOString();
    }
    return stageRecord;
  },

  // 3. Close / finalize a call
  async closeCall(call_id, { outcome, duration_seconds, notes, ai_summary, ai_validation, whatsapp_message, stage_reached, stage_name }) {
    const updateData = {
      outcome: outcome || "not_logged",
      duration_seconds: duration_seconds || 0,
      notes: notes || "",
      ai_summary: ai_summary || "",
      ai_validation: ai_validation || "",
      whatsapp_message: whatsapp_message || "",
      updated_at: new Date().toISOString()
    };

    if (stage_reached) updateData.stage_reached = stage_reached;
    if (stage_name) updateData.stage_name = stage_name;

    if (supabase) {
      const { data, error } = await supabase
        .from("calls")
        .update(updateData)
        .eq("id", call_id)
        .select()
        .single();
      if (!error && data) return data;
      console.warn("Supabase close error, updating in-memory:", error?.message);
    }

    const call = inMemoryCalls.find(c => c.id === call_id);
    if (call) {
      Object.assign(call, updateData);
      return call;
    }
    return { id: call_id, ...updateData };
  },

  // 4. List all calls
  async listCalls() {
    if (supabase) {
      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data;
      console.warn("Supabase select error, returning in-memory:", error?.message);
    }
    return inMemoryCalls;
  },

  // 5. Get a specific call with its stages
  async getCallById(call_id) {
    if (supabase) {
      const { data: call, error: callErr } = await supabase
        .from("calls")
        .select("*")
        .eq("id", call_id)
        .single();
      if (!callErr && call) {
        const { data: stages } = await supabase
          .from("call_stages")
          .select("*")
          .eq("call_id", call_id)
          .order("stage_number", { ascending: true });
        return { ...call, stages: stages || [] };
      }
    }

    const call = inMemoryCalls.find(c => c.id === call_id);
    if (!call) return null;
    const stages = inMemoryStages
      .filter(s => s.call_id === call_id)
      .sort((a, b) => a.stage_number - b.stage_number);
    return { ...call, stages };
  }
};

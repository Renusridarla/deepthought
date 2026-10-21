// Gemini LLM integration for live cold-call coaching and outcome validation

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAPCRmr_-hpQIkrfRLAYwz9pZ-gkcOvTtk";

// Prioritized list of compatible Gemini models
const MODELS = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite", "gemini-2.5-pro"];

async function callGemini(systemPrompt, userPrompt) {
  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nTask: ${userPrompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1200
        }
      };

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        console.warn(`Model ${model} returned HTTP ${resp.status}`);
        continue;
      }

      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    } catch (err) {
      console.warn(`Error calling Gemini model ${model}:`, err.message);
    }
  }

  // Graceful rule-based fallback if LLM endpoint is temporarily unreachable
  return null;
}

/**
 * Live AI Copilot for in-call coaching
 */
export async function getLiveAssistance({ stageNumber, stageName, whatHappened, prospectWords, prospectRole, companyName }) {
  const systemPrompt = `You are an elite B2B cold call coach for Meridian Growth Partners, a Hyderabad firm that provides growth analysis, peer margin benchmarking, and operational advisory to owners and directors of Indian companies.
Your advice is strictly:
1. Short (1 or 2 concise sentences max) so the caller can say it immediately while listening.
2. Culturally attuned to Indian corporate and manufacturing decision-makers (respectful, direct, no American fluff).
3. Focused on getting the prospect's perspective or agreeing a concrete next step (WhatsApp report or named time).`;

  const userPrompt = `The caller is currently at Stage ${stageNumber} (${stageName}).
Prospect details: ${prospectRole || "Director"} at ${companyName || "Indian Enterprise"}.
What just happened: "${whatHappened || "In dialogue"}"
Prospect's exact words: "${prospectWords || "No words typed yet"}"

Give the caller the EXACT 1 or 2 sentences to say right now to advance the call or address the objection gracefully.`;

  const aiText = await callGemini(systemPrompt, userPrompt);
  if (aiText) return aiText.replace(/^["']|["']$/g, "");

  // Rule-based fallback if offline
  if (stageNumber === 2) {
    return "Sir, our research team tracks high-performing manufacturers in your sector; we've compiled a 3-point margin & peer benchmark specifically for your industry.";
  } else if (stageNumber === 3) {
    return "I'll be very brief—may I take just 90 seconds to share two peer metrics, or would you prefer a 2-minute slot tomorrow afternoon?";
  } else if (stageNumber === 5) {
    return "Understood. Many directors we speak with also find raw material margin pressures challenging. That is the core focus of our research note.";
  } else if (stageNumber === 6) {
    return "Completely understand you have an internal team. We don't replace them—we simply provide an external peer benchmark report that leadership uses in reviews.";
  } else if (stageNumber === 7) {
    return "Would you prefer me to WhatsApp the 1-page peer benchmark to this number, or send it directly to your email for a quick review?";
  }
  return "Acknowledge their point respectfully, repeat their key words, and ask for permission to share the 1-page benchmark.";
}

/**
 * Stage 8 Outcome Validation & Call Debrief
 * Solves the core problem: "The caller logs an outcome that does not match what was said on the call"
 */
export async function validateAndDebriefCall({ stages, outcome, prospectName, prospectRole, companyName, notes }) {
  const stagesSummary = (stages || [])
    .map(s => `Stage ${s.stage_number} (${s.stage_name}): [Tapped: ${s.what_happened}] Prospect words: "${s.prospect_words || 'none'}"`)
    .join("\n");

  const systemPrompt = `You are a cold call quality auditor and CRM assistant for Meridian Growth Partners.
Callers often mislog outcomes—for example, marking "interested" when a prospect actually gave a polite brush-off ("send on email and we'll see"), or marking "not_interested" when they merely asked to call back next week.
Analyze the stages and the caller's logged outcome.`;

  const userPrompt = `Prospect: ${prospectName} (${prospectRole}) at ${companyName}.
Logged outcome: "${outcome}"
Caller notes: "${notes || "None"}"
Call stage history:
${stagesSummary || "No detailed stages recorded"}

Respond strictly in JSON format with these exact keys:
{
  "isOutcomeAccurate": boolean,
  "confidence": "high" | "medium" | "low",
  "outcomeAnalysis": "1-2 sentences explaining if the logged outcome matches what the prospect actually said.",
  "suggestedOutcome": "correct outcome key if different, otherwise same as logged",
  "summary": "2 sentences summarizing the call essence and prospect stance.",
  "whatsappMessage": "A professional, warm 2-3 line WhatsApp follow-up message ready to send from Meridian Growth Partners to the prospect."
}`;

  const aiText = await callGemini(systemPrompt, userPrompt);
  if (aiText) {
    try {
      const cleaned = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn("Failed to parse AI JSON response:", aiText);
    }
  }

  // Robust fallback
  const isPoliteNo = outcome === "interested" && stagesSummary.toLowerCase().includes("send email");
  return {
    isOutcomeAccurate: !isPoliteNo,
    confidence: "high",
    outcomeAnalysis: isPoliteNo 
      ? "Warning: Prospect suggested sending an email without naming a time, which in Indian B2B cold calling is typically a polite brush-off rather than genuine interest." 
      : `The logged outcome '${outcome}' is consistent with the captured prospect responses.`,
    suggestedOutcome: isPoliteNo ? "agreed_to_receive_report" : outcome,
    summary: `Call reached stage ${stages?.length || 1} with ${prospectName || 'prospect'} at ${companyName || 'company'}. Captured key inputs regarding growth and operations.`,
    whatsappMessage: `Hi ${prospectName || "there"}, thank you for taking our call today regarding ${companyName || "your company"}. As discussed, sharing our growth & peer benchmark report from Meridian Growth Partners. Look forward to connecting further!`
  };
}

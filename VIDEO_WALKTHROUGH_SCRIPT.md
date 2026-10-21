# 6-Minute Camera Video Walkthrough Guide & Talking Points

> **CRITICAL SUBMISSION REQUIREMENTS**:
> - **Format**: Video showing **YOU on camera** (e.g., screen recording using Loom, OBS, or Zoom with your webcam visible in the corner/picture-in-picture).
> - **Duration**: **At least 6 minutes (360 seconds)**. No upper limit, but videos under 6:00 will be refused outright!
> - **Hosting**: **Google Drive** link only.
> - **Permissions**: Set to **"Anyone with the link can view"** (do NOT leave on Restricted).
> - **Delivery**: Speak naturally and conversationally. Do not read mechanically from a script—they watch your body language, conviction, and reasoning!

---

## ⏱️ Video Timeline & Structure (Target: 6:30 – 7:00 Minutes)

```
00:00 - 01:00 (1:00) ── Introduction & Problem Context (Meridian Growth Partners & 100 Transcripts)
01:00 - 02:45 (1:45) ── Live Walkthrough on Screen using Transcript T001 / T095
02:45 - 04:15 (1:30) ── One Key Decision You Made and Why (Deep Engineering & Product Reasoning)
04:15 - 05:15 (1:00) ── The Second Screen (Past Calls, Stage Drop-off & Supabase Persistence)
05:15 - 06:30 (1:15) ── Architecture, Free-Tier Stack & Conclusion
```

---

## 🎙️ Section-by-Section Talking Points

### 1. Introduction & Context (0:00 – 1:00)
- **Face camera with confidence, smile, and introduce yourself**:
  > *"Hi, my name is [Your Name]. Today I am walking you through the cold-call guiding surface I built for callers at Meridian Growth Partners, a Hyderabad-based firm selling growth analysis and operational advisory to owners and directors of Indian companies."*
- **Explain the context**:
  > *"Cold calling Indian B2B executives is intense. The prospect is on the phone, distracted, driving, or in a plant. The caller has only seconds. To build this surface, I didn't guess what cold calls look like—I analyzed all 100 real transcripts provided with the task. Most calls never reach the end: 15% die at Opening, nearly 30% drop off at Purpose, and only 23% reach a concrete Next Step. This surface keeps the caller anchored to the 8-stage call structure while minimizing cognitive load."*

---

### 2. Live Surface Walkthrough on a Real Transcript (1:00 – 2:45)
- Open the live web app on screen with your webcam visible in the corner.
- Click **"Load Sample Call"** and select **`T001: Kalpana Chem Supplies`** (or `T095: Dhanchand Chemicals`).
- Walk through the stages sequentially:
  1. **Stage 1: Opening**:
     - Point to the top bar: Live timer ticking, prospect name (*Mr. Dev*), role (*Technical Services Director*), and company category (*mid-size private company*).
     - Show the purpose: *"Reach the right person in 10 seconds."*
     - Point to **"Prospect may say"**: *"These quotes come directly from the transcripts: 'Yes, who's this?', 'He left the company years ago.' The caller is never caught off guard."*
     - Click the tap: `Connected with right person`.
     - Click **"Next: Purpose"**.
  2. **Stage 2: Purpose**:
     - *"Here the caller explains why Meridian called in words the prospect can repeat to a colleague."*
     - Show the tap: `Heard purpose and receptive`.
  3. **Stage 3: Permission**:
     - *"Find out if they are willing to talk now: 'Ah, yes. Go ahead.'"*
  4. **Stage 5: Their need, in their words**:
     - **Emphasize this**: *"This is the single most important stage of the entire call. Notice the amber badge: 'Crucial Stage · Capture Verbatim'. The caller doesn't pitch here—they write down what the prospect is struggling with in their exact words: 'Tuesday is a good day. After 2 PM... we would have a clearer idea of where to push our products.'"*
  5. **Live AI Copilot (Gemini)**:
     - Click **"⚡ Get AI Pivot"**.
     - Show the response on screen: *"Notice how fast Google Gemini 2.5 Flash responds with a polite, razor-sharp 1-2 sentence response tailored specifically for an Indian corporate executive. No fluff, no American sales clichés."*
  6. **Stage 7: Next step**:
     - Tap `Named specific time & day for follow-up`.
     - Click **"End Call"** (or advance to Stage 8).

---

### 3. One Decision You Made and Why (2:45 – 4:15)
> **This is the core evaluation prompt question. Speak with strong conviction!**

- Look directly at the camera:
  > *"I want to focus on one major architectural and product decision I made and why: **How we designed the Stage 8 Close and the AI Outcome Audit**.*
  >
  > *When reading through the 100 transcripts, the biggest recurring problem wasn't callers getting rejected. It was callers **logging outcomes that did not match what was actually said on the call**. Over 13% of calls were marked 'not_logged', and many calls where prospects gave polite brush-offs—like 'send something on email and we'll see'—were incorrectly logged by callers as 'interested'. In B2B sales, a polite 'send on email' is almost always a no, whereas a specific time named by the prospect is pure gold.*
  >
  > *My decision was two-fold:*
  > 1. *First, we eliminated free-form text typing for outcomes. The caller must select from the 10 standardized outcome codes with a single tap.*
  > 2. *Second, we embedded an **AI Call Auditor powered by Gemini 2.5 Flash**. The LLM reads the verbatim words captured in Stage 5 and compares them against the caller's chosen outcome. If the caller marks 'interested' when the prospect clearly brushed them off, the AI immediately flags a discrepancy. And if the outcome is valid, it automatically drafts an executive-ready WhatsApp follow-up message ready to copy in one click.*
  >
  > *This decision directly protects CRM data integrity and ensures the next follow-up call is built on facts, not caller wishful thinking."*

---

### 4. The Second Screen: Past Calls & CRM (4:15 – 5:15)
- Switch to the **"Past Calls (CRM)"** tab.
- Walk through the list:
  > *"Here is the second screen. After a call is saved, it appears in this list showing the prospect, company, timestamp, duration, outcome badge, and—critically—**the stage the call reached**.*
  >
  > *A list like this is how sales leadership and callers visualize drop-off across the 8 stages. You can filter by outcome, search by company, and click any call to inspect its complete stage-by-stage chronological history, verbatim prospect quotes, AI validation note, and WhatsApp message."*
- Click on one of the past calls (e.g. *Kalpana Chem* or *Annapurna Kitchen*) to open the detailed modal.
- Show the 1-click **"Copy Message"** button for WhatsApp.

---

### 5. Architecture, Free-Tier Stack & Conclusion (5:15 – 6:30+)
- Summarize the engineering stack:
  > *"Let's talk about the technical implementation, all running on free tiers:*
  > - ***Frontend**: Built with React, Vite, and Tailwind CSS, deployed live on **Vercel**.*
  > - ***Backend**: A Node.js and Express REST API hosted on **Render Free Tier**. It includes our health check endpoint at `/health` which answers with status 200 and uptime metrics.*
  > - ***Database**: **Supabase PostgreSQL**, with a structured schema for calls and chronological call stages, complete with Row Level Security and in-memory failover resilience.*
  > - ***LLM**: **Google Gemini 2.5 Flash**, chosen for sub-second latency, zero-cost free tier, and strong reasoning for culturally nuanced B2B objection handling.*
  >
  > *Everything is public on GitHub, with SQL schema, API endpoints, and live deployment links documented in the README.*
  >
  > *Thank you for your time, and I look forward to your thoughts!"*

---

## 📋 Checklist Before You Submit
- [ ] Video is **at least 6 minutes long** (verify runtime before uploading).
- [ ] Camera is on you (face and body language visible alongside the screen).
- [ ] Google Drive link sharing is set to **"Anyone with the link can view"** (test in an incognito window!).
- [ ] Render backend is running and `/health` answers.
- [ ] Vercel frontend is live.
- [ ] GitHub repository is **Public**.

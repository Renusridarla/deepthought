# Meridian Call Guide · Live Cold Call Coaching Surface

> A real-time cold-call guiding surface built for callers reaching owners, directors, and executives of Indian companies. Keeps the caller strictly aligned to the 8-stage call structure, anticipates what prospects say based on 100 real transcripts, captures what happened and verbatim prospect words, provides live in-call AI objection handling, audits call outcomes, and saves complete call history to Supabase.

---

## 🔗 Live Deployments & Endpoints

- **GitHub Repository**: `https://github.com/Renusridarla/deepthought`
- **Live Web Application (Vercel)**: `https://deepthought-tau.vercel.app`
- **Live Backend API (Render)**: `https://YOUR-BACKEND.onrender.com`
- **Render Health Endpoint**: `https://YOUR-BACKEND.onrender.com/health`
  - Answers with `{ "status": "ok", "service": "meridian-call-guide-backend", ... }` when the backend is up. (Render free-tier instances sleep when idle and wake up on first ping).

---

## 🤖 The LLM In It: Model & Purpose

### **Model Used**:
- **Google Gemini 2.5 Flash** (via Google AI Studio Free Tier API key)
- Fallback support: `gemini-flash-latest`, `gemini-2.5-flash-lite`, `gemini-2.5-pro`

### **What the LLM is Used For**:
1. **Live In-Call Objection & Pivot Copilot (`POST /api/ai/assist`)**:
   - During an active call, when a prospect throws an objection (*"We already have an in-house team"*, *"Who gave you this number?"*, *"Send on WhatsApp first"*), the caller clicks **⚡ Get AI Pivot**.
   - The LLM receives the current stage, the tapped event, the prospect's verbatim words, and the prospect's company role.
   - It responds in **1 to 2 concise sentences** calibrated for Indian B2B decision-makers (polite, respectful, direct, zero jargon) so the caller can speak it without missing a beat.

2. **Stage 8 Outcome Validator & Quality Audit (`POST /api/ai/validate`)**:
   - The cold call reading identifies a critical failure mode: *"The caller logs an outcome that does not match what was said on the call"*.
   - When closing the call, the LLM analyzes the prospect's captured verbatim words (especially from Stage 5 *Their Need* and Stage 6/7) against the caller's chosen outcome.
   - It flags false positives—for example, when a prospect gives a polite brush-off (*"send an email to our office, we'll see"*) that callers frequently mistake for `"interested"`.
   - It automatically drafts a personalized, professional **WhatsApp follow-up message** ready for 1-click copying.

---

## 📊 How the 100 Transcripts Shaped Each Stage of the Screen

We analyzed all 100 real cold-call transcripts from Hyderabad-based *Meridian Growth Partners* selling growth and operational advisory to Indian manufacturers and enterprises.

### Stage Drop-Off Analysis:
- **Stage 1 (Opening)**: ~15% of calls terminate here (wrong person, person left company 14 years ago, switchboard refusal, line breaking).
- **Stage 2 (Purpose)**: ~29% of calls terminate here (*"Regarding what?"*, *"What does Meridian do?"*, *"Where did you get my number?"*).
- **Stage 3 (Permission)**: ~8% terminate or pause (*"Call after 2 PM"*, *"In a meeting / driving"*).
- **Stage 4 (Their business)**: ~6% reach discussing business scale and profile.
- **Stage 5 (Their need, in their words)**: ~14% reach discussing real plant bottlenecks, capacity, raw material margins, or export challenges.
- **Stage 6 (Objection)**: ~5% terminate on explicit objections (*"We already have an internal team"*, *"Speak to CFO"*).
- **Stage 7 (Next step)**: ~23% successfully agree on a concrete next step (report on WhatsApp or call next Tuesday/Thursday).
- **Stage 8 (Close)**: Close and truthful logging.

### The 8 Screen Stages:

| Stage # | Stage Name | What It Is For | What Prospects Say (From 100 Transcripts) | Taps ("What Happened") |
|---|---|---|---|---|
| **1** | **Opening** | Reach the right person and say who you are. The prospect decides in 10 seconds if this call is worth a minute. | • *"Who's this? Koun bol raha hai?"*<br>• *"He left the company years ago."*<br>• *"Driving / in meeting right now."*<br>• *"Switchboard here, what is this regarding?"* | • Connected with right person<br>• Assistant / Gatekeeper answered<br>• Busy / Driving / In meeting<br>• Wrong person / Left company<br>• Line broke / dropped |
| **2** | **Purpose** | Say in 1-2 sentences why you called, in words the prospect can repeat to a colleague. | • *"Regarding what? Kis baare mein?"*<br>• *"Who gave you this number?"*<br>• *"What does Meridian Growth do?"*<br>• *"Is this a sales call?"* | • Asked what we do<br>• Asked where we got number<br>• Suspected sales call<br>• Heard purpose and receptive<br>• Cut off / hung up |
| **3** | **Permission** | Find out whether they are willing to talk now (clear yes, clear no, or time to call back). | • *"Call after 2 PM / tomorrow."*<br>• *"WhatsApp pe bhej do / Send on WhatsApp."*<br>• *"Ah yes, go ahead (short yes, waits quietly)."*<br>• *"Only have 2 minutes, tell quickly."* | • Clear yes / "Go ahead, tell me"<br>• Asked to call later (time named)<br>• Said send on WhatsApp first<br>• Hesitant / waiting quietly<br>• Refused permission to talk now |
| **4** | **Their business** | Ask about their company and work before saying anything about yours. People talk about what they do. | • *"We are small-scale, not a corporate."*<br>• *"Handled by our Pune division."*<br>• *"Domestic OEM only, no exports."*<br>• *"Tell me what clients you work with first."* | • Shared business model & scale<br>• Corrected company size / division<br>• Downplayed scale ("Small-scale")<br>• Asked caller to prove credentials<br>• Guarded / reluctant |
| **5** | **Their need, in their words** | Hear what they are trying to do or struggling with, in their own words. **Crucial verbatim recording**. | • *"Market is bumpy; raw material margins tight."*<br>• *"Plant capacity exists, sales volume lagging."*<br>• *"Everything fine, nothing needed from outside."*<br>• *"What can you do for our kind of manufacturing?"* | • Named bottleneck (margin/capacity/sales)<br>• Claimed "Everything is fine / no need"<br>• Challenged: "What can you do?"<br>• Mentioned internal R&D/expansion<br>• Interested in peer benchmarks |
| **6** | **Objection** | Hear the reason for a no and understand it. A reason understood can be answered. | • *"Already have internal team / consultants."*<br>• *"Not right person, speak to CFO or MD."*<br>• *"Send deck via email, we will review."*<br>• *"Not interested, do not call again."* | • Has internal team / agency<br>• Referred to another leader (CFO/MD)<br>• Polite brush-off ("Send email")<br>• Hard refusal / Do not call<br>• Objection addressed & moved on |
| **7** | **Next step** | Agree one concrete thing: WhatsApp report, call at named time, meeting. | • *"Send summary on WhatsApp, I'll check."*<br>• *"Call Tuesday after 2 PM for working session."*<br>• *"Connect with Mr. Naik, texting his number."*<br>• *"Send email to office, we'll see."* | • Agreed report on WhatsApp<br>• Named specific time & day<br>• Shared direct colleague contact<br>• Passive "send email" brush-off<br>• Declined next step |
| **8** | **Close** | End call clearly and record what happened: outcome, next step, and prospect words from Stage 5. | • *"Right, thank you Priya ji. Tuesday then."*<br>• *"Line dropped mid-sentence."*<br>• *"Okay, send it across. Thank you."*<br>• *"Warm goodbye after a no."* | • Clean close with agreed next step<br>• Polite goodbye after refusal<br>• Line dropped / hung up<br>• Contact details & WhatsApp verified |

---

## 💾 Database Schema (Supabase PostgreSQL)

The database schema is located in `supabase/schema.sql` and includes:
- `calls` table: Stores prospect metadata, caller name, company category, call type, stage reached (1–8), final outcome (10 standardized outcome codes), duration in seconds, caller notes, AI summary, AI validation, and generated WhatsApp message.
- `call_stages` table: Chronological log of each stage touched during the call with the selected tap (`what_happened`), verbatim prospect words (`prospect_words`), and timestamp.
- Row Level Security (RLS) policies allowing public read & write for the free-tier app.
- Pre-seeded benchmark calls from the transcripts (Kalpana Chem Supplies, Annapurna Kitchen Equipment, Elektra Motors, Intellect Semiconductors, Camber Engines).

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v10+

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The backend starts at `http://localhost:4000`. Test the health endpoint:
```bash
curl http://localhost:4000/health
```

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The caller interface opens at `http://localhost:3000`.

---

## ☁️ Deployment Guide (Free Tiers)

### 1. Database (Supabase Free Tier)
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the **SQL Editor**, open `supabase/schema.sql`, paste the contents, and click **Run**.
3. Under **Project Settings > API**, copy the `Project URL` and `anon public` key.

### 2. Backend (Render Free Tier)
1. Go to [render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
4. Set Environment Variables:
   - `PORT`: `10000`
   - `GEMINI_API_KEY`: Your Gemini API key
   - `SUPABASE_URL`: Your Supabase URL *(optional, falls back to in-memory store if omitted)*
   - `SUPABASE_KEY`: Your Supabase anon key *(optional)*
5. Click **Create Web Service**. Note your Render URL (e.g. `https://meridian-call-guide-backend.onrender.com`).

### 3. Frontend (Vercel Free Tier)
1. Go to [vercel.com](https://vercel.com) and import your GitHub repository.
2. Configure settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (e.g. `https://meridian-call-guide-backend.onrender.com`)
4. Click **Deploy**. Your surface is live!

---

## 📹 Video Walkthrough & Transcript Selection

A complete 6-minute camera video guide with talking points and transcript walkthrough is provided in [`VIDEO_WALKTHROUGH_SCRIPT.md`](./VIDEO_WALKTHROUGH_SCRIPT.md).

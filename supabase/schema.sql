-- ==============================================================================
-- Schema for Meridian Call Guide (Supabase PostgreSQL)
-- Stores cold calls, stage progression, verbatim prospect words, and outcomes.
-- ==============================================================================

-- Drop existing tables if needed (cascade)
DROP TABLE IF EXISTS call_stages CASCADE;
DROP TABLE IF EXISTS calls CASCADE;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Calls Table
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_name VARCHAR(255) NOT NULL,
    prospect_role VARCHAR(255) DEFAULT 'Director',
    company_name VARCHAR(255) NOT NULL,
    company_kind VARCHAR(255) DEFAULT 'mid-size private company',
    caller_name VARCHAR(255) DEFAULT 'Caller',
    phone_number VARCHAR(50) DEFAULT '',
    call_type VARCHAR(50) DEFAULT 'first call',
    stage_reached INTEGER NOT NULL DEFAULT 1 CHECK (stage_reached BETWEEN 1 AND 8),
    stage_name VARCHAR(100) DEFAULT 'Opening',
    outcome VARCHAR(50) DEFAULT 'not_logged' CHECK (outcome IN (
        'next_step_agreed',
        'agreed_to_receive_report',
        'interested',
        'follow_up',
        'call_again',
        'not_interested',
        'do_not_call',
        'wrong_person',
        'moved_company',
        'not_logged'
    )),
    duration_seconds INTEGER DEFAULT 0,
    notes TEXT DEFAULT '',
    ai_summary TEXT DEFAULT '',
    ai_validation TEXT DEFAULT '',
    whatsapp_message TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Call Stages Table (Records what happened and verbatim prospect words at each stage)
CREATE TABLE call_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 8),
    stage_name VARCHAR(100) NOT NULL,
    what_happened TEXT NOT NULL,
    prospect_words TEXT DEFAULT '',
    ai_suggestion TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for fast retrieval and filtering
CREATE INDEX idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX idx_calls_outcome ON calls(outcome);
CREATE INDEX idx_calls_stage_reached ON calls(stage_reached);
CREATE INDEX idx_call_stages_call_id ON call_stages(call_id);
CREATE INDEX idx_call_stages_stage_num ON call_stages(stage_number);

-- 4. Row Level Security (RLS) - Enable public anonymous access for free tier app
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_stages ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo/free-tier purposes
CREATE POLICY "Allow anon read calls" ON calls FOR SELECT USING (true);
CREATE POLICY "Allow anon insert calls" ON calls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update calls" ON calls FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete calls" ON calls FOR DELETE USING (true);

CREATE POLICY "Allow anon read call_stages" ON call_stages FOR SELECT USING (true);
CREATE POLICY "Allow anon insert call_stages" ON call_stages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update call_stages" ON call_stages FOR UPDATE USING (true);

-- 5. Seed Initial Benchmark Calls from Real Transcripts
INSERT INTO calls (
    id, prospect_name, prospect_role, company_name, company_kind, caller_name, 
    stage_reached, stage_name, outcome, duration_seconds, notes, ai_summary, whatsapp_message, created_at
) VALUES 
(
    'a1111111-1111-1111-1111-111111111111',
    'Mr. Dev',
    'Technical Services Director',
    'Kalpana Chem Supplies',
    'mid-size private company',
    'Priya',
    7,
    'Next step',
    'next_step_agreed',
    75,
    'Agreed to Google Meet with Vikram next Tuesday afternoon after 2 PM.',
    'Prospect reviewed peer report, acknowledged product positioning questions, and confirmed Google Meet working session for Tuesday 2 PM.',
    'Hi Dev ji, Priya here from Meridian. As agreed, Vikram and I look forward to connecting with you next Tuesday after 2 PM on Google Meet to discuss the Kalpana Chem growth analysis. Have a great week ahead!',
    NOW() - INTERVAL '2 hours'
),
(
    'a2222222-2222-2222-2222-222222222222',
    'Ajay Kumar',
    'Director',
    'Annapurna Kitchen Equipment',
    'mid-size private manufacturer',
    'Sana',
    7,
    'Next step',
    'next_step_agreed',
    118,
    'Referred to Mr. Naik (Operations Head). Texted direct number.',
    'Director validated peer benchmark value proposition and delegated operational discussion directly to Operations Head Mr. Naik.',
    'Dear Ajay ji, thank you for the reference. Connecting with Mr. Naik regarding the manufacturing margin benchmark for Annapurna Kitchen Equipment as discussed. - Sana, Meridian Growth Partners',
    NOW() - INTERVAL '4 hours'
),
(
    'a3333333-3333-3333-3333-333333333333',
    'Ritika ji',
    'Chief Executive Officer',
    'Elektra Motors',
    'startup',
    'Neha',
    3,
    'Permission',
    'interested',
    65,
    'CEO interested in EV R&D case study; asked for callback tomorrow after 3 PM.',
    'Prospect is receptive to being featured in research series but had no time during call. Callback requested post 3 PM tomorrow.',
    'Hi Ritika ji, Neha from Meridian Growth Partners. Will ring you tomorrow at 3:15 PM as agreed to hear about Elektra Motors’ R&D milestones. Thank you!',
    NOW() - INTERVAL '6 hours'
),
(
    'a4444444-4444-4444-4444-444444444444',
    'Shekhar Rao',
    'Director of Hardware Engineering',
    'Intellect Semiconductors India',
    'India arm of a multinational',
    'Meera',
    6,
    'Objection',
    'do_not_call',
    92,
    'Stated he is not the right person and refused to share alternate contact.',
    'Prospect stated internal scope is restricted to hardware engineering; unwilling to facilitate referral or participate in growth advisory.',
    '',
    NOW() - INTERVAL '1 day'
),
(
    'a5555555-5555-5555-5555-555555555555',
    'Prakash Rao (Old listing)',
    'Not at firm',
    'Camber Engines India',
    'India arm of a multinational',
    'Arjun',
    1,
    'Opening',
    'wrong_person',
    43,
    'Person left company 14 years ago; junior staff answered.',
    'Number is stale in directory; contact left over a decade ago.',
    '',
    NOW() - INTERVAL '1 day 3 hours'
);

-- Seed Stages for Kalpana Chem (Mr. Dev)
INSERT INTO call_stages (call_id, stage_number, stage_name, what_happened, prospect_words) VALUES
('a1111111-1111-1111-1111-111111111111', 1, 'Opening', 'Connected with right person', 'Aha, Priya ji.'),
('a1111111-1111-1111-1111-111111111111', 2, 'Purpose', 'Heard purpose and receptive', 'Follow-up on the report shared earlier.'),
('a1111111-1111-1111-1111-111111111111', 3, 'Permission', 'Clear yes / "Go ahead, tell me"', 'Ah, yes. Go ahead.'),
('a1111111-1111-1111-1111-111111111111', 5, 'Their need, in their words', 'Named bottleneck (margins / capacity / sales)', 'Perhaps next week would be better. We would have a clearer idea of our products and where to push them.'),
('a1111111-1111-1111-1111-111111111111', 7, 'Next step', 'Named specific time & day for follow-up', 'Tuesday is a good day. After 2 PM. Call us in the afternoon and then we can perhaps have a working session.');

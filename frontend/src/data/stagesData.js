// Comprehensive 8-stage cold-call guide derived from 100 real transcripts
// Company: Meridian Growth Partners (Hyderabad - B2B growth advisory)

export const STAGES = [
  {
    stage: 1,
    name: "Opening",
    shortName: "Opening",
    purpose: "Reach the right person and say who you are. The prospect decides in the first ten seconds whether this call is worth a minute.",
    callerContext: "You have 10 seconds. Identify yourself as Meridian Growth Partners and confirm the prospect's identity.",
    prospectMaySay: [
      "\"Yes, who's this? / Koun bol raha hai?\"",
      "\"Arre, unka to number nahi hai / He left the company 2 years ago.\"",
      "\"I am driving / in a meeting right now, call back later.\"",
      "\"This is switchboard / assistant. What is this call regarding?\""
    ],
    taps: [
      "Connected with right person",
      "Assistant / Gatekeeper answered",
      "Busy / Driving / In meeting",
      "Wrong person / Person left company",
      "Line breaking / Line dropped"
    ],
    defaultOutcomeIfEnded: "call_again",
    aiTip: "If they ask who is calling, give your name and firm immediately without pitching: 'Rohit from Meridian Growth Partners in Hyderabad'."
  },
  {
    stage: 2,
    name: "Purpose",
    shortName: "Purpose",
    purpose: "Say in one or two sentences why you called, in words the prospect can repeat to a colleague. A purpose they cannot repeat is a purpose they did not hear.",
    callerContext: "Explain why Meridian is calling regarding their specific company. No jargon.",
    prospectMaySay: [
      "\"Regarding what? Kis baare mein baat karni hai?\"",
      "\"Who gave you this number? Where did you get my details?\"",
      "\"What does Meridian Growth Partners do?\"",
      "\"Is this a sales call? We don't entertain cold calls.\""
    ],
    taps: [
      "Asked what we do",
      "Asked where we got the number",
      "Suspected sales call / cautious",
      "Heard purpose and receptive",
      "Cut off / hung up"
    ],
    defaultOutcomeIfEnded: "not_interested",
    aiTip: "If asked 'Who gave you this number?', calmly state: 'Our research team follows high-potential manufacturers in your sector from public industry directories.'"
  },
  {
    stage: 3,
    name: "Permission",
    shortName: "Permission",
    purpose: "Find out whether they are willing to talk now. A clear yes, a clear no, or a time to call back are all good outcomes. Talking on without one is not.",
    callerContext: "Secure consent for 2 minutes or lock in an exact callback slot.",
    prospectMaySay: [
      "\"Can you call me after 2 PM / call me tomorrow?\"",
      "\"WhatsApp pe bhej do / Send it on WhatsApp first.\"",
      "\"Ah, yes. Go ahead. (A short yes, then waiting quietly)\"",
      "\"I only have two minutes, tell me quickly.\""
    ],
    taps: [
      "Clear yes / \"Go ahead, tell me\"",
      "Asked to call back later (time specified)",
      "Said send on WhatsApp first",
      "Hesitant / waiting quietly",
      "Refused permission to talk now"
    ],
    defaultOutcomeIfEnded: "follow_up",
    aiTip: "If prospect says 'Send on WhatsApp', respond: 'I'll definitely WhatsApp you the 1-page benchmark, can I ask just one quick question so I send the exact right peer comparison?'"
  },
  {
    stage: 4,
    name: "Their business",
    shortName: "Their business",
    purpose: "Ask about their company and their work before saying anything about yours. People talk about what they do; they rarely listen to what you do.",
    callerContext: "Get them talking about their manufacturing lines, distribution, or scale.",
    prospectMaySay: [
      "\"We are a small-scale manufacturer, not a corporate.\"",
      "\"That is handled by our Pune division / different entity.\"",
      "\"We only cater to domestic OEM clients, no exports.\"",
      "\"You tell me first what clients you work with in our industry.\""
    ],
    taps: [
      "Shared business model & operations",
      "Corrected company size / division",
      "Downplayed scale (\"We are small-scale\")",
      "Asked caller to prove credentials first",
      "Guarded / reluctant to reveal operations"
    ],
    defaultOutcomeIfEnded: "follow_up",
    aiTip: "Acknowledge their scale respectfully: 'Understood, some of our most impactful work is with specialized mid-sized manufacturers rather than sprawling corporates.'"
  },
  {
    stage: 5,
    name: "Their need, in their words",
    shortName: "Their need",
    purpose: "Hear what they are trying to do or struggling with, in their own words. This is the ONE stage where the caller writes down exactly what was said.",
    callerContext: "Listen intently. Write down their exact words. Don't rephrase.",
    prospectMaySay: [
      "\"Right now the market is bumpy; raw material margins are tight.\"",
      "\"Our plant has capacity, but growing sales volume is the obstacle.\"",
      "\"Everything is running fine, there is nothing we need from outside.\"",
      "\"What can you do for a company like ours that our team isn't doing?\""
    ],
    taps: [
      "Named bottleneck (margins / capacity / sales)",
      "Claimed \"Everything is fine / no requirements\"",
      "Turned question around: \"What can you do?\"",
      "Mentioned internal R&D or expansion plans",
      "Interested in peer margin benchmark data"
    ],
    defaultOutcomeIfEnded: "interested",
    aiTip: "Do not jump into pitch mode! Repeat their words back: 'You mentioned plant capacity is open but volume is lagging — that is exactly the focus of our peer report.'"
  },
  {
    stage: 6,
    name: "Objection",
    shortName: "Objection",
    purpose: "Hear the reason for a no and understand it. A reason you understand can be answered on this call or the next; a reason you talked over cannot.",
    callerContext: "Never argue or talk over the prospect. Clarify their reason.",
    prospectMaySay: [
      "\"We already have an internal team / existing consultants for this.\"",
      "\"I am not the right person, speak to our CFO or Managing Director.\"",
      "\"Send an email or deck first, we will review and call if interested.\"",
      "\"Not interested at all, please do not call this number.\""
    ],
    taps: [
      "Has internal team / incumbent agency",
      "Referred to another senior colleague (CFO/MD)",
      "Polite brush-off (\"Send email first\")",
      "Hard refusal / Do not call",
      "Objection addressed & moved to next step"
    ],
    defaultOutcomeIfEnded: "not_interested",
    aiTip: "If they say 'We have an in-house team', pivot gently: 'Most firms we work with do as well; our report simply gives an outside benchmark against peer numbers.'"
  },
  {
    stage: 7,
    name: "Next step",
    shortName: "Next step",
    purpose: "Agree one concrete thing: a document on WhatsApp or email, a call at a named time, a meeting. One thing, named, with a time or a channel.",
    callerContext: "Lock in ONE concrete item. A time named by them is worth 10x a time named by you.",
    prospectMaySay: [
      "\"Send the summary on WhatsApp, I will check it.\"",
      "\"Call me Tuesday after 2 PM for a working session.\"",
      "\"Connect with Mr. Naik, I'll text you his direct contact.\"",
      "\"Send an email to our office id, we'll see.\""
    ],
    taps: [
      "Agreed to receive report on WhatsApp",
      "Named specific time & day for follow-up",
      "Shared direct colleague / decision-maker contact",
      "Passive \"send email\" (polite brush-off)",
      "Declined to fix any next step"
    ],
    defaultOutcomeIfEnded: "next_step_agreed",
    aiTip: "Confirm the channel & time explicitly: 'Tuesday at 2:30 PM on WhatsApp — I'll send the 3-page peer report 15 minutes before we speak.'"
  },
  {
    stage: 8,
    name: "Close",
    shortName: "Close",
    purpose: "End the call clearly and record what happened: the outcome, the next step, and the prospect's words from stage 5. The record is what the next call is built on.",
    callerContext: "Log the truthful outcome. Do not log 'interested' if it was a polite brush-off.",
    prospectMaySay: [
      "\"Right, thank you Priya ji. Tuesday then.\"",
      "\"Line dropped / prospect hung up abruptly.\"",
      "\"Okay, send it across. Thank you. (Warm goodbye after a no)\"",
      "\"I'll review the report and revert back.\""
    ],
    taps: [
      "Clean close with agreed next step confirmed",
      "Polite goodbye after refusal (truthfully logged)",
      "Line dropped / Call broke off",
      "Contact details & WhatsApp number verified"
    ],
    defaultOutcomeIfEnded: "agreed_to_receive_report",
    aiTip: "Stage 8 is where callers often mislog polite nos as interest. Look at Stage 5 words and verify before finalizing the outcome."
  }
];

export const OUTCOMES = [
  { value: "next_step_agreed", label: "Next Step Agreed", description: "Meeting or scheduled call fixed with specific time/channel", color: "emerald" },
  { value: "agreed_to_receive_report", label: "Agreed to Receive Report", description: "Prospect agreed to receive document on WhatsApp or email", color: "blue" },
  { value: "interested", label: "Interested", description: "Prospect expressed interest, without a fixed time", color: "cyan" },
  { value: "follow_up", label: "Follow Up", description: "Prospect asked caller to call back later", color: "amber" },
  { value: "call_again", label: "Call Again", description: "Language or line quality issue, retry needed", color: "orange" },
  { value: "not_interested", label: "Not Interested", description: "Prospect declined the offer or pitch", color: "rose" },
  { value: "do_not_call", label: "Do Not Call", description: "Prospect asked not to be contacted again", color: "red" },
  { value: "wrong_person", label: "Wrong Person", description: "Person reached is not the target contact", color: "slate" },
  { value: "moved_company", label: "Moved Company", description: "Person no longer works at the listed firm", color: "gray" },
  { value: "not_logged", label: "Not Logged", description: "No outcome was recorded", color: "zinc" }
];

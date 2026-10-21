import glob
import re
import json
from collections import defaultdict, Counter

transcripts = sorted(glob.glob('transcripts/cold-call-transcripts-100/transcripts/T*.txt'))
print(f"Total transcripts found: {len(transcripts)}")

with open('transcripts/cold-call-transcripts-100/index.json', 'r', encoding='utf-8') as f:
    index_data = json.load(f)

# Analyze call drop-offs / outcomes
outcomes = Counter(c['outcome'] for c in index_data)
print("\n--- OUTCOMES ---")
for o, count in outcomes.most_common():
    print(f"{o:30}: {count}")

# Let's inspect where calls end by length and content
# Let's analyze prospect dialogue patterns
prospect_phrases = {
    "Opening (Gatekeeper/Identity)": [
        r"(who is this|who\'?s this|koun bol raha|apna naam|speaking)",
        r"(not available|in a meeting|busy|driving|call later|after \d|tomorrow)",
        r"(left the company|not with us|wrong number|retired|14 saal se)"
    ],
    "Purpose (Why are you calling)": [
        r"(regarding what|related to|kis baare mein|kisliye|what is it about)",
        r"(where did you get|who gave you|kahan se mila)",
        r"(what does meridian do|what do you do|company does)"
    ],
    "Permission (Willing to speak)": [
        r"(call me (after|tomorrow|later|in an hour)|driving|in a meeting)",
        r"(whatsapp pe bhej do|send (it )?on whatsapp|drop on whatsapp)",
        r"(two minutes|go ahead|tell me|haan boliye)"
    ],
    "Their Business (Context)": [
        r"(we don't do that|different division|we are small|subsidiary)",
        r"(tell me about yourself first|what is your background)"
    ],
    "Their Need (In their own words)": [
        r"(market|expansion|margin|capacity|export|raw material|scale|automation|plant)",
        r"(everything is fine|no requirement|don't need anything|sab theek hai)",
        r"(what can you do for|how does it work for us)"
    ],
    "Objection (The reason for No)": [
        r"(already have|in-house team|agency|consultant)",
        r"(not the right person|speak to marketing|speak to director|not my department)",
        r"(send (something|details|profile|deck) (in writing|email|mail))",
        r"(not interested|nahi chahiye|don't want)"
    ],
    "Next Step (Concrete agreement)": [
        r"(send (it|deck|report) on whatsapp|number note kar lo)",
        r"(tuesday|wednesday|thursday|friday|monday|\d\s?pm|\d\s?am|afternoon|morning)",
        r"(speak with mr|take his number|connect with)"
    ],
    "Close (End of call)": [
        r"(thank you|disconnect|ok bye|alright|line drop)"
    ]
}

analysis_results = defaultdict(list)

for path in transcripts:
    t_id = re.search(r'T\d+', path).group(0)
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    meta = {}
    dialogue = []
    for l in lines:
        if ':' in l and not l.startswith('CALLER:') and not l.startswith('PROSPECT:') and not l.startswith('RECEPTION:'):
            k, v = l.split(':', 1)
            meta[k.strip()] = v.strip()
        else:
            dialogue.append(l)
    
    # Store prospect quotes
    prospect_lines = [l.split(':', 1)[1].strip() for l in dialogue if l.startswith('PROSPECT:')]
    
    for stage_name, patterns in prospect_phrases.items():
        for pat in patterns:
            for pl in prospect_lines:
                if re.search(pat, pl, re.IGNORECASE):
                    analysis_results[stage_name].append((t_id, pl))

print("\n--- PROSPECT REAL QUOTES BY STAGE ---")
for stage, matches in analysis_results.items():
    print(f"\n=== {stage} (Sample Matches: {len(matches)}) ===")
    unique_quotes = list(dict.fromkeys([m[1] for m in matches]))
    for q in unique_quotes[:6]:
        print(f"  • \"{q}\"")

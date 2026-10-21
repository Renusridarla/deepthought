import glob
import re
import json
from collections import Counter

transcripts = sorted(glob.glob('transcripts/cold-call-transcripts-100/transcripts/T*.txt'))

stage_names = [
    "1. Opening",
    "2. Purpose",
    "3. Permission",
    "4. Their business",
    "5. Their need, in their words",
    "6. Objection",
    "7. Next step",
    "8. Close"
]

def determine_stage_reached(text, outcome, duration):
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    full_text = " ".join(lines).lower()
    
    # Check outcomes
    if outcome in ['wrong_person', 'moved_company']:
        return 1
    if outcome == 'call_again' and duration < 45:
        return 1
    
    # Check if reached Stage 7 / 8 (Next step / Close)
    if outcome in ['agreed_to_receive_report', 'next_step_agreed']:
        if any(w in full_text for w in ['whatsapp', 'email', 'tuesday', 'monday', 'thursday', 'calendar', 'google meet', 'schedule']):
            return 7
    
    # Check stage 6 (Objection)
    if outcome in ['not_interested', 'do_not_call']:
        if any(w in full_text for w in ['not interested', 'in-house', 'agency', 'consultant', 'already have', 'don\'t need']):
            return 6
        return 2

    # Check stage 5 (Their need)
    if any(w in full_text for w in ['plant', 'margin', 'capacity', 'expansion', 'struggling', 'growth bottleneck', 'operational problem']):
        return 5

    # Check stage 4 (Their business)
    if any(w in full_text for w in ['how many employees', 'manufacturer', 'division', 'turnover', 'what you make']):
        return 4

    # Check stage 3 (Permission)
    if any(w in full_text for w in ['is this the right time', 'two minutes', 'call back later', 'driving', 'in a meeting', 'after 2']):
        return 3

    # Check stage 2 (Purpose)
    if any(w in full_text for w in ['calling regarding', 'research series', 'meridian growth', 'what we do as a company']):
        return 2

    return 1

stage_reached_counts = Counter()
call_stages = []

for path in transcripts:
    t_id = re.search(r'T\d+', path).group(0)
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    lines = text.splitlines()
    outcome = 'not_logged'
    duration = 0
    company = ''
    prospect_role = ''
    caller = ''
    for l in lines:
        if l.startswith('outcome:'): outcome = l.split(':', 1)[1].strip()
        elif l.startswith('duration_seconds:'): 
            try: duration = int(l.split(':', 1)[1].strip())
            except: pass
        elif l.startswith('company:'): company = l.split(':', 1)[1].strip()
        elif l.startswith('prospect_role:'): prospect_role = l.split(':', 1)[1].strip()
        elif l.startswith('caller:'): caller = l.split(':', 1)[1].strip()
        
    st = determine_stage_reached(text, outcome, duration)
    stage_reached_counts[st] += 1
    call_stages.append({
        'id': t_id,
        'company': company,
        'role': prospect_role,
        'caller': caller,
        'outcome': outcome,
        'duration': duration,
        'stage_reached': st,
        'stage_name': stage_names[st-1]
    })

print("Stage reached distribution across 100 calls:")
for st_idx in range(1, 9):
    cnt = stage_reached_counts[st_idx]
    pct = (cnt / len(transcripts)) * 100
    print(f"  Stage {st_idx} ({stage_names[st_idx-1]}): {cnt} calls ({pct:.1f}%)")

with open('call_stages_summary.json', 'w', encoding='utf-8') as f:
    json.dump(call_stages, f, indent=2)
print("Saved call_stages_summary.json")

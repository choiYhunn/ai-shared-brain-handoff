# V8 — social political record feed

## Product shift

V7 centered on A↔B contrasts. V8 keeps that as a signature format but expands the product to a broader public-record feed.

The feed can now contain:
- statement ↔ later statement
- promise → action / outcome
- statement → clarification
- statement → apology
- old record → resurfacing → response
- conflict → public debate
- pledge → institutional result
- statement → action consistency

Social media is a discovery signal, not a factual source of truth. A feed item is publishable only after the underlying public record and relevant follow-up have been reviewed.

## Current data

- 29 contrast / trajectory records
- 23 event-style records
- 52 structured records total
- 98 evidence/source links total
- 14 event records are eligible for the default discovery feed
- 9 additional event records are indexed but hidden from the default feed until portrait/licensing and record presentation are improved

## Retention without ideological personalization

Do not infer political ideology or voting preference.

Repeat-use surfaces:
- scroll-snap discovery feed
- user-invoked Shuffle
- Continue where you left off
- Save
- person profiles
- issue hubs
- time-lane connections
- source deep links

Future:
- follow a person or issue explicitly
- new-record alerts only for explicit follows
- “this record now has a new follow-up” notifications
- history / saved collections

## Feed grammar

### Event card
portrait → relation label → one strong factual headline → original record → “이후” follow-up → source / context / save / share

### Contrast card
portrait → elapsed time → A → B → underlying records → source / context / save / share

No moral score, contradiction score, trust grade, candidate ranking, or winner.

## Discovery safety

feedReady=false means a record may exist in search/profile/graph data but should not be placed into the default feed yet.

Typical reasons:
- portrait rights/source not confirmed
- first-party/primary evidence should be improved
- wording needs additional context review
- event contains contested factual claims that should not be compressed into a feed headline yet

## Architecture

prototype-v8.html
assets/v8.css
assets/v8-core.js
assets/v8-ui.js
data/cases-v8-1.json
data/cases-v8-2.json
data/cases-v8-3.json
data/events-v8-1.json
data/events-v8-2.json

UI and content are now separated. Future evidence batches can be appended without redesigning the interface.

## Next ingestion layer

1. National Assembly minutes / roll calls / bills
2. official party and government releases
3. official social/video channels
4. election pledges
5. court / Constitutional Court decisions when relevant
6. reputable reporting as a contextual bridge

Pipeline:
discover → source capture → normalize Record/Event → entity and issue matching → candidate relation retrieval → review → feedReady → publish → revision log

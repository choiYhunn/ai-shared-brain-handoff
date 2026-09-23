# Claude / External Frontend Review Task

Read every file in this folder before proposing changes.

Goal: redesign the current mobile UI so it feels like a real consumer social product made by an experienced product/design team, not a generic AI-generated civic-tech/SaaS mockup.

Audit specifically:
- rounded-card/card-inside-card excess
- pill/chip excess
- purple/SaaS accent conventions
- unnecessary soft-gray containers
- overly uniform spacing and visual weight
- dashboard-like status/taxonomy presentation
- excessive explanatory copy
- media used as decoration rather than primary content
- portfolio-prototype feel rather than daily-use SNS feel

Study current interaction grammar and visual hierarchy from Threads, Instagram, X, Toss, and strong modern editorial mobile products. Extract principles; do not clone branding.

Stress-test the design with `samples/dmz-event.json`. A user should quickly understand:
1. what happened,
2. what risk was known beforehand,
3. why adequacy of safety measures is being questioned,
4. that direct linkage to a North Korean mine is not yet established,
5. that investigation remains unresolved.

Do not turn those distinctions into five badge rows. Prefer typography, language, hierarchy and progressive disclosure.

Also preserve the product's signature before/after and evidence-chain content.

Mobile first: 360–430 px. Review feed, discussion and profile surfaces.

Deliver:
1. current UI audit,
2. reference principles,
3. proposed design language,
4. information architecture changes,
5. exact files/structures to remove or preserve,
6. implementable HTML/CSS/JS changes,
7. unified diff where practical,
8. mobile validation notes,
9. remaining risks.

End with a section named `CHATGPT HANDOFF` containing enough exact implementation detail for the private canonical repository owner to apply the redesign.

Do not claim you pushed to the canonical repository. This public repository is read-only context for the collaboration workflow.

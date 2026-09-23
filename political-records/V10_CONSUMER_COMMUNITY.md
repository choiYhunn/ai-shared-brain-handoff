# V10 consumer/community pivot

## Problem
Current prototype has data but weak “why here instead of DC/Threads”.
The feed mixes too many record types and feels like a database rendered vertically.

## New product thesis
DC has opinions and speed.
This product should add:
- effortless context
- verified public record
- persistent person/issue history
- cleaner consumer UX

Community is not an add-on. It is the consumption layer on top of structured records.

## Home
Only three content grammars:
1. Today issue
2. Before/after
3. Community post

Do not mix more card grammars into the main feed.

Top tabs:
오늘 / 토론 / 인물

Secondary destinations:
검색 / 저장 / 알림 / 기준

## Today
One card = one question/event.
The card should contain only:
- one-line headline
- 1–2 sentence context
- key status
- comments count
- save/share
- “기록 보기”

Detailed sources/timeline move one tap deeper.

## Discussion
Issue rooms, not a generic unstructured board.

Each room has:
- pinned fact card maintained by the product
- user posts
- threaded comments
- links/evidence attachments
- “근거 요청”
- “맥락 추가”
- report/block

Public UI clearly separates:
[기록] editorial/verified layer
[게시물] user layer
[댓글] user layer

Never make user likes/upvotes into politician scores or political rankings.

## Posting identity
Use pseudonymous accounts, not claims of full anonymity.
Account needed to post; reading can remain open.
Rate limits, report/block, moderation logs and revision/removal workflows required.

## Profile is fully internal
Do not navigate to a competitor for basic member data.

Politician profile contains:
- portrait/name/current office
- party/district/committee where applicable
- current issues
- chronological public-record timeline
- statements
- votes
- bills/sponsorship
- pledges/outcomes
- controversies/clarifications/apologies
- user discussions attached to that person
- related people/issues
- source archive

External links are evidence links only and open from “원문”, never the primary navigation.

Primary parliamentary ingestion target: official Open National Assembly data, not competitor-owned profile/API as the long-term source of truth.

## Tossification principles
- value first: show the useful answer before explaining the system
- one primary action per screen
- plain Korean, no civic-tech jargon
- progressive disclosure: headline → context → timeline → sources
- large readable type and touch targets
- consistent card grammar
- fast back-stack / bottom sheets
- no dashboard tiles unless they answer a user question

## Habit loop
open app
→ see 3–5 important issues
→ tap one
→ read 20-second context
→ comments/posts
→ follow person/issue
→ receive only explicit-follow updates
→ return when timeline changes

No ideological personalization or inferred voting preference.

## Competitive edge
Not “political DC”.
Not “Eagle Eye with comments”.

Position:
A mainstream political social app where every argument can open the underlying public record in one tap.


## V10.6 controversy-first editorial grammar
- Feed hook is not a press-release summary. Lead with the specific point that makes people say “잠깐, 이게 맞아?”.
- Community/YouTube/SNS rhetoric is a discovery layer, not evidence. Preserve the tension in natural Korean, then verify the premises against primary/reliable sources.
- Attribute unproven conclusions in the hook: “정황은 X 같은데…”, “X라는 반응이 나온 이유”, “그런데 공식 설명은 Y”. Never silently convert a viral inference into a confirmed fact.
- Slide order: public reaction/tension → concrete facts that created it → strongest counter/explanation → what evidence would settle it.
- Do not flatten controversy into “양측 입장”. Weight each claim by its actual evidence and state what remains unknown.
- Avoid AI/editorial filler such as “왜 지금 봐야 하나”, “주목된다”, “논란이 예상된다”. Prefer verbs, numbers, direct contrasts and conversational questions.
- Apply the same grammar regardless of politician, party or administration.

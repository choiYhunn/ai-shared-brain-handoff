# 시차 — External AI Handoff

## Purpose
This folder contains a public-safe snapshot for UI/UX review. It is not the authoritative source.

## Product
"시차" is a consumer political social product, not a newsroom dashboard. Users should be able to encounter an issue through media, understand why it matters quickly, distinguish verified facts from allegations/questions and unresolved investigation, discuss it, and open the underlying public record/evidence.

Core loop:
media → fast context → why this is disputed → verified/unverified boundary → discussion → evidence/original sources → follow-up.

## Product constraints
- Neutral, source-grounded presentation.
- No politician trust/contradiction/ideology scores.
- No candidate ranking or ideological personalization.
- Allegations/questions must not be rendered as established facts.
- Follow-ups belong to the same event/timeline when appropriate.
- Detailed sources and timelines should be progressive disclosure rather than dashboard clutter.

## Current UI problem
The current V10.1 prototype moved toward media-first social cards but still looks noticeably AI-generated: excessive rounded containers, pills/chips, soft boxes, uniform component grammar, SaaS-like accent treatment, and too much explicit taxonomy in the feed.

The redesign should learn interaction principles from real consumer products (Threads, Instagram, X, Toss and strong editorial mobile products) without copying their branding.

## Files
- `prototype-v10.html`
- `assets/v10.css`
- `assets/v10.js`
- `V10_CONSUMER_COMMUNITY.md`
- `V8_SOCIAL_FEED.md`
- `samples/dmz-event.json` — stress-test event for fact/allegation/investigation hierarchy.
- `samples/community-v10.json`

## Important
Do not assume this snapshot contains every production event. Do not invent missing canonical data. Focus on UI architecture and produce a concrete handoff/diff for the private implementation owner.

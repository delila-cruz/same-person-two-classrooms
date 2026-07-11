# Same Person, Two Classrooms (working title) — Product Requirements

## Problem Statement
As AI tools become the default interface for getting things done — appealing a denied claim, applying for a job, asking for help — the people who benefit most aren't the smartest or most tech-equipped, they're the ones who were taught to write and argue precisely. This PRD defines a short (5-7 minute) interactive narrative that makes a single player *feel* that gap, not be told about it: the same person, split across two versions of their own life by nothing but the quality of their childhood English education, converges on the same real-world moment — a denied health insurance claim — with wildly different outcomes.

## Core Premise (established explicitly, once)
Immediately after the player presses start, a short passage states plainly: this is the same person, same everything — same family, same aptitude, same adult life circumstances — except for one variable: the classroom they walked into as a kid. This premise is told outright so the comparison reads correctly from the first beat onward. What is *not* stated anywhere in the game is the thesis conclusion itself (that AI compounds this gap into starkly different life outcomes) — that must only land once the player has seen both paths converge at the climax.

The two panels are never labeled (no "Path A/B," no names, no locations) — the premise text and the visual parallel alone are what tell the player these are the same person.

## User Stories

### Title & Premise
- As a first-time player, I want a simple title screen with the game's title, a one-line premise ("a game about literacy"), and a single clear start action, so I know what I'm about to experience before committing.
  - [ ] Title screen shows title text, subtitle "a game about literacy," and a visible start button/action
  - [ ] Clicking start advances to the premise passage
- As a first-time player, I want a short passage right after start that tells me both sides are the same person differing only by classroom quality, so I read the side-by-side comparison correctly from the beginning.
  - [ ] Premise passage explicitly states "same person, same everything, different classroom" (or equivalent plain language)
  - [ ] Premise passage does NOT hint at the ending or outcome
  - [ ] A "next" action advances from premise into Beat 1

### Beat 1 — Childhood English Class
- As a player, I want to read both childhood classroom experiences side by side, staggered so I'm not forced to take in both at once, so the contrast has room to land.
  - [ ] Left panel's text/content appears first
  - [ ] After a short delay, right panel's text/content appears
  - [ ] "Next" action is hidden/disabled until both panels have fully appeared
  - [ ] One side depicts strong instruction (essay structure, rhetoric, real feedback); the other depicts an under-resourced classroom (a movie put on, a substitute, an understaffed room) — no interactivity, pure narration
  - [ ] Clicking "next" advances to Beat 2

### Beat 2 — Digital/Tech Access (same tool, different fluency)
- As a player, I want to pick a prompt for each side of the same person when they're using the exact same AI tool, so I see firsthand that the tool isn't the variable — the ability to use it well is.
  - [ ] Both characters are shown to have identical access to the same AI/device tool (no framing implying a device/access gap)
  - [ ] Player picks one prompt option for each character in turn
  - [ ] Exactly 2 options are shown per character in this beat (introducing the mechanic simply, before the climax scales it up)
  - [ ] For the under-resourced character, one of the 2 options is struck-through/visibly locked and cannot be selected
  - [ ] Attempting to click a locked option does nothing (no selection registers) but shows a red hover state, signaling "this exists, you can't have it"
  - [ ] After both picks are made, a result appears for each side: a short canned response snippet — one version reused for any "good" pick, one version reused for the (only available) "weak" pick — showing one side getting a clearly more useful, actionable response and the other getting something vague/unhelpful, despite using the same tool
  - [ ] "Next" action is hidden until both results have been shown
  - [ ] Clicking "next" advances to the Climax (setup)

### Climax — The Denied Health Insurance Claim
This is the scene carrying the most narrative weight (~half of total runtime), told across three passages: setup, drafting (locked-choice), outcome.

**Setup**
- As a player, I want to see the same context and the same denial for both sides, so I understand the divergence that follows is caused only by how each side can respond — not by circumstance.
  - [ ] Setup shows brief context for why coverage was needed (e.g., a medical event), identical for both sides
  - [ ] Setup then shows a brief summary of the denial (not a full copy of the letter) — identical wording/reason for both sides
  - [ ] A "next" action advances to the drafting passage

**Drafting (locked-choice, multi-step)**
- As a player, I want to draft the appeal across several sequential decisions for each side, watching the under-resourced side get boxed in at every step, so the disadvantage reads as compounding, not a single unlucky moment.
  - [ ] Drafting happens across 2-3 sequential rounds (e.g., opening the appeal, citing the denial reason, closing the appeal)
  - [ ] Each round offers up to 4 options per character
  - [ ] In each round, some options are struck-through/locked for the under-resourced side (same visual mechanic as Beat 2: no click registers, red hover)
  - [ ] Player selects one option per character, per round, before advancing to the next round
  - [ ] Outcome text for each round/character is canned (one "strong" version, one "weak" version) — not uniquely written per specific option chosen
  - [ ] After the final round, advances to the outcome passage

**Outcome**
- As a player, I want to see both appeals resolve into a clear, starkly different result with no further explanation or commentary, so the ending sits heavy rather than being softened or explained away.
  - [ ] Both results are shown side by side as plain, bold text labels: "APPROVED" and "DENIED" (no rubber-stamp graphic — plain styled text is sufficient)
  - [ ] After the labels appear, there is a deliberate pause (a beat of silence/stillness) before anything else happens
  - [ ] After the pause, "end" fades/appears
  - [ ] A "start over" action is available after "end" appears
  - [ ] No additional text, reflection, or commentary appears after the outcome — the game stops here

## What We're Building
Everything above is essential for the 3-4 hour build:
- Title screen → premise passage → Beat 1 (staggered narration) → Beat 2 (2-option locked-choice pick + canned result) → Climax setup → Climax drafting (2-3 rounds, up to 4 options each, canned outcomes) → Climax outcome (text-label result, pause, "end," "start over")
- The reusable "locked-choice picker" component (options displayed, some struck-through/unclickable with red hover) used in both Beat 2 and the Climax
- Strictly linear flow: no back button, no way to revisit a prior beat once advanced
- No save/resume: refreshing or closing the tab and returning starts over from the title screen — this is acceptable since the piece is a single short sitting
- Visual distinction between the two sides via CSS only (palette/density/typography) — no custom illustration or per-passage art
- Consistent locked-option interaction across both beats: doesn't click, shows red hover, no other feedback

## What We'd Add With More Time
- A real "stamped letter" graphic/animation instead of plain text APPROVED/DENIED labels
- Unique, non-canned outcome text written per specific prompt/option combination, rather than one reused "strong"/"weak" version
- More options per round if the mechanic wants a richer field
- Custom illustration or richer visual identity per side, beyond CSS-only treatment
- Sound or subtle motion/ambient design
- Any save/resume support

## Non-Goals
- **No live AI/LLM API calls.** All outcomes are pre-written/scripted — keeps the build predictable and avoids latency/cost/complexity in a tight window.
- **No custom illustrated art per passage.** Visual distinction between the two sides is CSS-only (palette/density/typography), not illustration.
- **No sound or music.**
- **No character names, customization, or on-screen labels for the two sides.** Identity is established only through the premise passage and the visual parallel.
- **No mobile-responsive polish** — needs to work cleanly in a browser window only.
- **No branching beyond the defined structure** — one linear path per side, no alternate endings, no way to go back.
- **No forced-hope ending or added commentary** — the outcome screen ends on the two results and "end," with nothing softening or explaining it further.
- **No save/resume** — refreshing restarts from the title screen.

## Open Questions
- Exact visual treatment (palette, typography, density contrast) for distinguishing the two sides — deferred to `/spec`, needs resolving before build starts.
- Exact wording of the premise passage, the two "strong"/"weak" canned outcome snippets (Beat 2 and Climax), and the denial summary text — content to be drafted during `/spec` or early `/build`, not a blocker to starting.
- Exact timing values (stagger delay in Beat 1, pause length before "end") — can be tuned during build, not a blocker.

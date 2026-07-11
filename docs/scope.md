<!-- This template is a starting point. Add more sections if the conversation
     surfaces things worth capturing that don't fit neatly below. The scope doc
     should reflect the full richness of the conversation. -->

# Untitled (working title TBD) — an interactive narrative on the literacy gap in the age of AI

## Idea
A short, side-by-side interactive narrative that walks the player through two parallel lives — one well-resourced, one under-resourced — showing how gaps in *English literacy education* (not intelligence, not just device access) compound into wildly different outcomes once both people need AI to get what they want in life. The reveal isn't stated — it's felt, once the player has seen both paths converge.

## Who It's For
Primarily a one-time-experience piece for classmates/hackathon peers (and instructors) — not a multi-session teaching tool, not aimed at policymakers or a general public audience. Secondarily, something worth sharing afterward as a portfolio/reflective piece, the way Delila's prior project [GriefBot](https://github.com/delila-cruz/griefbot-demo) (Twine/twee, about grief) has been. The bar for success is emotional/intellectual resonance in a single sitting, not instructional completeness.

## Inspiration & References
- **[Parable of the Polygons](https://ncase.me/polygons/)** (Nicky Case & Vi Hart) — explorable-explanation format, small interactive minigames that let the reader *prove to themselves* how systemic bias emerges from small individual biases. Delila likes the minigame-style interactivity and the way it lands on a structural (not individual-blame) note.
- **[Spent](https://playspent.org/)** — walk-in-someone-else's-shoes poverty simulation (McKinney/Urban Ministries of Durham). Considered, but unclear fit — didn't resonate as strongly as the other two.
- **Depression Quest** (Twine) — its signature mechanic: some choices appear on screen but are struck through and unclickable, showing the player a "logical" option existed that the character's state made inaccessible. **This is the core mechanic being borrowed**: the under-resourced character's more articulate/effective prompt options will appear but be visibly locked, showing the literacy gap in the moment rather than narrating it.
- **[Coming Out Simulator](https://ncase.me/) (Nicky Case)** — hand-built interactive dialogue engine in vanilla JS/HTML rather than Twine's built-in passage system. Cited by Delila as precedent for building custom side-by-side interaction rather than staying inside Twine's native constraints.
- **[GriefBot](https://github.com/delila-cruz/griefbot-demo)** (Delila's own prior Twine project) — the tonal reference point: subtle, doesn't hit the player over the head, lets them arrive at the realization themselves rather than being told.
- Design energy: visually **distinct** between the two paths at a glance (likely color palette/density contrast — richer/warmer and more visually dense for the resourced character vs. starker/sparser for the under-resourced one, to be finalized in `/spec`). Text-forward is fine, but not bare/undifferentiated text — real visual identity, not full custom illustration per passage.

## Goals
- Make the player *feel* a structural, dystopian observation (AI is compounding a literacy-driven class gap) rather than being told about it.
- Lean into the meta-tension of using an AI coding agent to build a piece that's honest about AI's role in the problem — treated as a feature of the work, not a flaw to hide.
- Land as a "conversation starter" — Delila's definition of success is people finishing it meditative, still thinking about it afterward, ideally wanting to talk about it with someone.
- Ship something real and deployed within a tight same-day window (targeting deploy ~1–1:30pm, 2026-07-11).

## What "Done" Looks Like
A short, deployed, browser-playable interactive narrative with:
- **Two parallel character paths**, shown **side by side**, advancing in **lockstep** on a single "next" action (simplified from fully independent toggling, to reduce build risk) — not built in Twine directly, but likely hand-built (vanilla JS/HTML/CSS, in the spirit of Coming Out Simulator), since Twine doesn't natively support synced split-screen state.
- **Three story beats per side:**
  1. Childhood English class — one path gets strong instruction in essay structure/rhetoric; the other gets an under-resourced classroom (a movie put on, a substitute, understaffed district).
  2. Digital/tech access — **reframed to protect the thesis:** both characters have the *same* device/AI tool access. The divergence is in how they use it — the well-taught character asks precise, well-structured questions; the under-resourced character doesn't have that rhetorical toolkit yet. Keeps the causal thread 100% on literacy/rhetoric instruction across both beats, not a second competing cause (device access). This beat reinforces beat 1 rather than introducing a new variable.
  3. **Climax:** both characters, now adults, apply for the *same job* that requires using AI effectively. This scene gets the most narrative weight/length. The under-resourced character's more articulate/effective options appear but are **struck through and locked** (Depression Quest-style), visually demonstrating — not narrating — the gap.
- The "aha" (this was about literacy access all along, not intelligence or effort) is never stated outright — it's meant to land only once the player has seen both paths converge.
- A simple, functional title screen (not elaborate).
- Ending sits heavy/dystopian on purpose — no forced hope or "small changes matter" uplift bolted on. Meditative, not resolved.
- Deployed and shareable via a link, the way GriefBot is.
- **Target length: 5-7 minutes, short like GriefBot.** ~6-8 total passages/screens: title screen → beat 1 (childhood English class, combined side-by-side) → beat 2 (digital/tech access, combined side-by-side) → climax (job application, 2-3 passages of its own — setup, the locked-choice moment, outcome) → closing screen. The climax alone should carry close to half the runtime; early beats stay punchy (30-45 sec each) so the weight lands at the convergence, not spread evenly.

## What's Explicitly Cut
- **No live AI/LLM API calls.** All "prompting" outcomes are pre-written/scripted, not generated live. Keeps the build predictable and avoids latency/cost/complexity in a tight window.
- **No custom illustrated art per passage.** Some visual identity/distinction between the two paths, yes — but not full character illustration. Exact visual treatment TBD in `/spec`.
- **No sound or music.**
- **No character customization** (name, pronouns, appearance).
- **No mobile-responsive polish** — just needs to work cleanly in a browser window.
- **No branching beyond the defined structure** — two paths, three beats each, one convergence point. No alternate endings.
- **No forced-hope ending** — deliberately not doing a Parable-of-the-Polygons-style "and here's the optimistic takeaway" close.

## Loose Implementation Notes
- **Structure decided, engine still open:** Originally considered Twine (Delila's prior experience via GriefBot), but the side-by-side lockstep requirement pushes toward a hand-built JS/HTML/CSS approach (Coming Out Simulator-style) rather than Twine's native passage/link model.
- **Agreed fallback / safety net:** if custom side-by-side JS proves too time-costly mid-build, the fallback is to simplify further — e.g., collapsing to a sequential Twine build (play path A fully, then path B, then a comparison passage), or an even simpler side-by-side (two static columns advancing together, no independent state per side). This should be named explicitly in `/checklist` so it's not re-litigated mid-build under time pressure.
- The "locked choice" mechanic (visible-but-unclickable options) is the one mechanic carried over directly from Depression Quest and should be treated as core, not decorative.
- Visual contrast between the two paths (palette/density) needs to be nailed down concretely in `/spec`.

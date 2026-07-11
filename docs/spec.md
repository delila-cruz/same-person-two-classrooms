# Same Person, Two Classrooms — Technical Spec

## Stack
- **Plain HTML/CSS/JS.** No framework, no bundler, no build step. Matches the project's scale (single linear playthrough, ~8-10 scenes, no external data) and plays to strength — conceptual architecture over hands-on JS fluency.
- No dependencies to install. `index.html` loads `style.css` and the JS files directly via `<script>` tags (or `type="module"` if we want clean imports between files — decided in `/build`).
- Docs: [MDN — getting started with the web](https://developer.mozilla.org/en-US/docs/Learn) as a fallback reference if any vanilla DOM API is unfamiliar mid-build.

## Runtime & Deployment
- **Runtime:** Browser only. No server, no database, no API keys.
- **Deployment target:** Vercel.
  - Fastest path: **Vercel CLI** (`vercel` run from the project root) — deploys directly from the local folder, no GitHub connection required. Good fit for the 1–1:30 deadline.
  - Alternative: connect a GitHub repo in the Vercel dashboard for auto-deploys on push (nicer for a portfolio link tied to a repo, like GriefBot's).
  - Either way: set **Framework Preset → Other**, leave the build command blank, set **Output Directory → `.`** (repo root, since `index.html` lives there with no build step). [Vercel build config docs](https://vercel.com/docs/builds/configure-a-build)
- No environment variables needed (no live AI calls per `prd.md > Non-Goals`).

## Architecture Overview

The whole app is a client-side **scene machine**: one JS array of scene data, one render function, one index tracking position. No routing, no backend, no persistence.

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────────┐
│  index.html │────→│  main.js         │────→│  render.js         │
│  (2 panels, │     │  currentSceneIdx │     │  renderScene(idx)  │
│  start/next)│←────│  click handlers  │←────│  reads scenes.js   │
└─────────────┘     └──────────────────┘     └────────┬───────────┘
                                                        │
                                              ┌─────────▼──────────┐
                                              │  lockedChoice.js    │
                                              │  (reusable picker,  │
                                              │  used by Beat 2 &   │
                                              │  Climax > Drafting) │
                                              └─────────────────────┘
```

Data flows one direction: `scenes.js` (static content) → `render.js` (draws it) → user click → `main.js` (advances state) → back to `render.js`. Nothing round-trips to a server.

## Title & Premise
Implements `prd.md > Title & Premise`.
- **Scene type:** `title` and `narration`.
- Title scene: title text, subtitle "a game about literacy," single start button. Click → advance to premise scene.
- Premise scene: single block of text stating the "same person, same everything, different classroom" premise, no panels yet (single centered block, not split). A "next" advances to Beat 1 — this is the first scene where the two-panel layout appears.

## Beat 1 — Childhood English Class
Implements `prd.md > Beat 1 — Childhood English Class`.
- **Scene type:** `staggeredNarration`.
- Two panels render simultaneously in the DOM but the right panel's text is added with `staggerDelayMs` (default 1500ms) after the left, via `setTimeout`.
- The "next" button is disabled (not just hidden — hidden risks layout shift) until both panels have appeared; a `bothPanelsShown` flag flips to `true` in the `setTimeout` callback and re-enables it.
- Pure narration, no click targets inside the panels themselves.

## Beat 2 — Digital/Tech Access
Implements `prd.md > Beat 2 — Digital/Tech Access`.
- **Scene type:** `lockedChoice`, using the shared `lockedChoice.js` component.
- Each side shows the same prompt-picking UI: 2 options rendered per side. Left (resourced) side: both unlocked. Right (under-resourced) side: 1 of 2 options flagged `locked: true`.
- On a valid pick, the canned result string (`resultGood` or `resultWeak`, defined once in the scene's data, reused regardless of which valid option triggered it) renders under that panel.
- "Next" stays disabled until both sides have a result shown (`bothResultsShown` flag, same pattern as Beat 1).
- This is the **first appearance** of the locked-choice mechanic — deliberately lower stakes (2 options, single round) than the climax's version of the same component, per the "teach the grammar early" plan from `/prd`.

## Climax — The Denied Health Insurance Claim
Implements `prd.md > Climax — The Denied Health Insurance Claim`. Carries ~half the total runtime; three scenes.

### Setup
- **Scene type:** `narration` (two-panel, non-staggered — both sides show identical text simultaneously, since the point here is sameness, not contrast).
- Shows the medical-event context, then the denial summary. Same wording both sides.

### Drafting (multi-round locked-choice)
- **Scene type:** `multiRoundLockedChoice` — a single scene that internally manages its own `roundIndex` (separate from the top-level `currentSceneIndex`), cycling through 2-3 rounds (opening / citing denial reason / closing) before advancing the outer scene index.
- Each round: up to 4 options per side, rendered via the same `lockedChoice.js` component used in Beat 2. The under-resourced side has some options locked every round — this is what makes the disadvantage read as compounding rather than a single unlucky pick.
- Canned outcome text per round is reused (`resultGood`/`resultWeak`), not uniquely written per option — per the agreed scope cut.
- After the final round, advances to Outcome.

### Outcome
- **Scene type:** `outcome`.
- Both sides show a bold text label: "APPROVED" / "DENIED" (plain CSS-styled text, no graphic).
- After both labels render, a deliberate pause (`pauseMs`, default 2500ms) via `setTimeout` before the "end" text fades in.
- A "start over" action appears after "end" — the only navigation event that resets `currentSceneIndex` to 0 (full page reload is also acceptable and equivalent, since there's no state to reset otherwise).
- No further text or commentary after this — the scene machine simply stops advancing.

## Locked-Choice Picker Component
Implements the reusable mechanic shared by `prd.md > Beat 2` and `prd.md > Climax > Drafting`.
- Lives in `lockedChoice.js`, exports one function: `renderOptions(container, options, onPick)`.
- `options`: array of `{ text, locked }`.
- Locked options get class `.option--locked`: `text-decoration: line-through`, reduced opacity, `cursor: not-allowed`, and a `:hover` rule that flashes a red background/border — signals "this existed, you can't have it" without any click registering (event handler checks `locked` and returns early before calling `onPick`).
- Unlocked options are normal buttons; clicking one calls `onPick(option)` once, then the component disables further picks on that side for that round (prevents double-selection).

## Visual Design System
Resolves the open item from `prd.md > Open Questions` ("exact visual treatment... needs resolving before build starts"). Learner call, overriding the palette/density-contrast direction sketched in `scope.md`: **both panels are styled identically.** No left/right color, type, or density distinction — the only thing that visually marks the two sides is the content itself (what each character says and can/can't choose).

- **Shared palette for both panels:** cream background (`#FBF3E8`), warm ink text (`#3A2E22`), amber accent (`#C97C4B`) for buttons/highlights. System serif stack (`Georgia, 'Times New Roman', serif`). Same padding, line-height, and layout density on both sides.
- **Shared:** the red locked-option treatment (`#B23A3A` background flash on hover) is identical on both sides — the mechanic's visual language, not a character trait.
- **One separator, nothing else:** a single thin vertical rule between the two panels (`1-2px solid`, using the shared ink color `#3A2E22` at reduced opacity) — just enough to read as "two panels" rather than one continuous block. No color, density, or typography difference on either side of it.
- Panels sit in a CSS Grid, two equal columns, no labels — identity and divergence are carried entirely by the premise passage and the content (narration, options, canned results), not by styling. This sharpens the "same person, same everything" premise: nothing about how the two sides *look* gives away which one is which before the content does.

## Data Model
All content lives in one file, `scenes.js`, exporting a single array `SCENES`. No database, no external storage.

```js
// scenes.js (shape, not final copy)
export const SCENES = [
  { id: 'title', type: 'title', title: '...', subtitle: 'a game about literacy' },
  { id: 'premise', type: 'narration', text: '...' },
  { id: 'beat1', type: 'staggeredNarration',
    left: { text: '...' }, right: { text: '...' }, staggerDelayMs: 1500 },
  { id: 'beat2', type: 'lockedChoice',
    left:  { prompt: '...', options: [{text:'...', locked:false}, {text:'...', locked:false}] },
    right: { prompt: '...', options: [{text:'...', locked:false}, {text:'...', locked:true}] },
    resultGood: '...', resultWeak: '...' },
  { id: 'climaxSetup', type: 'narration', text: '...' },
  { id: 'climaxDrafting', type: 'multiRoundLockedChoice',
    rounds: [
      { label: 'Opening the appeal', leftOptions: [...], rightOptions: [...] },
      { label: 'Citing the denial reason', leftOptions: [...], rightOptions: [...] },
      { label: 'Closing the appeal', leftOptions: [...], rightOptions: [...] },
    ],
    resultGood: '...', resultWeak: '...' },
  { id: 'climaxOutcome', type: 'outcome',
    leftLabel: 'APPROVED', rightLabel: 'DENIED', pauseMs: 2500 },
  { id: 'closing', type: 'closing' },
];
```

**State that lives outside this array (in `main.js`, plain variables, in-memory only):**
- `currentSceneIndex` — position in `SCENES`.
- Per-scene transient flags as needed (`bothPanelsShown`, `bothResultsShown`, `roundIndex` for the drafting scene) — reset each time a new scene renders, never persisted.

No localStorage, no sessionStorage — refresh restarts from `title`, per `prd.md`'s no-save-resume rule.

## File Structure
```
project/
├── index.html          # single page: two-panel stage + start/next controls
├── style.css            # split-panel grid, left/right palette system, locked-option red-hover state
├── src/
│   ├── scenes.js         # ALL narrative content — the only file with copy/story data
│   ├── lockedChoice.js    # renderOptions(container, options, onPick) — shared by Beat 2 & Climax drafting
│   ├── render.js          # renderScene(index) — draws the current scene, owns stagger timing + next-button gating
│   └── main.js            # entry point — currentSceneIndex, event wiring, calls renderScene
├── docs/                  # scope.md, prd.md, spec.md, checklist.md, learner-profile.md
├── process-notes.md
└── README.md
```

## Key Technical Decisions
1. **Vanilla JS scene-array architecture over Twine or a framework.** Why: the lockstep side-by-side requirement doesn't fit Twine's native passage model, and a framework (React) adds setup overhead neither justified by app size nor by the learner's current hands-on JS comfort. Tradeoff accepted: slightly more manual DOM code, in exchange for zero build tooling and full transparency into how the state machine works.
2. **One reusable locked-choice component for both Beat 2 and Climax.** Why: `prd.md` explicitly calls out this mechanic as shared. Tradeoff: the component needs to support both 2-option/1-round (Beat 2) and up-to-4-option/multi-round (Climax) shapes — handled by keeping `renderOptions` agnostic to round structure; round-cycling logic lives in the scene, not the component.
3. **In-memory state only, no persistence layer.** Why: `prd.md` explicitly wants refresh-restarts-from-title behavior. Tradeoff: none — this is strictly simpler than adding localStorage would be.
4. **Identical visual styling on both panels, not a contrasting palette.** Why: `scope.md` originally sketched a warm/dense-vs-stark/sparse contrast, but the learner overrode that during `/spec` in favor of fully identical styling on both sides — reinforcing that divergence comes only from content (narration, options, outcomes), never from how the panels look. Tradeoff accepted: loses an at-a-glance visual cue for the contrast, in exchange for a sharper "same person, same everything" premise with nothing pre-signaling which side is which.

## Dependencies & External Services
None. No external APIs, no database, no auth, no analytics. The only external service touched is **Vercel**, for hosting the static files ([deployment docs](https://vercel.com/docs/deployments)).

## Error Strategy & Fallbacks
Given no external calls, there's almost nothing to fail at runtime — the main risks are build-time, not runtime:
- **If the custom side-by-side JS runs long mid-build:** fall back per the plan already named in `scope.md` — collapse to a simpler side-by-side (two static columns advancing together, no independent per-side state) rather than debugging further under time pressure. This should be named explicitly in `/checklist` as a named fallback, not re-decided live.
- **If a scene's data is malformed (e.g., missing an option array):** `renderScene` should fail loudly in the console rather than silently rendering a blank panel — easier to catch during a fast build than a silent visual bug.
- No loading spinners or "API slow" states needed — nothing in this app waits on a network call.

## Submission & Demo Flow
What judges will see: the deployed Vercel URL, played start to finish (5-7 min). Key screenshots for the Devpost submission page:
1. Title screen.
2. Beat 1 — both panels staggered in.
3. Beat 2 — the locked-choice picker mid-interaction (showing the red-hover locked state).
4. Climax drafting — a round in progress, options visibly struck-through on the right side.
5. Outcome — "APPROVED" / "DENIED" side by side.

The coolest moment (locked options mid-hover, red flash) is a CSS `:hover` state — capture it with a short screen recording or GIF rather than a static screenshot, since a still image won't show the interaction.

## Open Issues
- Exact copy (premise passage wording, the two canned Beat 2/Climax response snippets, the denial summary text) is still unwritten — not a blocker, drafted during `/build` per `prd.md > Open Questions`.
- Exact timing values (`staggerDelayMs`, `pauseMs`) are set to reasonable defaults above; tune by feel during `/build`.
- `index.html` script loading strategy (plain `<script>` tags vs. `type="module"` imports) is left to `/build` — either works with this file structure, pick whichever is faster to wire up live.

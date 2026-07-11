# Build Checklist

## Build Preferences

- **Build mode:** Autonomous
- **Comprehension checks:** N/A (autonomous mode)
- **Git:** Commit after each checklist item completes, message format: "Complete step N: [title]"
- **Verification:** Yes — checkpoints every 3-4 items where the agent pauses, summarizes what was built, and the learner confirms things look right before continuing.
- **Check-in cadence:** N/A (autonomous mode)

## Named Fallback (from scope.md — do not re-litigate mid-build)

If the custom side-by-side JS (staggered narration, locked-choice state, multi-round drafting) runs long or breaks under time pressure, the agreed fallback is to simplify to two static columns that advance together with no independent per-side state — not to debug further against the clock. This was decided in `/scope` specifically so it wouldn't need to be re-decided live.

## Checklist

- [x] **1. Write `scenes.js` — full data model + all narrative copy**
  Spec ref: `spec.md > Data Model`
  What to build: Create `src/scenes.js` exporting the `SCENES` array with all scene objects: `title`, `premise`, `beat1` (staggeredNarration), `beat2` (lockedChoice), `climaxSetup` (narration), `climaxDrafting` (multiRoundLockedChoice, 3 rounds), `climaxOutcome` (outcome), `closing`. Write full, real narrative copy for every scene per `prd.md` — the premise statement, both classroom narrations for Beat 1, Beat 2's prompt options and canned results, the climax's medical-event context + denial summary, all 3 drafting rounds (up to 4 options per side each, with rights locked appropriately), and the outcome labels. No placeholder text.
  Acceptance: Every `prd.md` checkbox per beat is reflected in the data — premise explicitly states "same person, same everything, different classroom"; Beat 1 shows one well-resourced and one under-resourced classroom narration; Beat 2 has exactly 2 options per side with 1 locked on the right; Climax drafting has 2-3 rounds with up to 4 options per side, some locked on the right each round; outcome shows "APPROVED" / "DENIED".
  Verify: Read through `scenes.js` end to end — confirm every scene has real copy (not lorem ipsum or TODOs) and that `locked: true` is set on the correct options per `prd.md`.

- [x] **2. Build the core scene machine (`index.html`, `main.js`, `render.js`)**
  Spec ref: `spec.md > Architecture Overview`, `spec.md > Title & Premise`
  What to build: `index.html` with the two-panel CSS Grid layout and start/next controls. `main.js` owning `currentSceneIndex` state and click handlers. `render.js`'s `renderScene(index)` handling the `title` and `narration` scene types to start. Wire click → advance index → re-render.
  Acceptance: Title screen shows the title text, subtitle "a game about literacy," and a visible start button; clicking start advances to the premise passage (`prd.md > Title & Premise`).
  Verify: Open the app in a browser, click start, confirm the premise passage renders and states the "same person, different classroom" premise without hinting at the ending.

- [x] **3. Beat 1 — implement `staggeredNarration` scene type**
  Spec ref: `spec.md > Beat 1 — Childhood English Class`
  What to build: Extend `render.js` to handle `staggeredNarration` — left panel renders immediately, right panel renders `staggerDelayMs` (1500ms default) later via `setTimeout`. Next button stays disabled until a `bothPanelsShown` flag flips true in the timeout callback.
  Acceptance: Left panel's content appears first; right panel appears after a short delay; next is disabled/hidden until both have shown; clicking next advances to Beat 2 (`prd.md > Beat 1`).
  Verify: Click through to Beat 1, confirm the left panel appears first, the right panel follows ~1.5s later, and the next button only becomes clickable once both are visible.

- [x] **4. Build `lockedChoice.js` + wire Beat 2**
  Spec ref: `spec.md > Locked-Choice Picker Component`, `spec.md > Beat 2 — Digital/Tech Access`
  What to build: Create `lockedChoice.js` exporting `renderOptions(container, options, onPick)`. Locked options get `.option--locked` styling (line-through, reduced opacity, `cursor: not-allowed`) and their click handler returns early without calling `onPick`. Unlocked options call `onPick(option)` once, then disable further picks on that side. Wire the `lockedChoice` scene type for Beat 2: 2 options per side, right side has 1 locked; after a valid pick, the canned `resultGood`/`resultWeak` string renders; next stays disabled until both sides show a result.
  Acceptance: Both sides show identical AI-tool-access framing; 2 options per side; the locked option on the right cannot be selected; clicking a valid option on both sides reveals results and enables next (`prd.md > Beat 2`).
  Verify: Reach Beat 2, click the locked option and confirm nothing registers (no selection, just visual feedback), then click valid options on both sides and confirm results appear and next advances.

- [x] **5. Climax setup + `multiRoundLockedChoice` drafting**
  Spec ref: `spec.md > Climax — Setup`, `spec.md > Climax — Drafting`
  What to build: Add the `climaxSetup` narration scene — two-panel, non-staggered, identical wording both sides (medical-event context, then denial summary). Add the `multiRoundLockedChoice` scene type to `render.js` — manages its own `roundIndex` across 2-3 rounds (opening, citing denial reason, closing), reusing `lockedChoice.js` for each round's options (up to 4 per side). Advances to the next round after both sides pick; advances the outer scene index after the final round.
  Acceptance: Setup context and denial summary are identical wording both sides; drafting runs 2-3 rounds with up to 4 options per side; some options are locked on the right side every round, making the disadvantage compound; advances to Outcome after the final round (`prd.md > Climax — Setup`, `Drafting`).
  Verify: Step through the setup and all drafting rounds — confirm identical setup text both sides, and confirm the right side has locked options in every round, not just once.

- [x] **6. Climax outcome + closing**
  Spec ref: `spec.md > Climax — Outcome`
  What to build: Add the `outcome` scene type — render `leftLabel`/`rightLabel` ("APPROVED"/"DENIED") as bold styled text. After both labels render, wait `pauseMs` (2500ms default) via `setTimeout`, then fade in "end" text. Show a "start over" action after "end" appears, which resets `currentSceneIndex` to 0 (or triggers a page reload). No further text or commentary appears after this.
  Acceptance: Both results show side by side as plain bold text; a deliberate pause happens before "end" appears; "start over" is available after; nothing else renders after the outcome (`prd.md > Outcome`).
  Verify: Play through to the end, confirm APPROVED/DENIED render, count the pause before "end" fades in, and click "start over" to confirm it returns to the title screen.

- [x] **7. Styling pass — shared visual system**
  Spec ref: `spec.md > Visual Design System`
  What to build: Write `style.css` implementing the shared palette (cream background `#FBF3E8`, warm ink text `#3A2E22`, amber accent `#C97C4B`, system serif stack), CSS Grid two-column panel layout with a single thin vertical separator, and the red locked-hover state (`#B23A3A` background flash) on `.option--locked`. Both panels must be styled identically — no left/right distinction in color, density, or typography.
  Acceptance: Both panels look visually identical apart from their content; locked options flash red on hover; a single thin separator divides the panels (`spec.md > Visual Design System`).
  Verify: Run the app and visually confirm no left/right styling difference, then hover a locked option and confirm the red flash appears.

- [x] **8. Init git repo, push to GitHub, deploy to Vercel**
  Spec ref: `spec.md > Runtime & Deployment`
  What to build: `git init`, stage and commit the project, create a new GitHub repo (`gh repo create`), and push. Deploy via the Vercel CLI (`vercel` command) with Framework Preset "Other," blank build command, and Output Directory "." (repo root).
  Acceptance: The app is live at a Vercel URL; the code is pushed to a public GitHub repo (`spec.md > Runtime & Deployment`).
  Verify: Open the live Vercel URL and play the game start to finish; confirm the GitHub repo page shows the pushed code.

- [ ] **9. Submit your project to Devpost**
  Spec ref: `prd.md > What We're Building` (the core submission story), `spec.md > Submission & Demo Flow`
  What to build: Walk through the Devpost submission form. Write a project name and tagline. Draft the project story using `scope.md` and `prd.md` as source material — the "same person, two classrooms" premise, why it matters, what was built and cut. Add "built with" tags (HTML, CSS, JavaScript, Vercel). Take the 5 key screenshots (title screen; Beat 1 staggered panels; Beat 2 locked-choice mid-interaction; Climax drafting round in progress; Outcome APPROVED/DENIED) — ideally capture the locked-option red-hover moment as a short GIF/recording since it's a `:hover` state a still won't show. Upload the `docs/` folder artifacts (scope, PRD, spec, checklist). Link the GitHub repo and the deployed Vercel URL. Optionally add a demo video link later (not required now). Review and submit.
  Acceptance: Submission is live on Devpost with project name, tagline, description, built-with tags, screenshots, docs artifacts, repo link, and deployed link. All required fields complete (`prd.md`, `spec.md > Submission & Demo Flow`).
  Verify: Open the Devpost submission page and confirm the green "Submitted" badge appears. Read the description back — would someone who knows nothing about the project understand what it does and why it matters?

// render.js
// Draws the current scene into #stage based on scene.type.
// Owns the "next" button helper (setNextEnabled / onNextClick) so later
// scene types can gate/rebind it without touching main.js.

import { SCENES } from './scenes.js';
import { renderOptions } from './lockedChoice.js';
import { advanceScene } from './main.js';

const stage = document.getElementById('stage');

// Keep a reference to the current "next" click handler so we can swap it
// out cleanly each time a scene binds a new one (avoids stacking listeners).
let currentNextHandler = null;
let nextButtonEl = null;

/**
 * Renders SCENES[index] into #stage.
 * This is the single entry point later scene types should extend —
 * add a new `else if (scene.type === '...')` branch below.
 */
export function renderScene(index) {
  const scene = SCENES[index];

  if (!scene) {
    console.error(`renderScene: no scene found at index ${index}`);
    return;
  }

  // Reset per-render state: clear the stage and forget the previous
  // scene's next-button handler (each scene binds its own).
  stage.innerHTML = '';
  currentNextHandler = null;
  nextButtonEl = null;

  if (scene.type === 'title') {
    renderTitleScene(scene);
  } else if (scene.type === 'narration') {
    renderNarrationScene(scene);
  } else if (scene.type === 'staggeredNarration') {
    renderStaggeredNarrationScene(scene);
  } else if (scene.type === 'lockedChoice') {
    renderLockedChoiceScene(scene);
  } else if (scene.type === 'multiRoundLockedChoice') {
    renderMultiRoundLockedChoiceScene(scene);
  } else if (scene.type === 'outcome') {
    renderOutcomeScene(scene);
  } else if (scene.type === 'closing') {
    renderClosingScene(scene);
  } else {
    // Fail loudly rather than silently rendering a blank panel —
    // easier to catch during a fast build than a silent visual bug.
    console.error(`renderScene: unhandled scene type "${scene.type}" (scene id: ${scene.id})`);
  }
}

// ---- title ----------------------------------------------------------

function renderTitleScene(scene) {
  const block = document.createElement('div');
  block.className = 'single-block title-block';

  const heading = document.createElement('h1');
  heading.textContent = scene.title;

  const subheading = document.createElement('h2');
  subheading.textContent = scene.subtitle;

  block.appendChild(heading);
  block.appendChild(subheading);
  block.appendChild(createNextButton('Start'));

  stage.appendChild(block);
}

// ---- narration --------------------------------------------------------

function renderNarrationScene(scene) {
  const block = document.createElement('div');
  block.className = 'single-block';

  appendParagraphs(block, scene.text);

  block.appendChild(createNextButton('Next'));

  stage.appendChild(block);
}

// ---- staggeredNarration -------------------------------------------------

function renderStaggeredNarrationScene(scene) {
  const staggerDelayMs = scene.staggerDelayMs ?? 1500;

  const { grid, left, right } = createTwoPanelGrid();

  // Left panel renders immediately.
  appendParagraphs(left, scene.left.text);

  stage.appendChild(grid);
  stage.appendChild(createNextButton('Next'));

  // Right panel stays empty until the stagger delay elapses. Next is
  // disabled until both panels have shown.
  setNextEnabled(false);

  let bothPanelsShown = false;

  setTimeout(() => {
    appendParagraphs(right, scene.right.text);
    bothPanelsShown = true;
    setNextEnabled(true);
  }, staggerDelayMs);
}

// ---- lockedChoice -------------------------------------------------------

function renderLockedChoiceScene(scene) {
  const promptBlock = document.createElement('div');
  promptBlock.className = 'single-block shared-prompt';
  appendParagraphs(promptBlock, scene.prompt);
  stage.appendChild(promptBlock);

  const { grid, left, right } = createTwoPanelGrid();

  const leftOptions = document.createElement('div');
  leftOptions.className = 'options';
  left.appendChild(leftOptions);

  const rightOptions = document.createElement('div');
  rightOptions.className = 'options';
  right.appendChild(rightOptions);

  stage.appendChild(grid);
  stage.appendChild(createNextButton('Next'));
  setNextEnabled(false);

  // In this dataset, each side only truly has one meaningfully "good" path:
  // - Left: both options are unlocked. The specific/structured prompt (index 0)
  //   is the skilled one -> resultGood. The vague one (index 1) -> resultWeak.
  // - Right: the skilled option is locked, so the only pickable option is
  //   always the vague one -> resultWeak, regardless of which option object
  //   ends up being picked.
  const leftGoodText = scene.left.options[0].text;

  let leftShown = false;
  let rightShown = false;

  function maybeEnableNext() {
    if (leftShown && rightShown) {
      setNextEnabled(true);
    }
  }

  renderOptions(leftOptions, scene.left.options, (picked) => {
    const resultText = picked.text === leftGoodText ? scene.resultGood : scene.resultWeak;
    appendParagraphs(left, resultText, 'result');
    leftShown = true;
    maybeEnableNext();
  });

  renderOptions(rightOptions, scene.right.options, () => {
    // The only pickable option on the right is always the weaker one.
    appendParagraphs(right, scene.resultWeak, 'result');
    rightShown = true;
    maybeEnableNext();
  });
}

// ---- multiRoundLockedChoice ----------------------------------------------

/**
 * Cycles through `scene.rounds` (each shaped like { label, leftOptions,
 * rightOptions }) inside a single scene, re-rendering fresh options into
 * the same grid each round rather than advancing the outer scene index.
 * Only after the final round's result renders does the "next" button
 * advance to the next top-level scene — kept consistent with the rest of
 * the app's gated next-button idiom rather than inventing a new pattern.
 */
function renderMultiRoundLockedChoiceScene(scene) {
  let roundIndex = 0;

  const heading = document.createElement('h3');
  heading.className = 'round-heading';
  stage.appendChild(heading);

  const { grid, left, right } = createTwoPanelGrid();
  stage.appendChild(grid);

  const nextButton = createNextButton('Next round');
  stage.appendChild(nextButton);
  setNextEnabled(false);

  renderRound(roundIndex);

  function renderRound(idx) {
    const round = scene.rounds[idx];
    const isFinalRound = idx === scene.rounds.length - 1;

    heading.textContent = `Round ${idx + 1}: ${round.label}`;

    // Clear any leftover option buttons/results from the previous round
    // before rendering fresh ones into the same panels.
    left.innerHTML = '';
    right.innerHTML = '';

    const leftOptions = document.createElement('div');
    leftOptions.className = 'options';
    left.appendChild(leftOptions);

    const rightOptions = document.createElement('div');
    rightOptions.className = 'options';
    right.appendChild(rightOptions);

    setNextEnabled(false);

    // main.js's bindNext() runs synchronously right after renderScene()
    // returns (i.e. right after this whole scene function), and it is only
    // called once per outer scene transition — not once per round. So every
    // round (including the last) must explicitly rebind the button here;
    // there's no later bindNext() call to "fall through to." We defer with
    // a microtask purely so this bind wins the race against that one
    // bindNext() call that happens right after the scene first mounts
    // (click events are macrotasks and always queue behind microtasks).
    Promise.resolve().then(() => {
      onNextClick(() => {
        if (isFinalRound) {
          advanceScene();
        } else {
          roundIndex += 1;
          renderRound(roundIndex);
        }
      });
    });

    // Each side's "good" option is its most specific/detailed option —
    // by convention in this dataset, index 0 of that side's options for
    // this round. Whether that option is actually pickable (unlocked)
    // varies per round/side, which is exactly what makes the right side's
    // disadvantage compound rather than following a fixed index.
    const leftGoodText = round.leftOptions[0].text;
    const rightGoodText = round.rightOptions[0].text;

    let leftShown = false;
    let rightShown = false;

    function maybeEnableNext() {
      if (leftShown && rightShown) {
        setNextEnabled(true);
        nextButton.textContent = isFinalRound ? 'Continue' : 'Next round';
      }
    }

    renderOptions(leftOptions, round.leftOptions, (picked) => {
      const resultText = picked.text === leftGoodText ? scene.resultGood : scene.resultWeak;
      appendParagraphs(left, resultText, 'result');
      leftShown = true;
      maybeEnableNext();
    });

    renderOptions(rightOptions, round.rightOptions, (picked) => {
      const resultText = picked.text === rightGoodText ? scene.resultGood : scene.resultWeak;
      appendParagraphs(right, resultText, 'result');
      rightShown = true;
      maybeEnableNext();
    });
  }
}

// ---- outcome --------------------------------------------------------------

/**
 * Terminal scene: both sides' results (APPROVED / DENIED) render immediately
 * as plain bold labels, side by side. No "Next" button — this is the last
 * interactive beat in the game (per PRD, no further commentary follows the
 * outcome). After `pauseMs` (default 2500ms), "end" fades in, followed by a
 * "start over" button that restarts the whole game from scene 0.
 */
function renderOutcomeScene(scene) {
  const pauseMs = scene.pauseMs ?? 2500;

  const { grid, left, right } = createTwoPanelGrid();

  const leftLabel = document.createElement('p');
  leftLabel.className = 'outcome-label';
  leftLabel.textContent = scene.leftLabel;
  left.appendChild(leftLabel);

  const rightLabel = document.createElement('p');
  rightLabel.className = 'outcome-label';
  rightLabel.textContent = scene.rightLabel;
  right.appendChild(rightLabel);

  stage.appendChild(grid);

  // Deliberately no "Next" button is created here — this scene never
  // advances the outer scene index on its own.

  setTimeout(() => {
    const endText = document.createElement('p');
    endText.className = 'end-text';
    endText.textContent = 'end';
    stage.appendChild(endText);

    const startOverButton = document.createElement('button');
    startOverButton.type = 'button';
    startOverButton.className = 'start-over';
    startOverButton.textContent = 'start over';
    startOverButton.addEventListener('click', () => {
      // Per spec, a full page reload is an acceptable and equivalent way
      // to reset currentSceneIndex to 0, since there's no other state to
      // reset — simpler and more reliable than reaching into main.js.
      location.reload();
    });
    stage.appendChild(startOverButton);
  }, pauseMs);
}

// ---- closing ----------------------------------------------------------

/**
 * Safety-net terminal marker. In practice this scene is unreachable:
 * `outcome` (the scene before it) has no "Next" button, so the scene
 * machine never advances past climaxOutcome. Rendered as a no-op empty
 * stage rather than inventing new narrative text, since the PRD forbids
 * any commentary after the outcome.
 */
function renderClosingScene(_scene) {
  // Intentionally blank — stage was already cleared by renderScene().
}

// ---- shared helpers -----------------------------------------------------

/**
 * Splits text on "\n\n" (paragraph breaks) into separate <p> tags appended
 * to `container`, so CSS doesn't just collapse raw newlines. Shared by any
 * scene type that renders freeform narration text.
 *
 * `extraClassName` (optional) is added to every <p> produced — used to mark
 * canned "result" text (e.g. the AI assistant's reply) as visually distinct
 * from narration prose, since it reads as a quoted system artifact rather
 * than the story's own voice.
 */
function appendParagraphs(container, text, extraClassName) {
  const paragraphs = text.split('\n\n');
  for (const paragraph of paragraphs) {
    const p = document.createElement('p');
    p.textContent = paragraph;
    if (extraClassName) {
      p.classList.add(extraClassName);
    }
    container.appendChild(p);
  }
}

/**
 * Helper for future scene types (staggeredNarration, lockedChoice, etc.)
 * that need the two-panel grid shell. Returns the grid element with two
 * empty .panel children (left, right) already appended, so callers just
 * fill those in.
 */
export function createTwoPanelGrid() {
  const grid = document.createElement('div');
  grid.className = 'two-panel-grid';

  const left = document.createElement('div');
  left.className = 'panel panel--left';

  const right = document.createElement('div');
  right.className = 'panel panel--right';

  grid.appendChild(left);
  grid.appendChild(right);

  return { grid, left, right };
}

/**
 * Creates the "next"/"start" button, appends it to the DOM tree the caller
 * controls, and registers it as the current next-button so setNextEnabled/
 * onNextClick can operate on it later in the same scene's lifecycle.
 */
function createNextButton(label) {
  const button = document.createElement('button');
  button.textContent = label;
  button.type = 'button';
  nextButtonEl = button;
  return button;
}

/**
 * Enables or disables the current next/start button. Later scene types
 * (staggered reveal, locked choice) will call this to gate advancement
 * until some condition is met (e.g. both panels shown).
 */
export function setNextEnabled(enabled) {
  if (!nextButtonEl) return;
  nextButtonEl.disabled = !enabled;
}

/**
 * Binds the click handler for the current next/start button. Replaces
 * any previously bound handler so scenes can rebind freely (e.g. a
 * multi-round scene advancing rounds before advancing the outer index).
 */
export function onNextClick(handler) {
  if (!nextButtonEl) return;

  if (currentNextHandler) {
    nextButtonEl.removeEventListener('click', currentNextHandler);
  }

  currentNextHandler = handler;
  nextButtonEl.addEventListener('click', currentNextHandler);
}

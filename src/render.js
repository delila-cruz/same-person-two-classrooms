// render.js
// Draws the current scene into #stage based on scene.type.
// Owns the "next" button helper (setNextEnabled / onNextClick) so later
// scene types can gate/rebind it without touching main.js.

import { SCENES } from './scenes.js';

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
  } else {
    // Fail loudly rather than silently rendering a blank panel —
    // easier to catch during a fast build than a silent visual bug.
    console.error(`renderScene: unhandled scene type "${scene.type}" (scene id: ${scene.id})`);
  }
}

// ---- title ----------------------------------------------------------

function renderTitleScene(scene) {
  const block = document.createElement('div');
  block.className = 'single-block';

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

// ---- shared helpers -----------------------------------------------------

/**
 * Splits text on "\n\n" (paragraph breaks) into separate <p> tags appended
 * to `container`, so CSS doesn't just collapse raw newlines. Shared by any
 * scene type that renders freeform narration text.
 */
function appendParagraphs(container, text) {
  const paragraphs = text.split('\n\n');
  for (const paragraph of paragraphs) {
    const p = document.createElement('p');
    p.textContent = paragraph;
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

// main.js
// Entry point. Owns currentSceneIndex — the only piece of state in the app,
// and the only place that mutates it. No localStorage/sessionStorage:
// refreshing the page always restarts from scene 0 (the title screen).

import { SCENES } from './scenes.js';
import { renderScene, onNextClick } from './render.js';

let currentSceneIndex = 0;

function goToScene(index) {
  currentSceneIndex = index;
  renderScene(currentSceneIndex);
  bindNext();
}

function bindNext() {
  onNextClick(() => advanceScene());
}

function advanceScene() {
  if (currentSceneIndex < SCENES.length - 1) {
    goToScene(currentSceneIndex + 1);
  }
}

// Exposed so scene types that manage their own internal state (e.g.
// multiRoundLockedChoice cycling through rounds) can advance the outer
// scene index themselves once their internal state machine completes,
// without render.js needing to know about currentSceneIndex directly.
export { advanceScene };

// Initial render on page load.
goToScene(currentSceneIndex);

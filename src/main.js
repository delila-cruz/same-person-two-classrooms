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
  onNextClick(() => {
    if (currentSceneIndex < SCENES.length - 1) {
      goToScene(currentSceneIndex + 1);
    }
  });
}

// Initial render on page load.
goToScene(currentSceneIndex);

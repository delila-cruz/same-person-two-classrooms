// lockedChoice.js
// Renders a single side's set of pickable options for the `lockedChoice`
// (and future `multiRoundLockedChoice`) scene types.
//
// This module only knows about one side's options at a time — the caller
// (render.js) is responsible for calling renderOptions() once per side.

/**
 * Renders `options` as clickable buttons inside `container`.
 *
 * - Clears container's existing children first, so it's safe to call fresh.
 * - Locked options get class `.option--locked` and a minimal inline
 *   "disabled-looking" style (line-through + reduced opacity). Clicking one
 *   does nothing — no onPick call, no side effect.
 * - Unlocked options call `onPick(option)` exactly once when clicked. After
 *   any unlocked option in this container is picked, all buttons in the
 *   container become disabled so the player can't change their answer or
 *   pick again.
 *
 * @param {HTMLElement} container
 * @param {{text: string, locked: boolean}[]} options
 * @param {(option: {text: string, locked: boolean}) => void} onPick
 */
export function renderOptions(container, options, onPick) {
  container.innerHTML = '';

  const buttons = [];

  for (const option of options) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option.text;
    button.className = 'option';

    if (option.locked) {
      button.classList.add('option--locked');
      // Minimal inline feedback until the real stylesheet lands — just
      // enough to visually distinguish a locked option right now.
      button.style.textDecoration = 'line-through';
      button.style.opacity = '0.5';

      button.addEventListener('click', () => {
        // Locked: do nothing functionally. No onPick call.
        return;
      });
    } else {
      button.addEventListener('click', () => {
        // Disable every button on this side so the player can't pick twice
        // or change their answer after a valid pick.
        for (const b of buttons) {
          b.disabled = true;
        }
        onPick(option);
      });
    }

    buttons.push(button);
    container.appendChild(button);
  }
}

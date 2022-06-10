export default function applyPatches() {
  /**
   * Disable the print prompt
   */
  window.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey || event.shiftKey) &&
        (event.key === "p" || event.key === "k" || event.key === "l")
      ) {
        event.preventDefault();
      }
    },
    true,
  );

  /**
   * Disable the browser's context menu
   */
  window.addEventListener(
    "contextmenu",
    (event: MouseEvent) => {
      event.preventDefault();
    },
    true,
  );
}

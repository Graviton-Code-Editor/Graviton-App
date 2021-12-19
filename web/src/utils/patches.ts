export default function applyPatches() {
  /**
   * Disable the print prompt
   */
  window.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
      }
    },
    true
  );
}

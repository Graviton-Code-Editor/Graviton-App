/*
 * Tweaks for Browser
 */

// Prevent showing browser's context menu
window.addEventListener('contextmenu', e => e.preventDefault())

// Disable Ctrl+P shortcut
window.addEventListener('keydown', e => {
	if (e.ctrlKey && ['p'].includes(e.key)) {
		e.preventDefault()
	}
})

import RunningConfig from 'RunningConfig'

/*
 * Tweaks for Browser
 */

// Prevent showing browser's context menu
window.addEventListener('contextmenu', e => e.preventDefault())

// Disable Brwoser's Ctrl+P shortcut
window.addEventListener('keydown', e => {
	if (e.ctrlKey && ['p', 's', 'o'].includes(e.key)) {
		e.preventDefault()
	}
})

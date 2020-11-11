import RunningConfig from 'RunningConfig'
import BrowserWelcome from '../defaults/windows/browser_welcome'

/*
 * Tweaks for Browser
 */

// Prevent showing browser's context menu
window.addEventListener('contextmenu', e => e.preventDefault())

// Disable Brwoser's Ctrl+P shortcut
window.addEventListener('keydown', e => {
	if (e.ctrlKey && ['p'].includes(e.key)) {
		e.preventDefault()
	}
})

/*
 * When the app loads open the Browser's welcome
 */
RunningConfig.on('appLoaded', () => {
	BrowserWelcome().launch()
})

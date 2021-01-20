import { Panel, removePanel } from '../../constructors/panel'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core

//Command: Save current opened file if there is any (default: Ctrl+S)
RunningConfig.on('command.saveCurrentFile', () => {
	RunningConfig.data.focusedTab && RunningConfig.data.focusedTab.state.emit('savedMe')
})

//Command: Create a new panel (default: Ctrl+N)
RunningConfig.on('command.newPanel', () => {
	new Panel()
})

//Command: Close the current tab (default: Ctrl+T)
RunningConfig.on('command.closeCurrentTab', () => {
	if (RunningConfig.data.focusedTab) {
		//Check if there is any opened tab
		RunningConfig.data.focusedTab.state.emit('close')
	}
})

//Command: Try to close the current panel (default: Ctrl+L)
RunningConfig.on('command.closeCurrentPanel', () => {
	removePanel()
})

//Command: Increase the font size of all text editors
RunningConfig.on('command.increaseFontSize', ({ factor = 2 } = { factor: 2 }) => {
	StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize) + factor
})

//Command: Decrease the font size of all text editors
RunningConfig.on('command.decreaseFontSize', ({ factor = 2 } = { factor: 2 }) => {
	StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize) - factor
})

//Command: Close the current Window/Dialog opened (default: Esc)
RunningConfig.on('command.closeCurrentWindow', () => {
	const windows = document.getElementById('windows').children
	const selectedWindow: any = windows[windows.length - 1]
	if (!selectedWindow) return
	const { methods } = selectedWindow.props
	if (windows.length == 0 || !methods) return
	if (methods.closeWindow) methods.closeWindow()
})

//Command: Close app
RunningConfig.on('command.closeApp', () => {
	RunningConfig.emit('checkAllTabsAreSaved', {
		whenContinue() {
			ipcRenderer.send('close-window', RunningConfig.data.windowID)
		},
	})
})

//Command: Focus the explorer panel (default: Ctrl+E)
RunningConfig.on('command.focusExplorerPanel', () => {
	if (RunningConfig.data.focusedExplorerItem) {
		//If there is a focused item
		const itemElement = <HTMLElement>RunningConfig.data.focusedExplorerItem.firstChild
		itemElement.focus()
	} else {
		const itemElement = <HTMLElement>document.getElementById('explorer_panel').firstChild.firstChild
		itemElement.focus()
	}
})

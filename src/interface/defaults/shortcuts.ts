import { Shortcuts } from 'shortcuts'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'

import './shortcuts/common'
import './shortcuts/global_command_prompt'
import './shortcuts/explorer_command_prompt'
import './shortcuts/editor_command_prompt'
import './shortcuts/tabs_iterator'

const appShortCuts = new Shortcuts()

StaticConfig.on('shortcutsHaveBeenUpdated', () => {
	appShortCuts.reset()
	applyShortcuts()
})

const externalShortcuts = []

/*
 * Safely create a shortcut
 */
RunningConfig.on('registerCommand', ({ name, shortcut, action }) => {
	externalShortcuts.push({
		shortcut,
		handler: action,
	})
	appShortCuts.reset()
	applyShortcuts()
})

function getAppShortcuts() {
	return [
		...StaticConfig.data.appShortcuts.SaveCurrentFile.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => RunningConfig.emit('command.saveCurrentFile'),
			}
		}),
		...StaticConfig.data.appShortcuts.NewPanel.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => RunningConfig.emit('command.newPanel'),
			}
		}),
		...StaticConfig.data.appShortcuts.CloseCurrentTab.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => RunningConfig.emit('command.closeCurrentTab'),
			}
		}),
		...StaticConfig.data.appShortcuts.CloseCurrentPanel.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => RunningConfig.emit('command.closeCurrentPanel'),
			}
		}),
		...StaticConfig.data.appShortcuts.OpenEditorCommandPrompt.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => RunningConfig.emit('command.openEditorCommandPrompt'),
			}
		}),
		...StaticConfig.data.appShortcuts.OpenExplorerCommandPrompt.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => RunningConfig.emit('command.openExplorerCommandPrompt'),
			}
		}),
		...StaticConfig.data.appShortcuts.OpenCommandPrompt.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => RunningConfig.emit('command.openCommandPrompt'),
			}
		}),
		...StaticConfig.data.appShortcuts.IterateCurrentPanelTabs.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => RunningConfig.emit('command.openCurrentPanelTabsIterator'),
			}
		}),
		...StaticConfig.data.appShortcuts.IncreaseEditorFontSize.combos
			.map(shortcut => {
				if (shortcut === 'Ctrl+ScrollUp') return
				return {
					shortcut,
					handler: event => RunningConfig.emit('command.increaseFontSize'),
				}
			})
			.filter(Boolean),
		...StaticConfig.data.appShortcuts.DecreaseEditorFontSize.combos
			.map(shortcut => {
				if (shortcut === 'Ctrl+ScrollDown') return
				return {
					shortcut,
					handler: event => RunningConfig.emit('command.decreaseFontSize'),
				}
			})
			.filter(Boolean),
		...StaticConfig.data.appShortcuts.CloseCurrentWindow.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => RunningConfig.emit('command.closeCurrentWindow'),
			}
		}),
		...StaticConfig.data.appShortcuts.CloseApp.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => RunningConfig.emit('command.closeApp'),
			}
		}),
		...StaticConfig.data.appShortcuts.FocusExplorerPanel.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => RunningConfig.emit('command.focusExplorerPanel'),
			}
		}),
		...StaticConfig.data.appShortcuts.ToggleTerminal.combos.map(shortcut => {
			return {
				shortcut,
				handler: event => (StaticConfig.data.appShowTerminal = !StaticConfig.data.appShowTerminal),
			}
		}),
	]
}

function applyShortcuts() {
	appShortCuts.add([...getAppShortcuts(), ...externalShortcuts])
}

applyShortcuts()

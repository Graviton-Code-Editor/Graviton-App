import PluginsRegistry from 'PluginsRegistry'
import StaticConfig from 'StaticConfig'
import { render } from '@mkenzo_8/puffin'
import WarningDialog from '../../../utils/dialogs/warning'
import InputDialog from '../../../utils/dialogs/dialog.input'

function removeShortcut(item, shortcut, combo) {
	WarningDialog().then(() => {
		item.remove()
		const comboPos = StaticConfig.data.appShortcuts[shortcut].combos.indexOf(combo)

		StaticConfig.data.appShortcuts[shortcut].combos.splice(comboPos, 1)

		StaticConfig.triggerChange()

		StaticConfig.emit('shortcutsHaveBeenUpdated')
	})
}

export default function ShortcutsScheme() {
	return {
		shortcuts: Object.keys(StaticConfig.data.appShortcuts)
			.map(shortcut => {
				const { combos } = StaticConfig.data.appShortcuts[shortcut]
				return [
					{
						type: 'title',
						label: shortcut,
					},
					{
						type: 'section',
						content: combos.map(combo => ({
							type: 'button',
							label: combo,
							onClick() {
								removeShortcut(this, shortcut, combo)
							},
						})),
					},
					{
						type: 'button',
						label: 'windows.Settings.Shortcuts.CreateCombo',
						onClick(e, { getComponentFromScheme }) {
							InputDialog({
								title: 'New combo',
							}).then(input => {
								StaticConfig.data.appShortcuts[shortcut].combos.push(input)
								StaticConfig.triggerChange()
								render(
									getComponentFromScheme({
										type: 'button',
										label: input,
										onClick() {
											removeShortcut(this, shortcut, input)
										},
									}),
									this.previousSibling,
								)

								StaticConfig.emit('shortcutsHaveBeenUpdated')
							})
						},
					},
				]
			})
			.flat(),
	}
}

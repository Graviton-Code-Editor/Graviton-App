import PluginsRegistry from 'PluginsRegistry'
import StaticConfig from 'StaticConfig'
import { element, render } from '@mkenzo_8/puffin'
import InputDialog from '../../../utils/dialogs/dialog_input'
import ShortcutsTable from '../../../components/settings/shortcuts_table'
import { Button } from '@mkenzo_8/puffin-drac'

enum States {
	EMPTY = 'Empty',
}

function ShortcutCombo({ shortcut }) {
	const { combos } = StaticConfig.data.appShortcuts[shortcut]

	function changeCombo() {
		InputDialog({
			title: 'Change combo',
			content: `Write 'empty' to leave it empty. `,
		}).then(input => {
			if (input === 'empty') {
				StaticConfig.data.appShortcuts[shortcut].combos.splice(0, 1)
				this.innerText = States.EMPTY
			} else if (StaticConfig.data.appShortcuts[shortcut].combos[0]) {
				StaticConfig.data.appShortcuts[shortcut].combos[0] = input
				this.innerText = input
			} else {
				StaticConfig.data.appShortcuts[shortcut].combos.push(input)
				this.innerText = input
			}

			StaticConfig.triggerChange()

			StaticConfig.emit('shortcutsHaveBeenUpdated')
		})
	}

	return element({
		components: {
			Button,
		},
	})`
		<Button :click="${changeCombo}">${combos[0] || States.EMPTY}</Button>
	`
}

export default function Shortcuts() {
	return element({
		components: {
			ShortcutsTable,
		},
	})`
		<ShortcutsTable>
			<th>Shortcut</th>
			<th>Combo</th>
				${Object.keys(StaticConfig.data.appShortcuts).map(shortcut => {
					const shortcutPrettyName = shortcut.match(/[A-Z]?[a-z]+/gm).join(' ')
					return element({
						components: {
							ShortcutCombo,
						},
					})`<tr>
								<td>${shortcutPrettyName}</td>
								<td><ShortcutCombo shortcut="${shortcut}"/></td>
							</tr>`
				})}
		</ShortcutsTable>
	`
}

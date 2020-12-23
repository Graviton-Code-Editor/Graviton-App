import PluginsRegistry from 'PluginsRegistry'
import StaticConfig from 'StaticConfig'
import { element, render } from '@mkenzo_8/puffin'
import InputDialog from '../../../utils/dialogs/dialog_input'
import ShortcutsTable from '../../../components/settings/shortcuts_table'
import { Button } from '@mkenzo_8/puffin-drac'

function ShortcutCombo({ shortcut }) {
	const { combos } = StaticConfig.data.appShortcuts[shortcut]

	function changeCombo() {
		InputDialog({
			title: 'Change combo',
		}).then(input => {
			if (StaticConfig.data.appShortcuts[shortcut].combos[0]) {
				StaticConfig.data.appShortcuts[shortcut].combos[0] = input
			} else {
				StaticConfig.data.appShortcuts[shortcut].combos.push(input)
			}

			StaticConfig.triggerChange()
			this.innerText = input

			StaticConfig.emit('shortcutsHaveBeenUpdated')
		})
	}

	return element({
		components: {
			Button,
		},
	})`
		<Button :click="${changeCombo}">${combos[0] || 'Empty'}</Button>
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

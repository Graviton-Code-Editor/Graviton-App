import Dialog from '../../constructors/dialog'
import StaticConfig from 'StaticConfig'
import { restartConfiguration } from '../../core/configurator'

export default function RestartConfigDialog() {
	return new Promise((resolve, reject) => {
		const DialogInstance = new Dialog({
			title: 'dialogs.restartConfig.title',
			content: 'dialogs.restartConfig.content',
			buttons: [
				{
					label: 'misc.Cancel',
					action: reject,
				},
				{
					label: 'misc.Continue',
					action() {
						restartConfiguration()
					},
				},
			],
		})
		DialogInstance.launch()
	})
}

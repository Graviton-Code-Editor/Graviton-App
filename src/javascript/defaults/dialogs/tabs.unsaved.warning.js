import Dialog from '../../constructors/dialog'

function tabsUnsavedWarningDialog() {
	return new Promise((resolve, reject) => {
		const DialogInstance = new Dialog({
			title: 'dialogs.tabsUnsavedWarning.title',
			content: 'dialogs.tabsUnsavedWarning.content',
			buttons: [
				{
					label: 'misc.GoBack',
					action: reject,
				},
				{
					label: 'misc.Ignore',
					action: resolve,
				},
			],
		})
		DialogInstance.launch()
	})
}

export default tabsUnsavedWarningDialog

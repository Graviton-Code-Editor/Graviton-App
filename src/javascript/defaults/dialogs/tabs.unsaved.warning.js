import Dialog from '../../constructors/dialog'

function tabsUnsavedWarningDialog(){
	return new Promise((resolve, reject) => {
		const DialogInstance = new Dialog({
			title:'There are unsaved tabs.',
			content:'Be careful.',
			buttons:[
				{
					label:'Ignore',
					action:reject
				},
				{
					label:'Continue',
					action:resolve
				}
			]
		})
		DialogInstance.launch()
	});
}

export default tabsUnsavedWarningDialog
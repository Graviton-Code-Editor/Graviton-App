import Dialog from '../../constructors/dialog'

function tabsUnsavedWarningDialog(){
	return new Promise((resolve, reject) => {
		const DialogInstance = new Dialog({
			title:'There are unsaved tabs.',
			content:'Be careful.',
			buttons:[
				{
					label:'Go back',
					action:reject
				},
				{
					label:'Ignore',
					action:resolve
				}
			]
		})
		DialogInstance.launch()
	});
}

export default tabsUnsavedWarningDialog
import Dialog from '../../constructors/dialog'

function areYouSureDialog(){
	return new Promise((resolve, reject) => {
		const DialogInstance = new Dialog({
			title:'Are you sure?',
			content:'Be careful.',
			buttons:[
				{
					label:'No',
					action:reject
				},
				{
					label:'Yes',
					action:resolve
				}
			]
		})
		DialogInstance.launch()
	});
}

export default areYouSureDialog
import Dialog from '../../constructors/dialog'
import { puffin } from '@mkenzo_8/puffin'
import { Text } from '@mkenzo_8/puffin-drac'

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
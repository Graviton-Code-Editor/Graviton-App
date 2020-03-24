import Dialog from '../../constructors/dialog'
import packageJSON from '../../../../package.json'

function About(){
	const DialogInstance = new Dialog({
		title:'About',
		content:`
			Graviton v${packageJSON.version} 

			Author: Marc Espín Sanz
		`,
		buttons:[
			{
				label:'accept'
			}
		]
	})
	return DialogInstance
}

export default About
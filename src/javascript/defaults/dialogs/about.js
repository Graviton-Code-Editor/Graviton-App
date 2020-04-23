import Dialog from '../../constructors/dialog'
import packageJSON from '../../../../package.json'
import buildJSON from '../../../../assets/build.json'

function About(){
	const DialogInstance = new Dialog({
		title:'About',
		content:`Graviton v${packageJSON.version} 
				Build date: ${buildJSON.date}
				Author: Marc Espín Sanz
		`,
		buttons:[
			{
				label:'close',
				important:false
			}
		]
	})
	return DialogInstance
}

export default About
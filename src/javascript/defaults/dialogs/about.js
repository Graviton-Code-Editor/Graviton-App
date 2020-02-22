import Dialog from '../../constructors/dialog'
import GravitonPackage from '../../../../package.json'

function About(){
    const DialogInstance = new Dialog({
        title:'About',
        content:`Graviton v${GravitonPackage.version}`,
        buttons:[
            {
                label:'accept'
            }
        ]
    })

    return DialogInstance
}


export default About
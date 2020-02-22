import Dialog from '../../constructors/dialog'
import GravitonPackage from '../../../../package.json'

function AboutDialog(){
    const DialogInstance = new Dialog({
        title:'About',
        content:`Graviton v${GravitonPackage.version}`,
        buttons:[
            {
                label:'accept'
            }
        ]
    })

    DialogInstance.launch()
}


export default AboutDialog
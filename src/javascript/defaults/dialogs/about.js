import Dialog from '../../constructors/dialog'
import GravitonPackage from '../../../../package.json'

function AboutDialog(){
    new Dialog({
        title:'About',
        content:`Graviton v${GravitonPackage.version}`,
        buttons:[
            {
                label:'accept'
            }
        ]
    })
}


export default AboutDialog
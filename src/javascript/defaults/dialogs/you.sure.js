import Dialog from '../../constructors/dialog'
import { puffin } from '@mkenzo_8/puffin'
import { Text } from '@mkenzo_8/puffin-drac'

function areYouSureDialog(){
    return new Promise((resolve, reject) => {
        const component = puffin.element(`
        <div>
            Be careful.
        </div>
    `,{
        components:{
            Text
        }
    })

    const DialogInstance = new Dialog({
        title:'Are you sure?',
        component,
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
      });
}

export default areYouSureDialog
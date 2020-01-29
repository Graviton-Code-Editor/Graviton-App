import PanelBody from '../components/panel/panel'
import {puffin} from '@mkenzo_8/puffin'
import Resizer from '../components/panel/resizer.horizontally'

function Panel(){
    const randomSelector = Math.random()
    const PanelComp = puffin.element(`
        <div id="${randomSelector}" class="${
            puffin.style.css`
                &{
                    background:yellow;
                    margin:3px;
                    flex:1;
                    min-width:1px;
                    overflow:hidden;
                }
            `
        }">
            <Resizer/>
            <PanelBody/>
        </div>
    `,{
        components:{
            PanelBody,
            Resizer
        }
    })

    puffin.render(PanelComp,document.getElementById("mainpanel"))
}

console.log(Panel)
export default Panel
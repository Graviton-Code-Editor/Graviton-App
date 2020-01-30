import PanelBody from '../components/panel/panel'
import {puffin} from '@mkenzo_8/puffin'
import Resizer from '../components/panel/resizer.horizontally'
import RunningConfig from 'RunningConfig'

console.log(RunningConfig)
function Panel(){
    const randomSelector = Math.random()
    const PanelComp = puffin.element(`
        <div id="${randomSelector}" class="${
            puffin.style.css`
                &{
                    flex:1;
                    min-width:1px;
                    overflow:hidden;
                    box-shadow:-2px 0px 5px rgba(0,0,0,0.2);
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

    return {
        element:document.getElementById(randomSelector).children[1]
    }
}

export default Panel
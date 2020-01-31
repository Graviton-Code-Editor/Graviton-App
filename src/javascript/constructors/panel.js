import PanelBody from '../components/panel/panel'
import {puffin} from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'

function Panel(){
    const randomSelector = Math.random()
    const PanelComp = puffin.element(`
        <div id="${randomSelector}" click="$focusPanel" class="${
            puffin.style.css`
                &{
                    flex:1;
                    min-width:1px;
                    overflow:hidden;
                    box-shadow:-2px 0px 5px rgba(0,0,0,0.2);
                    border-top-left-radius:5px;
                    max-height:100%;
                    min-height:100%;
                    display:flex;
                    flex-direction:column;
                }
            `
        }">    
            <div class="tabsbar ${
                puffin.style.css`
                    &{
                        max-height:40px;
                        white-space:nowrap;
                        display:flex;
                        flex:1;
                    }
                `
            }"></div>
            <PanelBody/>
        </div>
    `,{
        components:{
            PanelBody
        },
        methods:{
            focusPanel(){
                RunningConfig.data.focusedPanel = this
            }
        }
    })

    puffin.render(PanelComp,document.getElementById("mainpanel"))

    RunningConfig.data.focusedPanel = document.getElementById(randomSelector)

    return {
        element:document.getElementById(randomSelector)
    }
}

export default Panel
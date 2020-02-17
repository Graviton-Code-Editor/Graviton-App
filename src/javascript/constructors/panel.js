import PanelBody from '../components/panel/panel'
import {puffin} from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import ThemeProvider from 'ThemeProvider'
function Panel(){
    const randomSelector = Math.random()
    const PanelComp = puffin.element(`
        <div id="${randomSelector}" click="$focusPanel" class="${
            puffin.style.css`
                &{
                    flex:1;
                    min-width:1px;
                    overflow:hidden;
                    max-height:100%;
                    min-height:100%;
                    display:flex;
                    flex-direction:column;
                    border-left:1px solid rgba(150,150,150);
                }
            `
        }">    
            <div class="tabsbar ${
                puffin.style.css`
                    ${ThemeProvider}
                    &{
                        min-height:40px;
                        max-height:40px;
                        white-space:nowrap;
                        display:flex;
                        flex:1;
                        overflow-x:auto;
                        background:{{tabsbarBackground}};
                    }
                    &:empty{
                        background:transparent;
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
import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

const PanelStatusBar = puffin.element(`
    <div id="statusBar" class="${
        puffin.style.css`
            ${ThemeProvider}
            &{
                border-top:1px solid {{componentsBorder}};
                min-height:25px;
                max-height:25px;
                background:{{statusbarBackground}};
                box-sizing:border-box;
                display:flex;
                box-sizing:border-box;
                padding-top:1px;
            }
            & > div{
                width:50%;
                max-width:50%;
                flex:1;
                display:flex;
            }
            & > div:nth-child(2){
                display:flex;
                justify-content:flex-end;
            }
        `
    }">
        <div></div>
        <div></div>
    </div>
`)

export default PanelStatusBar
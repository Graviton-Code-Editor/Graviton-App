import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

const PanelBottomBar  = puffin.element(`
    <div class="${
        puffin.style.css`
            ${ThemeProvider}
            &{
                border-top:1px solid rgba(150,150,150);
                min-height:25px;
                background:{{bottombarBackground}};
                box-sizing:border-box;
            }
        `
    }">

    </div>
`)

export default PanelBottomBar
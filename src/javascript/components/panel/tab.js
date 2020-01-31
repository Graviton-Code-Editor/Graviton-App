import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

const TabBody  = puffin.element(`
    <div class="${
        puffin.style.css`
            ${ThemeProvider}
            &{
                height:40px;
                background:{{tabBackground}};
                width:150px;
                display:flex;
                justify-content:center;
                align-items:center;
                cursor:pointer;
            }
            & p{
                margin:0;
            }
            &[active="true"]{
                background:{{tabActiveBackground}};
            }
        `
    }">

    </div>
`)

export default TabBody
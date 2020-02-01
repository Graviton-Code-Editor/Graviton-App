import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

const TabBody  = puffin.element(`
    <div class="${
        puffin.style.css`
            ${ThemeProvider}
            &{
                height:40px;
                background:{{tabBackground}};
                min-width:100px;
                width:auto;
                max-width:150px;
                display:flex;
                justify-content:flex-start;
                align-items:center;
                cursor:pointer;
                padding:0px 10px;
            }
            & p{
                margin:0;
                font-size:14px;
                height:17px;
                position:relative;
            }
            & svg{
                margin-left:5px;
                min-height:12px;
                min-width:12px;
                right:0;
                flex:1;
            }
            &[active="true"]{
                background:{{tabActiveBackground}};
            }
        `
    }">

    </div>
`)

export default TabBody
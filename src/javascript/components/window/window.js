import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from '../../utils/themeprovider'

const WindowBody = puffin.element(`
    <div class="${puffin.style.css`
    ${ThemeProvider}
        &{
            border:1px solid {{windowBorder}};
            width:200px;
            max-width: 80%;
            max-height: 75%;
            background: {{windowBackground}};
            border-radius: 7px;
            overflow:auto;
            position:absolute;
            height:auto;
            display:flex;
        }
        & * {
            color:{{textColor}};
        }
    `}">
        
    </div>
`)

export default WindowBody
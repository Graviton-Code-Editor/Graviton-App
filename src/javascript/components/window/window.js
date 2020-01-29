import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from '../../utils/themeprovider'

const WindowBody = puffin.element(`
    <div class="${puffin.style.css`
    ${ThemeProvider}
        &{
            border:1px solid gray;
            width:200px;
            min-width:60%;
            max-width: 80%;
            min-height: 80%;
            max-height: 60%;
            background: {{windowBackground}};
            border-radius: 7px;
            overflow:auto;
            position:absolute;
        }
    `}">
        
    </div>
`)

export default WindowBody
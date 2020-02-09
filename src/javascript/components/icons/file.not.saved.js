import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

const UnSavedIcon = puffin.element(`
    <div class="${puffin.style.css`
        ${ThemeProvider}
        &{
           background:{{fileNotSavedIndicator}};
           height:10px;
           width:10px;
           border-radius:100px;
        }
        &:hover{
            background:{{fileNotSavedIndicatorHovering}};
        }
    `}"></div>
    
`)

export default UnSavedIcon
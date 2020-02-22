import { puffin } from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

const StatusBarItemBody = puffin.element(`
    <button class="${puffin.style.css`
        ${ThemeProvider}
        &{
            min-height:100%;
            display:block;
            margin:0;
            padding:0 6px;
            background:{{statusbarItemBackground}};
            color:{{statusbarItemText}};
            border:0px;
            white-space:nowrap;
        }
        &:hover{
            background:{{statusbarItemHoveringBackground}};
            color:{{statusbarItemHoveringText}};
        }
    `}">

    </button>
`)


export default StatusBarItemBody
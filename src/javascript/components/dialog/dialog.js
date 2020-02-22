import ThemeProvider from 'ThemeProvider'
import {puffin} from '@mkenzo_8/puffin'

const DialogBody = new puffin.element(`
    <div class="${puffin.style.css`
        ${ThemeProvider}
        &{
            border:1px solid gray;
            width:200px;
            min-width:25%;
            max-width: 45%;
            min-height: 15%;
            max-height: 35%;
            background: {{windowBackground}};
            border-radius: 7px;
            overflow:auto;
            position:absolute;
            padding:10px;
        }
        & > div{
            display:flex;
            justify-content:flex-end;
        }
        & button {
            padding:8px 13px;
        }
    `}"/>
`)

export default DialogBody
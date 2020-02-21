import { puffin } from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

function Input(){
    return puffin.style.input`
        ${ThemeProvider}
        &{
            background:{{inputBackground}};
            border-radius:4px;
            padding:6px;
            border:0px;
            color:{{inputText}};
        }
    `
}

export default Input
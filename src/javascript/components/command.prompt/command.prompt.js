import { puffin } from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

const CommandPromptBody = puffin.style.div`
    ${ThemeProvider}
    &{
        min-height:100%;
        min-width:100%;
        display:flex;
        justify-content: center;
        top:0;
        left:0; 
        position:fixed;
    }
    & input{
        background:{{commandPromptInputBackground}};
        color:{{sidemenuSearcherText}};
        border:0px;
        padding:7px;
        margin:0 auto;
        border-radius:5px;
        margin:0;
        max-width:100%;
        display:block;
        white-space:prewrap;
        font-size:13px;
    }
    & .container{
        flex:1;
        position:absolute;
        top:100px;
        max-height:80%;
        max-width:175px;
        margin:0 auto;
        justify-content:center;
        align-items:center;
        display:flex;
        flex-direction:column;
        background:{{commandPromptBackground}};
        padding:7px;
        border-radius:6px;
    }
    & .container > div{
        display:flex;
        flex-direction:column;
        min-width:100%;
        background:inherit;
        margin-top:5px;
        max-width:100%;
    }
    & .container > div > div{
        min-width:auto;
        flex:1;
        background:inherit;
        max-width:100%;
        
    }
    & a{
        overflow:hidden;
        text-overflow:ellipsis;
        font-size:14px;
        white-space:nowrap;
        display:block;
        padding:7px 8px;
        background:{{commandPromptOptionBackground}};
        color:{{commandPromptOptionText}};
        border-radius:5px;
        margin:1px 0px;
    }
    &  a.active{
        background:{{commandPromptOptionActiveBackground}};
        color:{{commandPromptOptionActiveText}};
    }
`


export default CommandPromptBody
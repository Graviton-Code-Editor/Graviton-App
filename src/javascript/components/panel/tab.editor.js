import { puffin } from '@mkenzo_8/puffin'

const TabEditor  = puffin.element(`
    <div class="${
        puffin.style.css`
            &{
               min-height:100%;
               max-height:100%;
               display:flex;
            }
            & .CodeMirror {
                min-height:100%;
                flex:1;
            }
            & .CodeMirror-scroll{
                overflow-x:hidden;
            }
        `
    }"/>
`)

export default TabEditor
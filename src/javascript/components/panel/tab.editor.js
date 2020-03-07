import { puffin } from '@mkenzo_8/puffin'

const TabEditor  = puffin.element(`
    <div class="${
        puffin.style.css`
            &{
               min-height:100%;
               max-height:100%;
            }
            & .CodeMirror {
                min-height:100%;
            }
            & .CodeMirror-scroll{
                overflow-x:hidden;
            }
        `
    }"/>
`)

export default TabEditor
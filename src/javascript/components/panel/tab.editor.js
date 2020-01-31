import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

const TabEditor  = puffin.element(`
    <div test="ok" class="${
        puffin.style.css`
            ${ThemeProvider}
            &{
               min-height:100%;
            }
            & .CodeMirror {
                min-height:100%;
            }
            & .CodeMirror-scroll{
                overflow-x:hidden;
            }
        `
    }">

    </div>
`)

export default TabEditor
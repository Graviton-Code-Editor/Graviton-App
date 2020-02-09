import {puffin} from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'

const PanelBody  = puffin.element(`
    <div click="$focusPanel" class="${
        puffin.style.css`
            &{
                max-height:100%;
                overflow:auto;
            }
        `
    }">

    </div>
`)

export default PanelBody
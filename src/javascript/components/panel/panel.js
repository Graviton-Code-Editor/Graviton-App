import {puffin} from '@mkenzo_8/puffin'

const PanelBody  = puffin.element(`
    <div ok="true" class="${
        puffin.style.css`
            &{
                display:flex;
                align-items:center;
                justify-content:center;
                min-height:100%;
            }
        `
    }">
        <b>panel</b>
    </div>
`)

export default PanelBody
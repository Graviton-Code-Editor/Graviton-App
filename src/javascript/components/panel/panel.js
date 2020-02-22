import {puffin} from '@mkenzo_8/puffin'

const PanelBody  = puffin.element(`
    <div click="$focusPanel" class="${
        puffin.style.css`
            &{
                flex:1;
                max-height:100%;
                overflow:auto;
            }
        `
    }"/>
`)

export default PanelBody
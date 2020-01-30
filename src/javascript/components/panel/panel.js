import {puffin} from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'

const PanelBody  = puffin.element(`
    <div click="$focusPanel" class="${
        puffin.style.css`
            &{
                min-height:100%;
            }
        `
    }">

    </div>
`,{
    methods:{
        focusPanel(){
            RunningConfig.data.focusedPanel = this
        }
    }
})

export default PanelBody
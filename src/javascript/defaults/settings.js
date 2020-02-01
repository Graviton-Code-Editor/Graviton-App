import {puffin} from '@mkenzo_8/puffin'
import Window from '../constructors/window'
import {Titles , RadioGroup } from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'

const SettingsPage = puffin.element(`
    <div>
        <H1>Settings</H1>
        <RadioGroup radioSelected="$selected">
            <label name="Arctic" checked="">Arctic</label>
            <label name="Night">Night</label>
        </RadioGroup>
    </div>
`,{
    components:{
        RadioGroup,
        H1:Titles.h1
    },
    methods:{
        selected(e){
            const newTheme = e.detail.target.getAttribute("name")

            StaticConfig.data.theme = newTheme
        }
    }
})

const SettingsWindow = new Window({
    component:SettingsPage
})

export default SettingsWindow
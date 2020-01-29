import {puffin} from '@mkenzo_8/puffin'
import Window from '../constructors/window'
import {Titles , RadioGroup } from '@mkenzo_8/puffin-drac'
import ConfigProvider from 'ConfigProvider'
console.log(ConfigProvider)

const SettingsPage = puffin.element(`
    <div>
        <H1>Settings</H1>
        <RadioGroup radioSelected="$selected">
            <label name="arctic" checked="">Arctic</label>
            <label name="dark">Dark</label>
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

            ConfigProvider.data.theme = newTheme
        }
    }
})

const SettingsWindow = new Window({
    component:SettingsPage
})

export default SettingsWindow
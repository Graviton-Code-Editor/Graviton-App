import {puffin} from '@mkenzo_8/puffin'
import Window from '../constructors/window'
import {Titles , RadioGroup } from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'
import SideMenu from '../components/window/side.menu'

const SettingsPage = puffin.element(`
    <SideMenu default="customization">
        <div>
            <H1>Settings</H1>
            <label to="customization">Customization</label>
            <label to="about">About</label>
        </div>
        <div>
            <div href="customization">
                <RadioGroup radioSelected="$selected">
                    <label name="Arctic" checked="">Arctic</label>
                    <label name="Night">Night</label>
                </RadioGroup>
            </div>
            <div href="about">
                <p>Graviton is a modern looking code editor.</p>
            </div>
        </div>
    </SideMenu>
`,{
    components:{
        RadioGroup,
        H1:Titles.h1,
        SideMenu
    },
    methods:{
        selected(e){
            const newTheme = e.detail.target.getAttribute("name")
            
            if( StaticConfig.data.theme != newTheme)
                StaticConfig.data.theme = newTheme
        }
    }
})

const SettingsWindow = new Window({
    component:SettingsPage
})

export default SettingsWindow
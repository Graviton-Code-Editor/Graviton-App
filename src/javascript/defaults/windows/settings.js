import {puffin} from '@mkenzo_8/puffin'
import Window from '../../constructors/window'
import {Titles , RadioGroup, Text} from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'
import SideMenu from '../../components/window/side.menu'
import ExtensionsRegistry from 'ExtensionsRegistry'
import LanguageConfig from 'LanguageConfig'
import Languages from '../../../../languages/*.json'

function Settings(){
    const SettingsPage = puffin.element(`
        <SideMenu default="customization">
            <div>
                <H1 lang-string="Settings"></H1>
                <label to="customization" lang-string="Customization"></label>
                <label to="languages" lang-string="Languages"></label>
                <label to="about" lang-string="About"></label>
            </div>
            <div>
                <div href="customization">
                    <H3 lang-string="Themes"></H3>
                    <RadioGroup radioSelected="$selectedTheme">
                        ${(function(){
                            let content = "";
                            const list = ExtensionsRegistry.registry.data.list
                            Object.keys(list).map(function(extension){
                                const pkg = ExtensionsRegistry.registry.data.list[extension]
                                if(pkg.type == "theme"){
                                    content +=`
                                        <label name="${extension}" checked="${StaticConfig.data.theme == extension?'':'false'}">${extension}</label>
                                    `
                                }
                            })
                            return content
                        })()}
                    </RadioGroup>
                </div>
                <div href="languages">
                    <H3 lang-string="Languages"></H3>
                    <RadioGroup radioSelected="$selectedLanguage">
                        ${(function(){
                            let content = "";
                            Object.keys(Languages).map(function(lang){
                                content +=`
                                    <label name="${lang}" checked="${StaticConfig.data.language == lang?'':'false'}">${lang}</label>
                                `
                            })
                            return content
                        })()}
                    </RadioGroup>
                </div>
                <div href="about">
                    <H3 lang-string="About"></H3>
                    <Text>Graviton is a modern looking code editor.</Text>
                </div>
            </div>
        </SideMenu>
    `,{
        components:{
            RadioGroup,
            H1:Titles.h1,
            H3:Titles.h3,
            SideMenu,
            Text
        },
        methods:{
            selectedTheme(e){
                const newTheme = e.detail.target.getAttribute("name")
                
                if( StaticConfig.data.theme != newTheme)
                    StaticConfig.data.theme = newTheme
            },
            selectedLanguage(e){
                const newLanguage = e.detail.target.getAttribute("name")
                
                if( StaticConfig.data.language != newLanguage)
                    StaticConfig.data.language = newLanguage
            }
        },
        addons:{
            lang:puffin.lang(LanguageConfig)
        }
    })

    return new Window({
        component:SettingsPage
    })
}


export default Settings
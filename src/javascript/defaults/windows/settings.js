import {puffin} from '@mkenzo_8/puffin'
import Window from '../../constructors/window'
import {Titles , RadioGroup, Text, Card, Button} from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'
import SideMenu from '../../components/window/side.menu'
import SideMenuSearcher from '../../components/window/side.menu.searcher'
import PluginsRegistry from 'PluginsRegistry'
import { LanguageState, getTranslation } from 'LanguageConfig'
import Languages from '../../../../languages/*.json'
import Switch from '../../components/switch'
import configEditor from '../tabs/config.editor.js'

function Settings(){
	const pluginsList = PluginsRegistry.registry.data.list
	const SettingsPage = puffin.element(`
		<SideMenu default="customization">
			<div>
				<H1 lang-string="Settings"></H1>
				<SideMenuSearcher/>
				<label to="customization" lang-string="Customization"></label>
				<label to="languages" lang-string="Languages"></label>
				<label to="about" lang-string="About"></label>
			</div>
			<div>
				<div href="customization">
					<div href="themes">
						<H4 lang-string="Themes"/>
							<RadioGroup radioSelected="$selectedTheme" direction="vertically" styled="false">
								${Object.keys(pluginsList).map(function(pluginName){
									const pkg = pluginsList[pluginName]
									if(pkg.type == "theme"){
										return `
										<label styled="false" hidden-radio="true" name="${pluginName}" checked="${StaticConfig.data['app.theme'] == pluginName?'':'false'}">
											<Card style="font-size:13px;">${pluginName}</Card>
										</label>
										`
									}
								})}
							</RadioGroup>
						</div>   
					<div href="file watcher">
						<H4>File Watcher</H4>
						<Switch toggled="$toggledFileWatcher" default="${StaticConfig.data.editorFSWatcher}" label="File watcher"/>
					</div>
					<div href="autocomplete">
						<H4>Autocomplete</H4>
						<Switch toggled="$toggledAutoComplete" default="${StaticConfig.data.editorAutocomplete}" label="Autocomplete"/>
					</div>
					<div href="manual config">
						<H4>Manual editing</H4>
						<Button click="$configeditor">Edit configuration</Button>
					</div>
				</div>
				<div href="languages">
					<div href="languages">
						<H4 lang-string="Languages"></H4>
						<RadioGroup radioSelected="$selectedLanguage">
							${Object.keys(Languages).map(function(lang){
								return `
									<label name="${lang}" checked="${StaticConfig.data.appLanguage == lang?'':'false'}">${lang}</label>
								`
							}).join("")}
						</RadioGroup>
					</div>
				</div>
				<div href="about">
					<div href="about">
						<H4 lang-string="About"></H4>
						<Text>Graviton is a modern looking code editor.</Text>
						</div>
				</div>
			</div>
		</SideMenu>
	`,{
		components:{
			RadioGroup,
			H1:Titles.h1,
			H4:Titles.h4,
			SideMenu,
			Text,
			SideMenuSearcher,
			Switch,
			Card,
			Button
		},
		methods:{
			configeditor(){
				configEditor()	
				SettingsWindow.close()
			},
			selectedTheme(e){
				const newTheme = e.detail.target.getAttribute("name")
				if( StaticConfig.data.appTheme != newTheme)
					StaticConfig.data.appTheme = newTheme
			},
			selectedLanguage(e){
				const newLanguage = e.detail.target.getAttribute("name")
				if( StaticConfig.data.appLanguage != newLanguage)
					StaticConfig.data.appLanguage = newLanguage
			},
			toggledFileWatcher(){
				if( this.props.status != StaticConfig.data.editorFSWatcher ) {
					StaticConfig.data.editorFSWatcher = this.props.status
				}
			},
			toggledAutoComplete(){
				if( this.props.status != StaticConfig.data.editorAutocomplete ) {
					StaticConfig.data.editorAutocomplete = this.props.status
				}
			}
		},
		addons:{
			lang:puffin.lang(LanguageState)
		}
	}) 
	const SettingsWindow = new Window({
		title:'settings',
		component:SettingsPage
	})
	return SettingsWindow
}

export default Settings
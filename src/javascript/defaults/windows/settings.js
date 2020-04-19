import { element, style, render } from '@mkenzo_8/puffin'
import { Titles , RadioGroup, Text, Card, Button } from '@mkenzo_8/puffin-drac'
import { LanguageState, getTranslation } from 'LanguageConfig'
import Window from '../../constructors/window'
import StaticConfig from 'StaticConfig'
import SideMenu from '../../components/window/side.menu'
import SideMenuSearcher from '../../components/window/side.menu.searcher'
import PluginsRegistry from 'PluginsRegistry'
import Languages from '../../../../languages/*.json'
import Switch from '../../components/switch'
import configEditor from '../tabs/config.editor.js'

function Settings(){
	const pluginsList = PluginsRegistry.registry.data.list
	function SettingsPage(){
		return element({
			components:{
				RadioGroup,
				H1:Titles.h1,
				H4:Titles.h4,
				SideMenu,
				Text,
				Card,
				Button,
				Switch,
				SideMenuSearcher
			}
		})`
			<SideMenu default="customization">
				<div>
					<H1 lang-string="Settings">Settings</H1>
					<SideMenuSearcher/>
					<label to="customization" lang-string="Customization">Customization</label>
					<label to="languages" lang-string="Languages">Languages</label>
					<label to="about" lang-string="About">About</label>
				</div>
				<div>
					<div href="customization">
						<div href="themes">
							<H4 lang-string="Themes"/>
								<RadioGroup :radioSelected="${selectedTheme}" direction="vertically" styled="false">
									${Object.keys(pluginsList).map(function(pluginName){
										const pkg = pluginsList[pluginName]
										if(pkg.type == "theme"){
											return element({
												components:{
													Card
												}
											})`
											<label styled="false" hidden-radio="true" name="${pluginName}" checked="${StaticConfig.data['app.theme'] == pluginName?'':'false'}">
												<Card style="font-size:13px;">${pluginName}</Card>
											</label>
											`
										}
									}).filter(Boolean)}
								</RadioGroup>
							</div>   
						<div href="file watcher">
							<H4>File Watcher</H4>
							<Switch :toggled="${toggledFileWatcher}" status="${{"default":StaticConfig.data.editorFSWatcher}}" label="File watcher"></Switch>
						</div>
						<div href="autocomplete">
							<H4>Autocomplete</H4>
							<Switch :toggled="${toggledAutoComplete}" status="${{"default":StaticConfig.data.editorAutocomplete}}" label="Autocomplete"></Switch>
						</div>
						<div href="manual config">
							<H4>Manual editing</H4>
							<Button :click="${configeditor}">Edit configuration</Button>
						</div>
					</div>
					<div href="languages">
						<div href="languages">
							<H4 lang-string="Languages"></H4>
							<RadioGroup>
								${Object.keys(Languages).map(function(lang){
									return element`
										<label name="${lang}" checked="${StaticConfig.data.appLanguage == lang?'true':'false'}">${lang}</label>
									`
								})}	
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
		`
	}
	function configeditor(){
		configEditor()	
		SettingsWindow.close()
	}
	function selectedTheme(e){
		const newTheme = e.detail.target.getAttribute("name")
		if( StaticConfig.data.appTheme != newTheme)
			StaticConfig.data.appTheme = newTheme
	}
	function selectedLanguage(e){
		const newLanguage = e.detail.target.getAttribute("name")
		if( StaticConfig.data.appLanguage != newLanguage)
			StaticConfig.data.appLanguage = newLanguage
	}
	function toggledFileWatcher(){
		if( this.props.status != StaticConfig.data.editorFSWatcher ) {
			StaticConfig.data.editorFSWatcher = this.props.status
		}
	}
	function toggledAutoComplete(){
		if( this.props.status != StaticConfig.data.editorAutocomplete ) {
			StaticConfig.data.editorAutocomplete = this.props.status
		}
	}
	const SettingsWindow = new Window({
		title:'settings',
		component:SettingsPage
	})
	return SettingsWindow
}

export default Settings
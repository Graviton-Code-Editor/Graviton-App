import { element, style, render, lang } from '@mkenzo_8/puffin'
import { Titles, RadioGroup, Text, Card, Button } from '@mkenzo_8/puffin-drac'
import { LanguageState, getTranslation } from 'LanguageConfig'
import Window from '../../constructors/window'
import StaticConfig from 'StaticConfig'
import SideMenu from '../../components/window/side.menu'
import SideMenuSearcher from '../../components/window/side.menu.searcher'
import PluginsRegistry from 'PluginsRegistry'
import Languages from '../../../../languages/*.json'
import Switch from '../../components/switch'
import configEditor from '../tabs/config.editor.js'
import ThemeCard from '../settings/components/theme.card'

function Settings() {
	const pluginsList = PluginsRegistry.registry.data.list
	function SettingsPage() {
		return element({
			components: {
				RadioGroup,
				H1: Titles.h1,
				H4: Titles.h4,
				SideMenu,
				Text,
				Button,
				Switch,
				SideMenuSearcher,
			},
		})`
			<SideMenu default="customization">
				<div>
					<h1 lang-string="windows.Settings.Settings"/>
					<SideMenuSearcher/>
					<label to="customization" lang-string="windows.Settings.Customization.Customization"/>
					<label to="advanced" lang-string="windows.Settings.Advanced.Advanced"/>
					<label to="languages" lang-string="windows.Settings.Languages"/>
					<label to="about" lang-string="windows.Settings.About.About"/>
				</div>
				<div>
					<div href="customization">
						<div href="themes">
							<H4 lang-string="windows.Settings.Customization.Themes"/>
								<RadioGroup :radioSelected="${selectedTheme}" direction="vertically" styled="false">
									${Object.keys(pluginsList)
										.map(pluginName => {
											const pluginInfo = pluginsList[pluginName]
											if (pluginInfo.type === 'theme') {
												return element({
													components: {
														ThemeCard,
													},
												})`
											<label styled="false" hidden-radio="true" name="${pluginName}" checked="${StaticConfig.data['app.theme'] == pluginName ? '' : 'false'}">
												<ThemeCard style="font-size:13px;" themeInfo="${pluginInfo}"></ThemeCard>
											</label>
											`
											}
										})
										.filter(Boolean)}
								</RadioGroup>
						</div>   
					</div>
					<div href="advanced">
						<div href="file watcher">
							<H4 lang-string="windows.Settings.Advanced.FileWatcher"/>
							<Switch :toggled="${toggledFileWatcher}" status="${{
			default: StaticConfig.data.editorFSWatcher,
		}}" label="File watcher"></Switch>
						</div>
						<div href="autocomplete">
							<H4 lang-string="windows.Settings.Advanced.Autocomplete"/>
							<Switch :toggled="${toggledAutoComplete}" status="${{
			default: StaticConfig.data.editorAutocomplete,
		}}" label="Autocomplete"></Switch>
						</div>
						<div href="wrap lines">
							<H4>Wrap lines</H4>
							<Switch :toggled="${toggledWrapLines}" status="${{
			default: StaticConfig.data.editorWrapLines,
		}}" label="Wrap lines"></Switch>
						</div>
						<div href="manual config">
							<H4>Manual editing</H4>
							<Button :click="${configeditor}">Edit configuration</Button>
						</div>
					</div>
					<div href="languages">
						<div href="languages">
							<RadioGroup :radioSelected="${selectedLanguage}">
								${Object.keys(Languages).map(lang => {
									return element`
										<label name="${lang}" checked="${StaticConfig.data.appLanguage === lang}">${lang}</label>
									`
								})}
							</RadioGroup>
						</div>
					</div>
					<div href="about">
						<div href="about">
							<H4 lang-string="windows.Settings.About.About"/>
							<Text lang-string="windows.Settings.About.GravitonDescription"/>
						</div>
					</div>
				</div>
			</SideMenu>
		`
	}
	function configeditor() {
		configEditor()
		SettingsWindow.close()
	}
	function selectedTheme(e) {
		const newTheme = e.detail.target.getAttribute('name')
		if (StaticConfig.data.appTheme != newTheme) StaticConfig.data.appTheme = newTheme
	}
	function selectedLanguage(e) {
		const newLanguage = e.detail.target.getAttribute('name')
		if (StaticConfig.data.appLanguage != newLanguage) StaticConfig.data.appLanguage = newLanguage
	}
	function toggledFileWatcher(e) {
		if (e.detail.status !== StaticConfig.data.editorFSWatcher) {
			StaticConfig.data.editorFSWatcher = e.detail.status
		}
	}
	function toggledWrapLines(e) {
		if (e.detail.status !== StaticConfig.data.editorWrapLines) {
			StaticConfig.data.editorWrapLines = e.detail.status
		}
	}
	function toggledAutoComplete(e) {
		if (e.detail.status !== StaticConfig.data.editorAutocomplete) {
			StaticConfig.data.editorAutocomplete = e.detail.status
		}
	}
	const SettingsWindow = new Window({
		title: 'settings',
		component: SettingsPage,
	})
	return SettingsWindow
}

export default Settings

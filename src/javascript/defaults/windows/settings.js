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
import IconpackCard from '../settings/components/iconpack.card'

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
							<div style="overflow:auto; height: auto; padding: 3px 0;">
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
												<label styled="false" hidden-radio="true" name="${pluginName}" checked="${StaticConfig.data.appTheme == pluginName}">
													<ThemeCard style="font-size:13px;" themeInfo="${pluginInfo}"/>
												</label>
												`
											}
										})
										.filter(Boolean)}
								</RadioGroup>
							</div>
						</div>  
						<div href="iconpacks">
							<div style="overflow:auto; height: auto; padding: 3px 0;">
								<H4 lang-string="windows.Settings.Customization.Iconpacks"/>
								<RadioGroup :radioSelected="${selectedIconpack}" direction="vertically" styled="false">
									${Object.keys(pluginsList)
										.map(pluginName => {
											const pluginInfo = pluginsList[pluginName]
											if (pluginInfo.type === 'iconpack') {
												return element({
													components: {
														IconpackCard,
													},
												})`
												<label styled="false" hidden-radio="true" name="${pluginName}" checked="${StaticConfig.data.appIconpack == pluginName}">
													<IconpackCard style="font-size:13px;" iconpackInfo="${pluginInfo}"/>
												</label>
												`
											}
										})
										.filter(Boolean)}
								</RadioGroup>
							</div>
						</div>
					</div>
					<div href="advanced">
						<div href="file watcher">
							<H4 lang-string="windows.Settings.Advanced.FileWatcher"/>
							<Switch :toggled="${toggledFileWatcher}" data="${{ default: StaticConfig.data.editorFSWatcher, label: 'windows.Settings.Advanced.FileWatcher' }}"/>
						</div>
						<div href="autocomplete">
							<H4 lang-string="windows.Settings.Advanced.Autocomplete"/>
							<Switch :toggled="${toggledAutoComplete}" data="${{ default: StaticConfig.data.editorAutocomplete, label: 'windows.Settings.Advanced.Autocomplete' }}"/>
						</div>
						<div href="wrap lines">
							<H4 lang-string="windows.Settings.Advanced.WrapLines"/>
							<Switch :toggled="${toggledWrapLines}" data="${{ default: StaticConfig.data.editorWrapLines, label: 'windows.Settings.Advanced.WrapLines' }}"/>
						</div>
						<div href="indentation">
							<H4 lang-string="windows.Settings.Advanced.Indentation.Indentation"/>
							<RadioGroup :radioSelected="${selectedIndentation}">
								<label measure="tab" checked="${StaticConfig.data.editorIndentation == 'tab'}">Tab</label>
								<label measure="space" checked="${StaticConfig.data.editorIndentation == 'space'}">Space</label>
							</RadioGroup>
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
									const languageName = Languages[lang].name
									return element`
										<label name="${lang}" checked="${StaticConfig.data.appLanguage === lang}">${languageName}</label>
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
	function selectedIndentation(e) {
		const newIdentation = e.detail.target.getAttribute('measure')
		if (StaticConfig.data.editorIndentation != newIdentation) StaticConfig.data.editorIndentation = newIdentation
	}
	function selectedTheme(e) {
		const newTheme = e.detail.target.getAttribute('name')
		if (StaticConfig.data.appTheme != newTheme) StaticConfig.data.appTheme = newTheme
	}
	function selectedIconpack(e) {
		const newIconpack = e.detail.target.getAttribute('name')
		if (StaticConfig.data.appIconpack != newIconpack) StaticConfig.data.appIconpack = newIconpack
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

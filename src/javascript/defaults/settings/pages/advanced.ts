import { element } from '@mkenzo_8/puffin'
import { Titles, RadioGroup, Button } from '@mkenzo_8/puffin-drac'
import PluginsRegistry from 'PluginsRegistry'
import StaticConfig from 'StaticConfig'
import configEditor from '../../tabs/config.editor.js'
import Switch from '../../../components/switch'

import ThemeCard from '../../../components/settings/theme.card'
import IconpackCard from '../../../components/settings/iconpack.card'

import { PuffinComponent } from 'Types/puffin.component'

export default function AdvancedPage({ closeWindow }): PuffinComponent {
	const pluginsList = PluginsRegistry.registry.data.list

	return element({
		components: {
			RadioGroup,
			H4: Titles.h4,
			Switch,
			Button,
		},
	})`
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
	`

	function configeditor() {
		configEditor()
		closeWindow()
	}
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

function selectedIndentation(e) {
	const newIdentation = e.detail.target.getAttribute('measure')
	if (StaticConfig.data.editorIndentation != newIdentation) StaticConfig.data.editorIndentation = newIdentation
}

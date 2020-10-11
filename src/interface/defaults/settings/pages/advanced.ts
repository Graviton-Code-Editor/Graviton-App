import StaticConfig from 'StaticConfig'
import configEditor from '../../tabs/config.editor'
import restartConfigDialog from '../../dialogs/restart_config'

export default function Advanced({ closeWindow }) {
	return {
		file_watcher: [
			{
				type: 'title',
				label: 'windows.Settings.Advanced.FileWatcher',
			},
			{
				type: 'switch',
				key: 'editorFSWatcher',
				label: 'windows.Settings.Advanced.FileWatcher',
			},
		],
		autocomplete: [
			{
				type: 'title',
				label: 'windows.Settings.Advanced.Autocomplete',
			},
			{
				type: 'switch',
				key: 'editorAutocomplete',
				label: 'windows.Settings.Advanced.Autocomplete',
			},
		],
		'wrap lines': [
			{
				type: 'title',
				label: 'windows.Settings.Advanced.WrapLines',
			},
			{
				type: 'switch',
				key: 'editorWrapLines',
				label: 'windows.Settings.Advanced.WrapLines',
			},
		],
		indentation: [
			{
				type: 'title',
				label: 'windows.Settings.Advanced.Indentation.Indentation',
			},
			{
				type: 'radioGroup',
				key: 'editorIndentation',
				radios: [
					{
						checked: true,
						label: 'Tab',
					},
					'Space',
				],
			},
		],
		'experimental lsp': [
			{
				type: 'title',
				label: 'Experimental LSP',
			},
			{
				type: 'switch',
				key: 'experimentalEditorLSP',
				label: 'Enable LSP',
			},
		],
		'manual config': [
			{
				type: 'title',
				label: 'windows.Settings.Advanced.ManualConfig.ManualConfig',
			},
			{
				type: 'button',
				label: 'windows.Settings.Advanced.ManualConfig.EditConfiguration',
				onClick() {
					configEditor()
					closeWindow()
				},
			},
		],
		'restart config': [
			{
				type: 'title',
				label: 'windows.Settings.Advanced.RestartConfig.RestartConfig',
			},
			{
				type: 'button',
				label: 'windows.Settings.Advanced.RestartConfig.RestartConfig',
				onClick() {
					restartConfigDialog()
					closeWindow()
				},
			},
		],
	}
}

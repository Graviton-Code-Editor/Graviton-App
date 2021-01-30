import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import configEditor from '../../tabs/config.editor'
import restartConfigDialog from '../../dialogs/restart_config'

export default function Advanced({ closeWindow }) {
	return {
		Explorer: [
			{
				type: 'title',
				label: 'windows.Settings.Advanced.Explorer',
				disabled: RunningConfig.data.isBrowser,
			},
			{
				type: 'section',
				disabled: RunningConfig.data.isBrowser,
				content: [
					{
						type: 'switch',
						key: 'editorFSWatcher',
						label: 'windows.Settings.Advanced.FileWatcher',
					},
					{
						type: 'switch',
						key: 'editorGitIntegration',
						label: 'windows.Settings.Advanced.GitIntegration',
					},
					{
						type: 'switch',
						key: 'experimentalSourceTracker',
						label: 'windows.Settings.Advanced.SourceTracker',
					},
				],
			},
		],
		Editor: [
			{
				type: 'title',
				label: 'windows.Settings.Advanced.Editor',
			},
			{
				type: 'section',
				content: [
					{
						type: 'title',
						label: 'windows.Settings.Advanced.Indentation.Indentation',
					},
					{
						type: 'radioGroup',
						key: 'editorIndentation',
						radios: [
							{
								checked: StaticConfig.data.editorIndentation === 'tab',
								key: 'tab',
								label: 'windows.Settings.Advanced.Indentation.Tab',
							},
							{
								checked: StaticConfig.data.editorIndentation === 'space',
								key: 'space',
								label: 'windows.Settings.Advanced.Indentation.Space',
							},
						],
					},
					{
						type: 'switch',
						key: 'editorWrapLines',
						label: 'windows.Settings.Advanced.WrapLines',
					},
					{
						type: 'switch',
						disabled: RunningConfig.data.isBrowser,
						key: 'experimentalEditorLSP',
						label: 'windows.Settings.Advanced.LSPIntegration',
					},
					{
						type: 'switch',
						key: 'editorAutocomplete',
						label: 'windows.Settings.Advanced.Autocomplete',
					},
					{
						type: 'switch',
						key: 'editorFold',
						label: 'windows.Settings.Advanced.FoldBlocks',
					},
				],
			},
		],
		'manual config': [
			{
				type: 'title',
				label: 'windows.Settings.Advanced.Configuration',
			},
			{
				type: 'button',
				label: 'windows.Settings.Advanced.ManualConfig.EditConfiguration',
				onClick() {
					configEditor()
					closeWindow()
				},
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

import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import PluginsRegistry from 'PluginsRegistry'
import CommandPrompt from '../../constructors/command.prompt'
import * as path from 'path'
import Core from 'Core'
const { fs } = Core
import Tab from '../../constructors/tab'
import Editor from '../../constructors/editor'
import normalizeDir from '../../utils/directory_normalizer'
import getFormat from '../../utils/format_parser'

const focusCurrentEditor = () => RunningConfig.data.focusedEditor.client.do('doFocus', { instance: RunningConfig.data.focusedEditor.instance })
const currentEditorExists = () => RunningConfig.data.focusedEditor !== null

//Command: Open Editor command prompt (default: Ctrl+I)
RunningConfig.on('command.openEditorCommandPrompt', () => {
	new CommandPrompt({
		name: 'editor',
		showInput: true,
		inputPlaceHolder: 'Enter a command',
		options: [
			{
				label: 'Save',
				action: () => {
					if (!currentEditorExists()) return
					focusCurrentEditor()
					RunningConfig.emit('command.saveCurrentFile')
				},
			},
			{
				label: 'Close',
				action: () => {
					if (!currentEditorExists()) return
					focusCurrentEditor()
					RunningConfig.emit('command.closeCurrentTab')
				},
			},
			{
				label: 'Go to line',
				action: () => {
					if (!currentEditorExists()) return
					new CommandPrompt({
						name: 'go_to_line',
						showInput: true,
						inputPlaceHolder: '',
						options: [],
						onCompleted: data => {
							RunningConfig.data.focusedEditor.client.do('setCursorPosition', {
								instance: RunningConfig.data.focusedEditor.instance,
								line: Number(data),
								char: 1,
							})
							focusCurrentEditor()
						},
					})
				},
			},
			{
				label: 'Compare changes',
				action: async () => {
					const { isEditor, instance, directory } = RunningConfig.data.focusedTab.state.data
					if (isEditor) {
						const fileDir = normalizeDir(directory)
						const fileData = await fs.readFile(fileDir, 'UTF-8')
						const projectPath = instance.projectPath
						const relativePath = path.relative(projectPath, fileDir)

						const isGitRepo = await instance.explorerProvider.isGitRepo(projectPath)

						if (!isGitRepo) return //Return if the project is not a git repository

						const lastCommit = (await instance.explorerProvider.getGitFileLastCommit(projectPath, fileDir)).latest.hash
						const commitContent = await instance.explorerProvider.getGitFileContentByObject(projectPath, lastCommit, relativePath)
						const basename = path.basename(fileDir)
						const fileExtension = getFormat(fileDir)

						const { bodyElement, tabElement, tabState, isCancelled } = new Tab({
							id: `${fileDir}_git_diff`,
							title: `${basename}'s changes`,
							isEditor: true,
							explorerProvider: instance.explorerPovider,
						})
						if (isCancelled) return //Cancels the tab opening

						new Editor({
							language: fileExtension,
							value: fileData,
							theme: PluginsRegistry.registry.data.list[StaticConfig.data.appTheme].textTheme,
							bodyElement,
							tabElement,
							tabState,
							directory: fileDir,
							options: {
								merge: true,
								mirror: commitContent,
							},
						})
					}
				},
			},
		],
	})
})

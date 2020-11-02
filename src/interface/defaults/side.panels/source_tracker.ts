import RunningConfig from 'RunningConfig'
import { render, element } from '@mkenzo_8/puffin'
import SidePanel from '../../constructors/side.panel'
import Explorer from '../../constructors/explorer'
import { basename, parse } from 'path'
import { getFileIconType } from '../../utils/get_file_icon'
import { Input, Titles, Button } from '@mkenzo_8/puffin-drac'
import ContextMenu from '../../constructors/contextmenu'
import EmojiConvertor from 'emoji-js'
import GitIcon from '../../components/icons/git'
import StaticConfig from 'StaticConfig'
import InputDialog from '../../utils/dialogs/dialog.input'
import Notification from 'Constructors/notification'

const getExplorerItems = files => {
	return files.map(file => {
		const { name, ext } = parse(file.path)
		return {
			label: file.path,
			icon: getFileIconType(name, ext.replace('.', '')),
			decorator: {
				label: file.working_dir == '?' ? 'U' : file.working_dir,
				color: 'var(--explorerItemGitNotAddedText)',
				fontSize: '11px',
			},
		}
	})
}

const getAllCommits = commits => {
	const emoji = new EmojiConvertor()
	emoji.replace_mode = 'unified'
	emoji.allow_native = true
	return commits.slice(0, 25).map(commit => {
		return {
			label: `${emoji.replace_colons(commit.message.slice(0, 25))}${commit.message.length > 25 ? '...' : ''}`,
			hint: commit.message,
			decorator: {
				label: new Date(commit.date).toLocaleString(),
			},
		}
	})
}

const showFilesAddedNotification = (projectPath: string) => {
	new Notification({
		title: 'Source Tracker',
		content: `Added files to the index in ${projectPath}`,
	})
}

const showCommitCreatedNotification = (projectPath: string) => {
	new Notification({
		title: 'Source Tracker',
		content: `Commit created in ${projectPath}`,
	})
}

const showChangesPulledNotification = (projectPath: string) => {
	new Notification({
		title: 'Source Tracker',
		content: `Pulled changes in ${projectPath}`,
	})
}

if (!RunningConfig.data.isBrowser && StaticConfig.data.experimentalSourceTracker) {
	RunningConfig.on('appLoaded', () => {
		function mounted() {
			RunningConfig.on('addFolderToRunningWorkspace', async ({ folderPath }) => {
				RunningConfig.on('loadedGitRepo', async ({ parentFolder, gitChanges, anyChanges, explorerProvider }) => {
					if (folderPath !== parentFolder) return
					let { all: allCommits } = await explorerProvider.getGitAllCommits(parentFolder)

					RunningConfig.on('gitStatusUpdated', async ({ parentFolder: folder, gitChanges: changes }) => {
						if (parentFolder === folder) {
							allCommits = (await explorerProvider.getGitAllCommits(parentFolder)).all
							gitChanges = changes
						}
					})

					const SourceTracker = Explorer({
						items: [
							{
								label: basename(folderPath),
								icon: 'folder.closed',
								contextAction(event) {
									new ContextMenu({
										list: [
											{
												label: 'Accept',
												action() {
													console.log('test')
												},
											},
										],
										event,
										parent: document.body,
									})
								},
								items: [
									{
										label: 'Options',
										items: [
											{
												label: 'Add',
												action: async function () {
													await explorerProvider.gitAdd(parentFolder, ['-A'])
													showFilesAddedNotification(parentFolder)
												},
											},
											{
												label: 'Commit',
												action: async function () {
													const commitContent = await InputDialog({
														title: 'Commit message',
														placeHolder: 'Bug fix',
													})
													await explorerProvider.gitCommit(parentFolder, commitContent)
													showCommitCreatedNotification(parentFolder)
												},
											},
											{
												label: 'Pull',
												action: async function () {
													const { current } = await explorerProvider.getGitStatus(parentFolder)
													await explorerProvider.gitPull(parentFolder, current)
													showChangesPulledNotification(parentFolder)
												},
											},
										],
									},
									{
										label: 'Changes',
										mounted({ setItems, setDecorator }) {
											RunningConfig.on('gitStatusUpdated', ({ parentFolder: folder, gitChanges }) => {
												if (parentFolder === folder) {
													setItems(getExplorerItems(gitChanges.files), false)
													setDecorator({
														label: gitChanges.files.length.toString(),
													})
												}
											})
											setItems(getExplorerItems(gitChanges.files), false)
										},
										decorator: {
											label: gitChanges.files.length == '0' ? 'Any' : gitChanges.files.length,
											color: 'var(--explorerItemGitIndicatorText)',
											background: 'var(--explorerItemGitNotAddedText)',
										},
										items: [],
									},
									{
										label: 'Last 25 Commits',
										decorator: {
											label: getCommitChangesLabel(allCommits),
											color: 'var(--explorerItemGitIndicatorText)',
											background: 'var(--explorerItemGitNotAddedText)',
										},
										mounted({ setItems, setDecorator }) {
											RunningConfig.on('gitStatusUpdated', async ({ parentFolder: folder, gitChanges }) => {
												if (parentFolder === folder) {
													const { all } = await explorerProvider.getGitAllCommits(parentFolder)
													setItems(getAllCommits(all), false)
													setDecorator({
														label: getCommitChangesLabel(all),
													})
												}
											})
											setItems(getAllCommits(allCommits), false)
										},
										items: [],
									},
								],
							},
						],
					})
					render(SourceTracker, this)
				})
			})
		}

		const { display } = new SidePanel({
			icon: GitIcon,
			panel() {
				return element`<div mounted="${mounted}"/>`
			},
			hint: 'Source Tracker',
		})
	})
}

const getCommitChangesLabel = changes => {
	return changes.length > 25 ? '25+' : changes.slice(0, 25).length
}

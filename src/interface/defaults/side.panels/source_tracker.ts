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

const getCommitChangesLabel = changes => {
	return changes.length > 25 ? '25+' : changes.slice(0, 25).length
}

const getCommitsItems = commits => {
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
	let globalCountOfChanges = 0

	let setDecorator

	const getGlobalChanges = () => {
		return globalCountOfChanges > 0 ? globalCountOfChanges : ''
	}

	const increateGlobalChanges = changes => {
		globalCountOfChanges += changes
	}

	const decreaseGlobalChanges = changes => {
		globalCountOfChanges -= changes
	}

	RunningConfig.on('appLoaded', () => {
		function mounted() {
			/*
			 * When a folder is loaded
			 */
			RunningConfig.on('addFolderToRunningWorkspace', async ({ folderPath }) => {
				/*
				 * When that folder's repository (if exists) gets loaded
				 */
				RunningConfig.on('loadedGitRepo', async ({ parentFolder, gitChanges, anyChanges, explorerProvider }) => {
					if (folderPath !== parentFolder) return
					//Load the current commits
					let { all: allCommits } = await explorerProvider.getGitAllCommits(parentFolder)

					/*
					 * Listen for any git change in that folder
					 */
					RunningConfig.on('gitStatusUpdated', async ({ parentFolder: folder, gitChanges: changes }) => {
						if (parentFolder === folder) {
							//Get new commits
							allCommits = (await explorerProvider.getGitAllCommits(parentFolder)).all
							//Remote old count
							decreaseGlobalChanges(gitChanges.files.length)
							//Update the new count
							increateGlobalChanges(changes.files.length)
							//Save the new count
							gitChanges = changes
							//Display the new count
							setDecorator({
								label: getGlobalChanges(),
							})
						}
					})
					//Set the current count
					increateGlobalChanges(gitChanges.files.length)
					//Display the current count
					setDecorator({
						label: getGlobalChanges(),
					})

					const SourceTracker = Explorer({
						items: [
							{
								label: basename(folderPath),
								icon: 'folder.closed',
								mounted() {
									const foldeRemovedWorkspaceListener = RunningConfig.on('removeFolderFromRunningWorkspace', async ({ folderPath: projectPath }) => {
										if (folderPath === projectPath) {
											// Dirty way of removing the explorer
											this.remove()
											// Decrease the count
											decreaseGlobalChanges(gitChanges.files.length)
											// Display the count
											setDecorator({
												label: globalCountOfChanges > 0 ? globalCountOfChanges : '',
											})
											// Remove the listener
											foldeRemovedWorkspaceListener.cancel()
										}
									})
								},
								items: [
									{
										label: 'Options',
										items: [
											{
												label: 'Add',
												action: async function () {
													/*
													 * Add all the files to the index
													 */
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
													/*
													 * Create a commit
													 */
													await explorerProvider.gitCommit(parentFolder, commitContent)
													showCommitCreatedNotification(parentFolder)
												},
											},
											{
												label: 'Pull',
												action: async function () {
													/*
													 * Get the current git branch
													 */
													const { current } = await explorerProvider.getGitStatus(parentFolder)
													/*
													 * Pull changes on that branch
													 */
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
													/*
													 * Display the changed files
													 */
													setItems(getExplorerItems(gitChanges.files), false)
													/*
													 * Update the changes count
													 */
													setDecorator({
														label: gitChanges.files.length.toString(),
													})
												}
											})
											/*
											 * Display the current changed files
											 */
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
													/*
													 * Get the latest commits
													 */
													const { all } = await explorerProvider.getGitAllCommits(parentFolder)
													/*
													 * Display as item each commit
													 */
													setItems(getCommitsItems(all), false)
													/*
													 * Update the commits count
													 */
													setDecorator({
														label: getCommitChangesLabel(all),
													})
												}
											})
											/*
											 * Display each current commit as item
											 */
											setItems(getCommitsItems(allCommits), false)
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
			icon(hooks) {
				setDecorator = hooks.setDecorator
				return GitIcon()
			},
			panel() {
				return element`<div mounted="${mounted}"/>`
			},
			hint: 'Source Tracker',
		})
	})
}

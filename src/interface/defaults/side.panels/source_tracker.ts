import RunningConfig from 'RunningConfig'
import { render, element } from '@mkenzo_8/puffin'
import SidePanel from '../../constructors/side.panel'
import Explorer from '../../constructors/explorer'
import { basename, parse } from 'path'
import { getFileIconType } from '../../utils/get_file_icon'
import { Input, Titles, Button, Text } from '@mkenzo_8/puffin-drac'
import ContextMenu from '../../constructors/contextmenu'
import EmojiConvertor from 'emoji-js'
import GitIcon from '../../components/icons/git'
import StaticConfig from 'StaticConfig'
import InputDialog from '../../utils/dialogs/dialog_input'
import Notification from 'Constructors/notification'
import * as path from 'path'
import { css as style } from '@emotion/css'
import ContainerPanel from '../../components/container_panel'

/*
 * Return total count of changes, if is bigger than 25, return "25+"
 */
const getCommitChangesLabel = changes => {
	return changes.length > 25 ? '25+' : changes.slice(0, 25).length
}

/*
 * Return the total of files matching the status codes or "Any" if there isn't any change
 */
const getChangesCount = (changes, statusCodes) => {
	let count = 0
	changes.forEach(({ index }) => {
		if (statusCodes.includes(index)) {
			count++
		}
	})
	if (count === 0) return 'Any'
	return count.toString()
}

/*
 * Return git changes as Explorer Items
 */
const getChangesAsItems = (changes, projectPath, statusCodes) => {
	return changes
		.map(change => {
			if (statusCodes.includes(change.index)) {
				const { name, ext } = parse(change.path)
				const filePath = path.join(projectPath, change.path)
				return {
					label: `./${change.path}`,
					icon: getFileIconType(name, ext.replace('.', '')),
					hint: filePath,
					decorator: {
						label: change.working_dir == '?' ? 'U' : change.working_dir,
						color: 'var(--explorerItemGitNotAddedText)',
						fontSize: '11px',
					},
				}
			}
		})
		.filter(Boolean)
}

/*
 * Return git commits as Explorer Items
 */
const getCommitsAsItems = commits => {
	const emoji = new EmojiConvertor()
	emoji.replace_mode = 'unified'
	emoji.allow_native = true
	return commits.slice(0, 25).map(commit => {
		return {
			label: `${emoji.replace_colons(commit.message.slice(0, 25))}${commit.message.length > 25 ? '...' : ''}`,
			hint: `'${commit.message}' by ${commit.author_name}`,
			decorator: {
				label: new Date(commit.date).toLocaleString(),
			},
		}
	})
}

/*
 * Notification for "git add"
 */
const showFilesAddedNotification = (projectPath: string) => {
	new Notification({
		title: 'Source Tracker',
		content: `Added files to the index in ${projectPath}`,
	})
}

/*
 * Notification for "git commit"
 */
const showCommitCreatedNotification = (projectPath: string) => {
	new Notification({
		title: 'Source Tracker',
		content: `Commit created in ${projectPath}`,
	})
}

/*
 * Notification for "git pull"
 */
const showChangesPulledNotification = (projectPath: string) => {
	new Notification({
		title: 'Source Tracker',
		content: `Pulled changes in ${projectPath}`,
	})
}

/*
 * Notification for "git push"
 */
const showChangesPushedNotification = (projectPath: string) => {
	new Notification({
		title: 'Source Tracker',
		content: `Pushed changes in ${projectPath}`,
	})
}

if (!RunningConfig.data.isBrowser && StaticConfig.data.experimentalSourceTracker) {
	let globalCountOfChanges = 0
	let setGlobalDecorator

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
				const loadedGitRepoListener = RunningConfig.on('loadedGitRepo', async ({ parentFolder, gitChanges, anyChanges, explorerProvider }) => {
					if (folderPath !== parentFolder) return
					//Hide "No repository open" message
					this.setAttribute('empty', 'false')
					//Load the current commits
					let { all: allCommits } = await explorerProvider.getGitAllCommits(parentFolder)

					/*
					 * Listen for any git change in that folder
					 */
					const gitStatusUpdatedListener = RunningConfig.on('gitStatusUpdated', async ({ parentFolder: folder, gitChanges: changes }) => {
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
							setGlobalDecorator({
								label: getGlobalChanges(),
							})
						}
					})

					const projectListeners = [loadedGitRepoListener, gitStatusUpdatedListener]

					const folderRemovedWorkspaceListener = RunningConfig.on('removeFolderFromRunningWorkspace', async ({ folderPath: projectPath }) => {
						if (folderPath === projectPath) {
							/*
							 * Cancel some git-related listeners when the folder is removed from the workspace.
							 */
							projectListeners.forEach(listener => listener.cancel())

							folderRemovedWorkspaceListener.cancel()
						}
					})

					//Set the current count
					increateGlobalChanges(gitChanges.files.length)
					//Display the current count
					setGlobalDecorator({
						label: getGlobalChanges(),
					})

					const SourceTracker = Explorer({
						items: [
							{
								label: basename(folderPath),
								icon: 'folder.closed',
								decorator: {
									label: gitChanges.files.length == 0 ? 'Any' : gitChanges.files.length.toString(),
									color: 'var(--explorerItemGitIndicatorText)',
									background: 'var(--explorerItemGitNotAddedText)',
								},
								mounted({ setDecorator }) {
									const folderRemovedWorkspaceListener = RunningConfig.on('removeFolderFromRunningWorkspace', async ({ folderPath: projectPath }) => {
										if (folderPath === projectPath) {
											// Dirty way of removing the explorer
											this.remove()
											// Decrease the global count
											decreaseGlobalChanges(gitChanges.files.length)
											// Update the global count
											setGlobalDecorator({
												label: globalCountOfChanges > 0 ? globalCountOfChanges.toString() : '',
											})
											// Remove the listener
											folderRemovedWorkspaceListener.cancel()
										}
									})
									const gitStatusUpdatedListener = RunningConfig.on('gitStatusUpdated', ({ parentFolder: folder, gitChanges }) => {
										if (parentFolder === folder) {
											/*
											 * Update the changes count
											 */
											setDecorator({
												label: gitChanges.files.length.toString(),
											})
										}
									})

									projectListeners.push(gitStatusUpdatedListener)
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
														placeHolder: '🐛 Bug fix',
														type: 'textarea',
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
											{
												label: 'Push',
												action: async function () {
													const [remote, branch] = (
														await InputDialog({
															title: 'Remote and branch',
															placeHolder: '<remote> <branch>',
														})
													).split(' ')
													/*
													 * Pull changes on that branch
													 */
													await explorerProvider.gitPush(parentFolder, remote, branch)
													showChangesPushedNotification(parentFolder)
												},
											},
										],
									},
									{
										label: 'Changes',
										mounted({ setItems, setDecorator }) {
											const gitStatusUpdatedListener = RunningConfig.on('gitStatusUpdated', ({ parentFolder: folder, gitChanges }) => {
												if (parentFolder === folder) {
													/*
													 * Display the changed files
													 */
													setItems(getChangesAsItems(gitChanges.files, folder, ['?', ' ']), false)
													/*
													 * Update the changes count
													 */
													setDecorator({
														label: getChangesCount(gitChanges.files, ['?', ' ']),
													})
												}
											})

											projectListeners.push(gitStatusUpdatedListener)

											/*
											 * Display the current changed files
											 */
											setItems(getChangesAsItems(gitChanges.files, folderPath, ['?', ' ']), false)
										},
										decorator: {
											label: getChangesCount(gitChanges.files, ['?', ' ']),
											color: 'var(--explorerItemGitIndicatorText)',
											background: 'var(--explorerItemGitNotAddedText)',
										},
										items: [],
									},
									{
										label: 'Staged',
										mounted({ setItems, setDecorator }) {
											const gitStatusUpdatedListener = RunningConfig.on('gitStatusUpdated', ({ parentFolder: folder, gitChanges }) => {
												if (parentFolder === folder) {
													/*
													 * Display the changed files
													 */
													setItems(getChangesAsItems(gitChanges.files, folder, ['A']), false)
													/*
													 * Update the changes count
													 */
													setDecorator({
														label: getChangesCount(gitChanges.files, ['A']),
													})
												}
											})

											projectListeners.push(gitStatusUpdatedListener)

											setItems(getChangesAsItems(gitChanges.files, folderPath, ['A']), false)
										},
										decorator: {
											label: getChangesCount(gitChanges.files, ['A']),
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
											const gitStatusUpdatedListener = RunningConfig.on('gitStatusUpdated', async ({ parentFolder: folder, gitChanges }) => {
												if (parentFolder === folder) {
													/*
													 * Get the latest commits
													 */
													const { all } = await explorerProvider.getGitAllCommits(parentFolder)
													/*
													 * Display as item each commit
													 */
													setItems(getCommitsAsItems(all), false)
													/*
													 * Update the commits count
													 */
													setDecorator({
														label: getCommitChangesLabel(all).toString(),
													})
												}
											})

											projectListeners.push(gitStatusUpdatedListener)

											/*
											 * Display each current commit as item
											 */
											setItems(getCommitsAsItems(allCommits), false)
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
				setGlobalDecorator = hooks.setDecorator
				return GitIcon()
			},
			panel() {
				return element({
					components: {
						Text,
						ContainerPanel,
					},
				})`
				<ContainerPanel mounted="${mounted}" empty="true">
					<Text lang-string="sidepanels.sourceTracker.noRepositoryOpen"></Text>
				</ContainerPanel>
				`
			},
			hint: 'Source Tracker',
		})
	})
}

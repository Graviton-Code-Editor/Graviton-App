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

if (!RunningConfig.data.isBrowser && StaticConfig.data.experimeanlSourceTracker) {
	const emoji = new EmojiConvertor()
	emoji.replace_mode = 'unified'
	emoji.allow_native = true

	RunningConfig.on('appLoaded', () => {
		function mounted() {
			RunningConfig.on('addFolderToRunningWorkspace', async ({ folderPath }) => {
				RunningConfig.on('loadedGitRepo', async ({ parentFolder, gitChanges, anyChanges, explorerProvider }) => {
					if (folderPath !== parentFolder) return
					const { all: allCommits } = await explorerProvider.getGitAllCommits(parentFolder)
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
												label: 'Commit',
												action() {
													console.log('Commit')
												},
											},
											{
												label: 'Pull',
												action() {
													console.log('Pull')
												},
											},
										],
									},
									{
										label: 'Changes',
										mounted({ setItems, setDecorator }) {
											RunningConfig.on('gitStatusUpdated', ({ parentFolder, gitChanges }) => {
												setItems(getExplorerItems(gitChanges.files))
												setDecorator({
													label: gitChanges.files.length,
												})
											})
										},
										decorator: {
											label: gitChanges.files.length == '0' ? 'Any' : gitChanges.files.length,
											color: 'var(--explorerItemGitIndicatorText)',
											background: 'var(--explorerItemGitNotAddedText)',
										},
										items: getExplorerItems(gitChanges.files),
									},
									{
										label: 'Last 25 Commits',
										decorator: {
											label: allCommits.length > 25 ? '25+' : allCommits.slice(0, 25).length,
											color: 'var(--explorerItemGitIndicatorText)',
											background: 'var(--explorerItemGitNotAddedText)',
										},
										items: allCommits.slice(0, 25).map(commit => {
											return {
												label: `${emoji.replace_colons(commit.message.slice(0, 25))}${commit.message.length > 25 ? '...' : ''}`,
												hint: commit.message,
												decorator: {
													label: new Date(commit.date).toLocaleString(),
												},
											}
										}),
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

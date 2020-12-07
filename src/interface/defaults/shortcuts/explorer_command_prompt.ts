import RunningConfig from 'RunningConfig'
import CommandPrompt from '../../constructors/command.prompt'
import * as path from 'path'
import normalizeDir from '../../utils/directory_normalizer'
import Core from 'Core'
const { fs } = Core

//Command: Open the explorer command (default: Ctrl+O)
RunningConfig.on('command.openExplorerCommandPrompt', () => {
	let initialPath = ''

	if (!RunningConfig.data.isBrowser) {
		initialPath = process.env.HOME
	}

	const currentProvider = RunningConfig.data.explorerProvider
	const currentTab = RunningConfig.data.focusedTab
	const currentTabState = (currentTab && currentTab.state.data) || false
	const currentFileFolder = (currentTabState && currentTabState.parentFolder && `${path.normalize(currentTabState.parentFolder)}/`) || `${initialPath}/`

	const showOptions = async (itemPath, setOptions) => {
		if (itemPath === '') return []

		const fileName = path.basename(itemPath)

		currentProvider
			.info(itemPath)
			.then(async itemData => {
				const isFolder = itemData.isDirectory
				if (isFolder) {
					const items = await currentProvider.listDir(itemPath)

					setOptions(
						items.map(({ name }) => {
							return {
								label: name,
								action() {
									//
								},
							}
						}),
					)
				}
			})
			.catch(async () => {
				const parentFolder = path.dirname(itemPath)
				const parentFolderItems = await currentProvider.listDir(parentFolder)

				setOptions(
					parentFolderItems
						.map(({ name }) => {
							if (name.match(fileName)) {
								return {
									label: name,
									action: () => {},
								}
							}
						})
						.filter(Boolean)
						.sort((item1, item2) => {
							if (item1.label.startsWith(fileName)) {
								return -1
							}
							if (item2.label.startsWith(fileName)) {
								return 1
							}
							return 0
						}),
				)
			})
	}

	new CommandPrompt({
		name: 'explorer',
		showInput: true,
		inputDefaultText: normalizeDir(currentFileFolder),
		inputPlaceHolder: 'Enter a path',
		options: [],
		closeOnTab: false,
		onTabPressed: ({ option, value: itemPath }, { setValue, setOptions }) => {
			let newItemPath
			currentProvider
				.exists(itemPath)
				.then(async () => {
					newItemPath = path.join(itemPath, option)
					const info = await currentProvider.info(newItemPath)

					if (info.isDirectory()) {
						newItemPath = path.join(newItemPath, '/')
					}
				})
				.catch(async () => {
					const parentFolder = path.dirname(itemPath)
					newItemPath = path.join(parentFolder, option)

					const info = await currentProvider.info(newItemPath)

					if (info.isDirectory()) {
						newItemPath = path.join(newItemPath, '/')
					}
				})
				.finally(() => {
					setValue(newItemPath)
					showOptions(newItemPath, setOptions)
				})
		},
		onWriting: ({ value: itemPath }, { setOptions }) => {
			showOptions(itemPath, setOptions)
		},
		onCompleted: itemPath => {
			currentProvider.info(itemPath).then(stats => {
				const isFile = stats.isFile()
				if (isFile) {
					// Open the file
					RunningConfig.emit('loadFile', {
						filePath: itemPath,
					})
				} else {
					// Open the folder
					RunningConfig.emit('addFolderToRunningWorkspace', {
						folderPath: itemPath,
					})
				}
			})
		},
	})
})

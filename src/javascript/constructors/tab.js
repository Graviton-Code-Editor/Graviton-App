import TabBody from '../components/panel/tab'
import TabEditor from '../components/panel/tab.editor'
import { state, element, render } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import Cross from '../components/icons/cross'
import UnSavedIcon from '../components/icons/file.not.saved'
import WarningDialog from '../utils/dialogs/warning'
import normalizeDir from '../utils/directory.normalizer'
import getFormat from '../utils/format.parser'

const fs = window.require('fs-extra')
const path = window.require('path')

function guessTabPosition(tab, tabsbar) {
	return Number(
		Object.keys(tabsbar.children).find((tabChildren, index) => {
			if (tabsbar.children[tabChildren] == tab) {
				return tabChildren
			}
		}),
	)
}

function getFileIcon(fileName, fileExt) {
	if (fileExt === ('png' || 'jpg' || 'ico')) {
		return RunningConfig.data.iconpack.image || RunningConfig.data.iconpack['unknown.file']
	}
	if (RunningConfig.data.iconpack[`file.${fileName}`]) {
		return RunningConfig.data.iconpack[`file.${fileName}`]
	}
	if (RunningConfig.data.iconpack[`${fileExt}.lang`]) {
		return RunningConfig.data.iconpack[`${fileExt}.lang`]
	} else {
		return RunningConfig.data.iconpack['unknown.file']
	}
}

function Tab({ title, isEditor = false, directory, component, panel = RunningConfig.data.focusedPanel, id, projectPath: tabProject }) {
	const itemIconSource = isEditor && directory ? getFileIcon(path.basename(directory), getFormat(directory)) : null
	const tabDirectory = isEditor && directory ? normalizeDir(directory) : ''
	const classSelector = `tab${directory ? directory : id}`
	const parentFolder = isEditor && directory ? path.dirname(tabDirectory) : ''
	const openedTabs = document.getElementsByClassName(classSelector)
	const projectPath = tabProject || parentFolder
	if (openedTabs.length >= 1) {
		/**
		 *  Tab already exists so it won't be rendered again
		 */
		openedTabs[0].state.emit('focusedMe')
		return {
			isCancelled: true,
			tabElement: openedTabs[0],
			tabState: openedTabs[0].props.state,
			directory,
			isEditor,
		}
	}
	const tabState = new state({
		active: true,
		saved: true,
		parentFolder,
		panel,
		directory,
		isEditor,
	})
	RunningConfig.on('isATabOpened', ({ directory: tabDir, id: tabID }) => {
		if ((tabDir && tabDir == directory) || (tabID && tabID == id)) {
			return {
				tabElement: tabNode,
			}
		}
	})
	const TabComp = element({
		components: {
			TabBody,
			Cross,
		},
	})`
		<TabBody mounted="${mounted}" active="${() =>
		tabState.data
			.active}"  draggable="true" classSelector="${classSelector}" class="${classSelector}" :dragstart="${startDrag}" :click="${focusTab}" :mouseover="${showCross}" :mouseleave="${hideCross}" :dragenter="${dragEnter}" :dragleave="${dragLeave}" :dragover="${dragover}":drop="${onDropped}">
			${itemIconSource ? element`<img class="tab-icon" src="${itemIconSource}"/>` : element`<div/>`}
			<p :drop="${onDropped}" classSelector="${classSelector}">
				${title}
			</p>
			<div class="tab-button" :drop="${onDropped}" classSelector="${classSelector}">
				<Cross class="tab-cross" :drop="${onDropped}" classSelector="${classSelector}" style="opacity:0;" :click="${closeTab}"></Cross>
			</div>
		</TabBody>
	`
	function dragover(e) {
		e.preventDefault()
		tabNode.classList.add('dragging')
	}
	function dragEnter(e) {
		e.preventDefault()
	}
	function dragLeave(e) {
		e.preventDefault()
		e.target.classList.remove('dragging')
	}
	function onDropped(e) {
		e.preventDefault()
		tabNode.classList.remove('dragging')
	}
	function startDrag(e) {
		event.dataTransfer.setData('classSelector', classSelector)
		const tabsBar = this.parentElement
		const tabPosition = guessTabPosition(this, tabsBar)
		let classSelectorForNext = null
		if (tabsBar.children.length == 1) {
			classSelectorForNext = null
		} else if (tabPosition == 0) {
			classSelectorForNext = tabsBar.children[1].getAttribute('classSelector')
		} else {
			classSelectorForNext = tabsBar.children[tabPosition - 1].getAttribute('classSelector')
		}
		event.dataTransfer.setData('classSelectorForNext', classSelectorForNext)
	}
	function focusTab() {
		tabState.emit('focusedMe')
		tabState.emit('focusedItem')
	}
	function closeTab(e) {
		e.stopPropagation()
		tabState.emit('close')
	}
	function focusTabshowCross(e) {
		toggleCross(this.getElementsByClassName('tab-cross')[0], 1)
	}
	function showCross(e) {
		toggleCross(this.getElementsByClassName('tab-cross')[0], 1)
	}
	function hideCross(e) {
		toggleCross(this.getElementsByClassName('tab-cross')[0], 0)
		e.target.classList.remove('dragging')
	}
	function mounted() {
		this.directory = tabDirectory
		let client
		let instance
		tabState.keyChanged('active', () => {
			this.update()
		})
		tabState.on('focusedMe', () => {
			RunningConfig.data.focusedTab = this
			RunningConfig.data.focusedPanel = this.parentElement.parentElement
			RunningConfig.emit('aTabHasBeenFocused', {
				tabElement: this,
				directory: tabDirectory,
				client,
				instance,
				parentFolder,
				projectPath,
			})
			if (!tabState.data.active) unfocusTabs(this)
			tabState.data.active = true
			this.scrollIntoView()
		})
		tabState.on('unfocusedMe', () => {
			RunningConfig.emit('aTabHasBeenUnfocused', {
				tabElement: this,
				directory: tabDirectory,
				client,
				instance,
				parentFolder,
				isEditor,
				projectPath,
			})
			tabState.data.active = false
		})
		tabState.on('destroyed', () => {
			IconpackWatcher.cancel()
			RunningConfig.emit('aTabHasBeenClosed', {
				tabElement: this,
				directory: tabDirectory,
				client,
				instance,
				parentFolder,
				isEditor,
				projectPath,
			})
		})
		tabState.on('savedMe', () => {
			if (!tabState.data.saved) {
				toggleTabStatus({
					tabElement: this,
					newStatus: true,
					tabEditor: tabEditorNode,
					directory: tabDirectory,
				})
				RunningConfig.emit('aTabHasBeenSaved', {
					tabElement: this,
					directory: tabDirectory,
					client,
					instance,
					parentFolder,
					isEditor,
					projectPath,
				})
			}
		})
		tabState.on('markAsSaved', () => {
			if (!tabState.data.saved) {
				tabState.data.saved = true
				toggleTabStatus({
					tabElement: this,
					newStatus: true,
					tabEditor: tabEditorNode,
					directory: tabDirectory,
				})
			}
		})
		tabState.on('unsavedMe', () => {
			if (tabState.data.saved) {
				toggleTabStatus({
					tabElement: this,
					newStatus: false,
					tabEditor: tabEditorNode,
					directory: tabDirectory,
				})
				tabState.data.saved = false
				RunningConfig.emit('aTabHasBeenUnSaved', {
					tabElement: this,
					directory: tabDirectory,
					client,
					instance,
					parentFolder,
					isEditor,
					projectPath,
				})
			}
		})
		tabState.on('changePanel', newPanel => {
			tabState.data.panel = newPanel
			tabState.data.active = false
			focusATab(this)
		})
		let closeDialogOpened = false
		tabState.on('close', () => {
			if (tabState.data.saved) {
				tabState.emit('destroyed', {
					tabElement: tabNode,
				})
				focusATab(this)
				tabNode.remove()
				tabEditorNode.remove()
			} else {
				if (!closeDialogOpened) {
					closeDialogOpened = true
					new WarningDialog()
						.then(() => {
							focusATab(tabNode)
							tabNode.remove()
							tabEditorNode.remove()
							tabNode.state.emit('destroyed', {
								tabElement: tabNode,
							})
						})
						.catch(() => {
							// nothing, tab remains opened
						})
						.finally(() => {
							closeDialogOpened = false
						})
				}
			}
		})
		this.getPanelTabs = () => {
			const tabs = this.parentElement.children
			return Object.keys(tabs).map(tab => {
				return {
					element: tabs[tab],
					fileName: path.basename(tabs[tab].state.data.directory),
					filePath: tabs[tab].state.data.directory,
				}
			})
		}
		unfocusTabs(this)
		if (isEditor) {
			tabState.on('editorCreated', ({ client: newClient, instance: newInstance }) => {
				client = newClient
				instance = newInstance
				tabState.emit('focusedMe', {})
				RunningConfig.emit('aTabHasBeenCreated', {
					tabElement: this,
					directory: tabDirectory,
					client,
					instance,
					parentFolder,
					projectPath,
				})
			})
		} else {
			tabState.emit('focusedMe', {})
			RunningConfig.emit('aTabHasBeenCreated', {
				tabElement: this,
				directory: tabDirectory,
				client: null,
				instance: null,
				parentFolder,
				projectPath,
			})
		}
		const IconpackWatcher = RunningConfig.on('updatedIconpack', () => {
			if (tabDirectory) {
				const iconNode = this.getElementsByClassName('tab-icon')
				if (iconNode[0]) {
					iconNode[0].src = getFileIcon(path.basename(tabDirectory), getFormat(tabDirectory))
				}
			}
		})
		this.state = tabState
	}
	const randomSelectorEditor = Math.random()
	const TabEditorComp = element({
		components: {
			TabEditor,
			component,
		},
	})`
		<TabEditor :click="${focusEditor}" id="${randomSelectorEditor}" mounted="${mountedEditor}">
			${component ? component() : ''}
		</TabEditor>
	`
	function focusEditor() {
		tabState.emit('focusedMe')
	}
	function mountedEditor() {
		const target = this
		tabState.on('focusedMe', () => {
			target.style.display = 'flex'
			target.state = tabState
		})
		tabState.on('unfocusedMe', () => {
			target.style.display = 'none'
			target.state = tabState
		})
		tabState.on('changePanel', newPanel => {
			newPanel.children[1].appendChild(target)
		})
		target.state = tabState
	}
	render(TabComp, panel.children[0])
	render(TabEditorComp, panel.children[1])
	const tabNode = document.getElementsByClassName(classSelector)[0]
	const tabEditorNode = document.getElementById(randomSelectorEditor)
	tabState.data.tabEditorElement = tabEditorNode
	return {
		tabElement: tabNode,
		bodyElement: tabEditorNode,
		tabState,
		isCancelled: false,
	}
}

function toggleCross(target, state) {
	target.style.opacity = state
}

function toggleTabStatus({ tabElement, tabEditor, newStatus, directory }) {
	const tabCrossIcon = tabElement.getElementsByClassName('tab-cross')[0]
	const tabSaveIcon = tabElement.getElementsByClassName('tab-save')[0]
	if (newStatus) {
		if (!tabElement.state.data.saved) {
			saveFile(directory, () => {
				RunningConfig.emit('tabSaved', {
					element: tabElement,
					parentFolder: tabElement.state.data.parentFolder,
				})
				tabCrossIcon.style.display = 'block'
				if (tabSaveIcon) tabSaveIcon.remove()
				tabElement.state.data.saved = true
			})
		} else {
			tabCrossIcon.style.display = 'block'
			if (tabSaveIcon) tabSaveIcon.remove()
		}
	} else if (tabElement.state.data.saved) {
		tabElement.state.data.saved = false
		tabCrossIcon.style.display = 'none'
		const comp = element({
			components: {
				UnSavedIcon,
			},
		})`
			<UnSavedIcon :click="${tryToClose}"></UnSavedIcon>
		`
		function tryToClose() {
			tabElement.state.emit('close')
		}
		render(comp, tabElement.children[2])
	}
}

function saveFile(directory, callback) {
	if (directory) {
		const { client, instance } = RunningConfig.data.focusedEditor
		fs.writeFile(directory, client.do('getValue', instance))
			.then(() => {
				callback()
			})
			.catch(err => {
				console.error(err)
			})
	} else {
		callback()
	}
}

function unfocusTabs(tab) {
	const tabsBar = tab.parentElement
	const tabsBarChildren = tabsBar.children
	for (let otherTab of tabsBarChildren) {
		if (otherTab != tab) {
			otherTab.state.emit('unfocusedMe')
		}
	}
}

function focusATab(fromTab) {
	const tabsBar = fromTab.parentElement
	const tabsBarChildren = tabsBar.children
	const fromTabPosition = guessTabPosition(fromTab, tabsBar)
	const focusedTabPosition = guessTabPosition(RunningConfig.data.focusedTab, tabsBar)
	if (focusedTabPosition === 0) {
		if (fromTabPosition < tabsBarChildren.length - 1) {
			tabsBarChildren[fromTabPosition + 1].state.emit('focusedMe')
		} else if (tabsBarChildren.length === 1) {
			RunningConfig.data.focusedTab = null
			RunningConfig.data.focusedEditor = null
		}
	} else if ((focusedTabPosition !== 0 && fromTabPosition == focusedTabPosition) || focusedTabPosition == tabsBarChildren.length) {
		tabsBarChildren[fromTabPosition - 1].state.emit('focusedMe')
	}
}

export default Tab

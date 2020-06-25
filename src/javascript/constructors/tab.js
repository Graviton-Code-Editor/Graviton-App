import TabBody from '../components/panel/tab'
import TabEditor from '../components/panel/tab.editor'
import { state, element, style, render } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import Cross from '../components/icons/cross'
import UnSavedIcon from '../components/icons/file.not.saved'
import areYouSureDialog from '../defaults/dialogs/you.sure'
import normalizeDir from '../utils/directory.normalizer'

const fs = window.require('fs-extra')

function guessTabPosition(tab, tabsbar) {
	return Number(
		Object.keys(tabsbar.children).find((tabChildren, index) => {
			if (tabsbar.children[tabChildren] == tab) {
				return tabChildren
			}
		})
	)
}

function Tab({ title, isEditor = false, directory = '', parentFolder, component, panel = RunningConfig.data.focusedPanel, id }) {
	const classSelector = `tab${directory ? directory : id}`
	const openedTabs = document.getElementsByClassName(classSelector)
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
			<p :drop="${onDropped}"" classSelector="${classSelector}">
				${title}
			</p>
			<div :drop="${onDropped}" classSelector="${classSelector}">
				<Cross :drop="${onDropped}" classSelector="${classSelector}" style="opacity:0;" :click="${closeTab}"></Cross>
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
		toggleCross(this.children[1].children[0], 1)
	}
	function showCross(e) {
		toggleCross(this.children[1].children[0], 1)
	}
	function hideCross(e) {
		toggleCross(this.children[1].children[0], 0)
		e.target.classList.remove('dragging')
	}
	function mounted() {
		this.directory = directory
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
				directory: normalizeDir(directory),
				client,
				instance,
				parentFolder,
			})
			if (!tabState.data.active) unfocusTabs(this)
			tabState.data.active = true
			this.scrollIntoView()
		})
		tabState.on('unfocusedMe', () => {
			RunningConfig.emit('aTabHasBeenUnfocused', {
				tabElement: this,
				directory: normalizeDir(directory),
				client,
				instance,
				parentFolder,
			})
			tabState.data.active = false
		})
		tabState.on('destroyed', () => {
			RunningConfig.emit('aTabHasBeenClosed', {
				tabElement: this,
				directory: normalizeDir(directory),
				client,
				instance,
				parentFolder,
			})
		})
		tabState.on('savedMe', () => {
			if (!tabState.data.saved) {
				toggleTabStatus({
					tabElement: this,
					newStatus: true,
					tabEditor: tabEditorNode,
					directory,
				})
				RunningConfig.emit('aTabHasBeenSaved', {
					tabElement: this,
					directory: normalizeDir(directory),
					client,
					instance,
					parentFolder,
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
					directory,
				})
			}
		})
		tabState.on('unsavedMe', () => {
			if (tabState.data.saved) {
				toggleTabStatus({
					tabElement: this,
					newStatus: false,
					tabEditor: tabEditorNode,
					directory,
				})
				tabState.data.saved = false
				RunningConfig.emit('aTabHasBeenUnSaved', {
					tabElement: this,
					directory: normalizeDir(directory),
					client,
					instance,
					parentFolder,
				})
			}
		})
		tabState.on('changePanel', newPanel => {
			tabState.data.panel = newPanel
			tabState.data.active = false
			focusATab(this)
		})
		tabState.on('close', () => {
			if (tabState.data.saved) {
				tabState.emit('destroyed', {
					tabElement: tabNode,
				})
				focusATab(this)
				tabNode.remove()
				tabEditorNode.remove()
			} else {
				new areYouSureDialog()
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
			}
		})
		this.getPanelTabs = () => {
			const tabs = this.parentElement.children
			return Object.keys(tabs).map(tab => {
				return {
					element: tabs[tab],
					fileName: tabs[tab].children[0].textContent,
					filePath: tabs[tab].getAttribute('classselector'),
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
					directory: normalizeDir(directory),
					client,
					instance,
					parentFolder,
				})
			})
		} else {
			tabState.emit('focusedMe', {})
			RunningConfig.emit('aTabHasBeenCreated', {
				tabElement: this,
				directory: normalizeDir(directory),
				client: null,
				instance: null,
				parentFolder,
			})
		}
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
	if (newStatus) {
		if (!tabElement.state.data.saved) {
			saveFile(directory, () => {
				RunningConfig.emit('tabSaved', {
					element: tabElement,
					parentFolder: tabElement.state.data.parentFolder,
				})
				tabElement.children[1].children[0].style.display = 'block'
				if (tabElement.children[1].children[1] != null) tabElement.children[1].children[1].remove()
				tabElement.state.data.saved = true
			})
		} else {
			tabElement.children[1].children[0].style.display = 'block'
			if (tabElement.children[1].children[1]) tabElement.children[1].children[1].remove()
		}
	} else if (tabElement.state.data.saved) {
		tabElement.state.data.saved = false
		tabElement.children[1].children[0].style.display = 'none'
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
		render(comp, tabElement.children[1])
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

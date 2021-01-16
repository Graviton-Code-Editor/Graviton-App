import PanelBody from '../components/panel/panel'
import { element, render } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import ContextMenu from './contextmenu'
import tabsUnsavedWarningDialog from '../defaults/dialogs/tabs_unsaved_warning'
import PuffinElement from 'Types/puffin.element'

function guessTabPosition(tab, tabsbar) {
	const res = Object.keys(tabsbar.children).find((tabChildren, index) => {
		if (tabsbar.children[tabChildren] === tab) {
			return tabChildren
		}
	})
	return Number(res)
}

class Panel {
	element: PuffinElement
	constructor() {
		const self = this
		const PanelComp = element({
			components: {
				PanelBody,
			},
		})`
			<PanelBody :click="${this.focusPanel.bind(this)}" :dragover="${allowDrop}" :drop="${onTabDropped}">    
				<div :dragover="${allowDrop}"  class="tabsbar"/>
				<div :contextmenu="${contextmenu}" class="tabspanel"/>
			</PanelBody>
		`
		function allowDrop(e) {
			e.preventDefault()
		}
		function onTabDropped(e) {
			e.preventDefault()
			const dropType = e.dataTransfer.getData('type') || 'tab'

			switch (dropType) {
				case 'tab':
					const target = <PuffinElement>document.getElementsByClassName(e.target.getAttribute('classSelector'))[0] || e.target
					const movingTab = <PuffinElement>document.getElementsByClassName(e.dataTransfer.getData('classSelector'))[0]
					const nextOldTab = <PuffinElement>document.getElementsByClassName(e.dataTransfer.getData('classSelectorForNext'))[0]
					let nextTab = null
					let tabsBar = null
					let oldPanel = movingTab.state.data.panel
					let panel = null
					let position = 0
					if (target.classList.contains('tabspanel')) {
						tabsBar = target.previousSibling
						position = tabsBar.children.length - 1
						panel = tabsBar.parentElement
					} else if (target.classList.contains('tabsbar')) {
						tabsBar = target
						position = tabsBar.children.length - 1
						panel = tabsBar.parentElement
					} else if (target.parentElement.classList.contains('tabsbar')) {
						tabsBar = target.parentElement
						panel = tabsBar.parentElement
						const targetPosition = guessTabPosition(target, tabsBar)
						const draggingTabPosition = guessTabPosition(movingTab, tabsBar)
						if (targetPosition < draggingTabPosition) {
							nextTab = tabsBar.children[targetPosition]
						} else {
							nextTab = tabsBar.children[targetPosition + 1]
						}
					} else {
						// Unexpected behavior
						return
					}
					if (position === tabsBar.children.length - 1) {
						//Drag targeting the tabs bar
						tabsBar.appendChild(movingTab)
					} else {
						//Drag between tabs
						tabsBar.insertBefore(movingTab, nextTab)
					}
					//Make dragged tab the active one in the new panel and also move the editor
					movingTab.state.emit('changePanel', panel)
					if (oldPanel !== panel && nextOldTab) {
						//Focus a tab in old panel
						nextOldTab.state.emit('focusedMe')
					}
					//Focus the new tab
					movingTab.state.emit('focusedMe', {})
					break

				case 'explorerItem':
					const isFolder = e.dataTransfer.getData('isFolder')
					const itemClass = e.dataTransfer.getData('class')
					const itemElement = document.getElementsByClassName(itemClass)[0]
					if (isFolder === 'true') return

					// Focus the panel where the file dropped
					self.focusPanel()

					// Launch an editor
					RunningConfig.emit('loadFile', {
						filePath: e.dataTransfer.getData('filePath'),
						explorerProvider: (itemElement as any).instance.explorerProvider,
					})
					break
			}
		}

		function contextmenu(event) {
			const panelParent = this.parentElement.parentElement
			const parentChildren = [...panelParent.children]
			if (!this.children[0] && parentChildren.length > 1) {
				new ContextMenu({
					list: [
						{
							label: 'misc.Close',
							action: () => {
								removePanel(this.parentElement)
							},
						},
					],
					event,
					parent: this.parentElement,
				})
			}
		}

		this.element = render(PanelComp, document.getElementById('panels_stack'))
		RunningConfig.data.focusedPanel = this.element
	}
	focusPanel() {
		RunningConfig.data.focusedPanel = this.element
	}
}

function focusOtherPanel(currentPanel) {
	const panelParent = currentPanel.parentElement
	const parentChildren = [...panelParent.children]
	const position = parentChildren.indexOf(currentPanel)
	if (parentChildren.length > 1) {
		if (position === 0) {
			/*
			 * Focus sibling panel
			 */
			RunningConfig.data.focusedPanel = parentChildren[position + 1]
			return {
				oldPanel: currentPanel,
			}
		} else {
			/*
			 * Focus previous panel
			 */
			RunningConfig.data.focusedPanel = parentChildren[position - 1]
			return {
				oldPanel: currentPanel,
			}
		}
	}
	return {
		oldPanel: null,
	}
}

function removePanel(panelToRemove = RunningConfig.data.focusedPanel) {
	if (getUnsavedtabs(panelToRemove).length == 0) {
		const { oldPanel } = focusOtherPanel(panelToRemove)
		if (oldPanel) {
			destroyTabs(oldPanel)
			oldPanel.remove()
		}
	}
}

function destroyTabs(panel) {
	const tabsBar = panel.children[0]
	const panelTabs = tabsBar.childNodes
	panelTabs.forEach(function (tab) {
		tab.state.emit('close')
	})
}

function getUnsavedtabs(panel) {
	const tabsBar = panel.children[0]
	const panelTabs = tabsBar.children
	const unSavedTabs = Object.keys(panelTabs).filter(n => {
		const tab = panelTabs[n]
		return tab.state.data.saved == false
	})
	return unSavedTabs
}

RunningConfig.on('checkAllTabsAreSaved', ({ whenContinue = function () {}, whenIgnore = function () {} } = {}) => {
	const panels = document.getElementById('panels_stack').children
	const allUnsavedTabs = Object.keys(panels)
		.map(n => {
			const panel = panels[n]
			return getUnsavedtabs(panel)
		})
		.flat()
	if (allUnsavedTabs.length != 0) {
		tabsUnsavedWarningDialog()
			.then(() => {
				whenContinue()
			})
			.catch(() => {
				whenIgnore()
			})
	} else {
		whenContinue()
	}
})

export { Panel, removePanel }

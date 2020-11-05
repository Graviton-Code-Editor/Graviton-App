import TabBody from '../components/panel/tab'
import TabEditor from '../components/panel/tab.editor'
import { state, element, render } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import Cross from '../components/icons/cross'
import UnSavedIcon from '../components/icons/file.not.saved'
import WarningDialog from '../utils/dialogs/warning'
import normalizeDir from '../utils/directory_normalizer'
import getFormat from '../utils/format_parser'
import PuffinElement from '../types/puffin.element'
import { PuffinState } from '../types/puffin.state'
import { TabOptions } from '../types/tab'
import path from 'path'

class Tab {
	public tabElement: PuffinElement
	public bodyElement: PuffinElement
	public tabState: PuffinState
	public isCancelled: boolean
	public isEditor: boolean
	public panel: PuffinElement
	public directory: string
	public itemIconSource: any
	public classSelector: string
	public parentFolder: string
	public projectPath: any
	public client: any
	public instance: any
	public explorerProvider: any

	constructor({ title, isEditor = false, directory, component, panel = RunningConfig.data.focusedPanel, id, projectPath, explorerProvider }: TabOptions) {
		this.itemIconSource = isEditor && directory ? getFileIcon(path.basename(directory), getFormat(directory)) : null
		this.directory = isEditor && directory ? normalizeDir(directory) : ''
		this.classSelector = `tab${directory ? directory : id}`
		this.parentFolder = isEditor && directory ? path.dirname(this.directory) : ''
		this.projectPath = projectPath || this.parentFolder
		this.isEditor = isEditor
		this.explorerProvider = explorerProvider

		const self = this

		const openedTabs: any = document.getElementsByClassName(this.classSelector)

		if (openedTabs.length >= 1) {
			/**
			 *  Tab already exists so it won't be rendered again
			 */
			openedTabs[0].state.emit('focusedMe')
			this.isCancelled = true
			this.tabElement = openedTabs[0]
			this.tabState = openedTabs[0].props.state
			return
		}
		this.tabState = new state({
			active: true,
			saved: true,
			parentFolder: this.parentFolder,
			panel,
			directory: this.directory,
			isEditor: this.isEditor,
			title,
			instance: this,
		})
		const TabComp = element({
			components: {
				TabBody,
				Cross,
			},
		})`
		<TabBody mounted="${mounted}" active="${() => this.tabState.data.active}"  draggable="true" classSelector="${this.classSelector}" class="${
			this.classSelector
		}" :dragstart="${startDrag}" :click="${focusTab}" :mouseover="${showCross}" :mouseleave="${hideCross}" :dragenter="${dragEnter}" :dragleave="${dragLeave}" :dragover="${dragOver}":drop="${onDropped}">
			${this.itemIconSource ? element`<img class="tab-icon" src="${this.itemIconSource}"/>` : element`<div/>`}
			<p :drop="${onDropped}" classSelector="${this.classSelector}">
				${title}
			</p>
			<div class="tab-button" :drop="${onDropped}" classSelector="${this.classSelector}">
				<Cross class="tab-cross" :drop="${onDropped}" classSelector="${this.classSelector}" style="opacity:0;" :click="${closeTab}"></Cross>
			</div>
		</TabBody>
		`
		function dragOver(e: DragEvent): void {
			e.preventDefault()
			self.tabElement.classList.add('dragging')
		}
		function dragEnter(e: DragEvent): void {
			e.preventDefault()
		}
		function dragLeave(e: DragEvent): void {
			;(e.target as Element).classList.remove('dragging')
		}
		function onDropped(e: DragEvent): void {
			e.preventDefault()
			self.tabElement.classList.remove('dragging')
		}
		function startDrag(e: DragEvent): void {
			e.dataTransfer.setData('classSelector', self.classSelector)
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
			e.dataTransfer.setData('classSelectorForNext', classSelectorForNext)
		}
		function focusTab(): void {
			self.tabState.emit('focusedMe')
			self.tabState.emit('focusedItem')
		}
		function closeTab(e: MouseEvent): void {
			e.stopPropagation()
			self.tabState.emit('close')
		}
		function focusTabshowCross(): void {
			self._toggleCross(this.getElementsByClassName('tab-cross')[0], 1)
		}
		function showCross(): void {
			self._toggleCross(this.getElementsByClassName('tab-cross')[0], 1)
		}
		function hideCross(e): void {
			self._toggleCross(this.getElementsByClassName('tab-cross')[0], 0)
			e.target.classList.remove('dragging')
		}
		function mounted(): void {
			this.directory = self.directory
			this.state = self.tabState
			self.tabElement = this
			self._addListeners()

			this.classList.add('opening')

			setTimeout(() => {
				this.classList.remove('opening')
			}, 135)

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
				self.tabState.on('editorCreated', ({ client: newClient, instance: newInstance }) => {
					self.client = newClient
					self.instance = newInstance
					self.tabState.emit('focusedMe', { justCreated: true })
					RunningConfig.emit('aTabHasBeenCreated', {
						tabElement: self.tabElement,
						directory: self.directory,
						client: newClient,
						instance: newInstance,
						parentFolder: self.parentFolder,
						projectPath: self.projectPath,
						isEditor: self.isEditor,
					})
				})
			} else {
				self.tabState.emit('focusedMe', { justCreated: true })
				RunningConfig.emit('aTabHasBeenCreated', {
					tabElement: self.tabElement,
					directory: self.directory,
					client: null,
					instance: null,
					parentFolder: self.parentFolder,
					projectPath: self.projectPath,
					isEditor: self.isEditor,
				})
			}
		}
		const TabEditorComp = element({
			components: {
				TabEditor,
				component,
			},
		})`
			<TabEditor :click="${focusEditor}" mounted="${mountedEditor}">
				${component ? component() : ''}
			</TabEditor>
		`
		function focusEditor(): void {
			self.tabState.emit('focusedMe')
		}
		function mountedEditor(): void {
			const target = this
			self.bodyElement = this
			self.tabState.on('focusedMe', () => {
				target.style.display = 'flex'
				target.state = self.tabState
			})
			self.tabState.on('unfocusedMe', () => {
				target.style.display = 'none'
				target.state = self.tabState
			})
			self.tabState.on('changePanel', newPanel => {
				newPanel.children[1].appendChild(target)
			})
			target.state = self.tabState
		}
		render(TabComp, panel.children[0])
		self.tabState.data.bodyElement = render(TabEditorComp, panel.children[1])
	}

	private _removeElements() {
		return new Promise(res => {
			setTimeout(() => {
				this.tabElement.remove()
				this.bodyElement.remove()
				res()
			}, 135)
		})
	}

	private _addListeners(): void {
		const IconpackWatcher = RunningConfig.on('updatedIconpack', () => {
			if (this.directory) {
				const iconNode = this.tabElement.getElementsByClassName('tab-icon')[0] as any
				if (iconNode) {
					iconNode.src = getFileIcon(path.basename(this.directory), getFormat(this.directory))
				}
			}
		})
		const wentActiveListener = this.tabState.keyChanged('active', () => {
			this.tabElement.update()
		})
		const focusedMeListener = this.tabState.on('focusedMe', ({ justCreated = false } = {}) => {
			if (this.tabState.data.active && justCreated === false) return
			RunningConfig.data.focusedTab = this.tabElement
			RunningConfig.data.focusedPanel = this.tabElement.parentElement.parentElement
			if (!this.tabState.data.active) unfocusTabs(this.tabElement)
			RunningConfig.emit('aTabHasBeenFocused', {
				tabElement: this.tabElement,
				directory: this.directory,
				client: this.client,
				instance: this.instance,
				parentFolder: this.parentFolder,
				isEditor: this.isEditor,
				projectPath: this.projectPath,
				justCreated,
			})
			this.tabState.data.active = true
			this.tabElement.scrollIntoView({ block: 'center' })
		})
		const unFocusedMeListener = this.tabState.on('unfocusedMe', () => {
			RunningConfig.emit('aTabHasBeenUnfocused', {
				tabElement: this.tabElement,
				directory: this.directory,
				client: this.client,
				instance: this.instance,
				parentFolder: this.parentFolder,
				isEditor: this.isEditor,
				projectPath: this.projectPath,
			})
			this.tabState.data.active = false
		})
		const savedMeListener = this.tabState.on('savedMe', () => {
			if (!this.tabState.data.saved) {
				this._toggleTabStatus(true)
				RunningConfig.emit('aTabHasBeenSaved', {
					tabElement: this.tabElement,
					directory: this.directory,
					client: this.client,
					instance: this.instance,
					parentFolder: this.parentFolder,
					isEditor: this.isEditor,
					projectPath: this.projectPath,
				})
			}
		})
		const markAsSavedListener = this.tabState.on('markAsSaved', () => {
			if (!this.tabState.data.saved) {
				this.tabState.data.saved = true
				this._toggleTabStatus(true)
			}
		})
		const unsavedMeListener = this.tabState.on('unsavedMe', () => {
			if (this.tabState.data.saved) {
				this._toggleTabStatus(false)
				this.tabState.data.saved = false
				RunningConfig.emit('aTabHasBeenUnSaved', {
					tabElement: this.tabElement,
					directory: this.directory,
					client: this.client,
					instance: this.instance,
					parentFolder: this.parentFolder,
					isEditor: this.isEditor,
					projectPath: this.projectPath,
				})
			}
		})
		const changedPanelListener = this.tabState.on('changePanel', newPanel => {
			this.tabState.data.panel = newPanel
			this.tabState.data.active = false
			focusATab(this.tabElement)
		})
		let closeDialogOpened = false
		const closedListener = this.tabState.on('close', async () => {
			if (this.tabState.data.saved) {
				this.tabState.emit('destroyed', {
					tabElement: this.tabElement,
				})
				this.tabElement.classList.add('closing')
				this.bodyElement.classList.add('closing')
				focusATab(this.tabElement)
				await this._removeElements()
			} else {
				if (!closeDialogOpened) {
					closeDialogOpened = true
					WarningDialog()
						.then(async () => {
							this.tabElement.classList.add('closing')
							this.bodyElement.classList.add('closing')
							focusATab(this.tabElement)
							await this._removeElements()
							this.tabElement.state.emit('destroyed', {
								tabElement: this.tabElement,
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
		this.tabState.once('destroyed', () => {
			wentActiveListener.cancel()
			focusedMeListener.cancel()
			unFocusedMeListener.cancel()
			savedMeListener.cancel()
			markAsSavedListener.cancel()
			unsavedMeListener.cancel()
			changedPanelListener.cancel()
			IconpackWatcher.cancel()
			closedListener.cancel()
			RunningConfig.emit('aTabHasBeenClosed', {
				tabElement: this.tabElement,
				directory: this.directory,
				client: this.client,
				instance: this.instance,
				parentFolder: this.parentFolder,
				isEditor: this.isEditor,
				projectPath: this.projectPath,
			})
		})
	}

	private _toggleCross(target: HTMLElement, state: number): void {
		target.style.opacity = state.toString()
	}

	private _toggleTabStatus(newStatus: boolean): void {
		const tabCrossIcon = <PuffinElement>this.tabElement.getElementsByClassName('tab-cross')[0]
		const tabSaveIcon = this.tabElement.getElementsByClassName('tab-save')[0]
		if (newStatus) {
			if (!this.tabElement.state.data.saved) {
				this.saveTab(() => {
					RunningConfig.emit('tabSaved', {
						element: this.tabElement,
						parentFolder: this.tabElement.state.data.parentFolder,
					})
					tabCrossIcon.style.display = 'block'
					if (tabSaveIcon) tabSaveIcon.remove()
					this.tabElement.state.data.saved = true
				})
			} else {
				tabCrossIcon.style.display = 'block'
				if (tabSaveIcon) tabSaveIcon.remove()
			}
		} else if (this.tabElement.state.data.saved) {
			this.tabElement.state.data.saved = false
			tabCrossIcon.style.display = 'none'

			const tryToClose = () => {
				this.tabElement.state.emit('close')
			}

			const comp = element({
				components: {
					UnSavedIcon,
				},
			})`
				<UnSavedIcon :click="${tryToClose}"></UnSavedIcon>
			`
			render(comp, this.tabElement.children[2])
		}
	}
	private saveTab(callback) {
		if (this.directory) {
			const { client, instance } = this
			this.explorerProvider
				.writeFile(this.directory, client.do('getValue', instance))
				.then(() => {
					callback()
				})
				.catch((err: string) => {
					console.error(err)
				})
		} else {
			callback()
		}
	}
}

function unfocusTabs(tab): void {
	const tabsBar = tab.parentElement
	const tabsBarChildren = tabsBar.children
	for (let otherTab of tabsBarChildren) {
		if (otherTab != tab) {
			otherTab.state.emit('unfocusedMe')
		}
	}
}

function getOpenedTabs(tabsBar: HTMLElement, tab = null) {
	return Object.keys(tabsBar.children)
		.map(e => {
			if (!tabsBar.children[e].classList.contains('closing') || tab === tabsBar.children[e]) {
				return tabsBar.children[e]
			}
		})
		.filter(Boolean)
}

function focusATab(fromTab: PuffinElement): void {
	const tabsBar = fromTab.parentElement
	const tabsBarChildren = getOpenedTabs(tabsBar) //Get opened tabs in the current focused panel
	const fromTabPosition = guessTabPosition(fromTab, tabsBar) //Get the current focused tab position
	const focusedTabPosition = guessTabPosition(RunningConfig.data.focusedTab, tabsBar)
	if (focusedTabPosition === 0) {
		if (fromTabPosition < tabsBarChildren.length) {
			;(tabsBarChildren[fromTabPosition] as PuffinElement).state.emit('focusedMe')
		} else if (tabsBarChildren.length === 1) {
			RunningConfig.data.focusedTab = null
			RunningConfig.data.focusedEditor = null
		}
	} else if ((focusedTabPosition !== 0 && fromTabPosition == focusedTabPosition) || focusedTabPosition == tabsBarChildren.length) {
		;(tabsBarChildren[fromTabPosition - 1] as PuffinElement).state.emit('focusedMe')
	}
}

function guessTabPosition(tab: HTMLElement, tabsBar: HTMLElement): number {
	const tabs = getOpenedTabs(tabsBar, tab)
	let res = null
	tabs.find((t, i) => {
		if (t == tab) {
			res = i
		}
	})
	return Number(res)
}

function getFileIcon(fileName: string, fileExt: string): void {
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

export default Tab

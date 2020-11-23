import { element, render, lang } from '@mkenzo_8/puffin'
import MenuComp from '../components/menu'
import ArrowIcon from '../components/icons/arrow'
import { LanguageState } from 'LanguageConfig'
import StaticConfig from 'StaticConfig'
import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core
import AppPlatform from 'AppPlatform'
import RunningConfig from 'RunningConfig'
import Tick from '../components/icons/tick'

const createdMenus = []

if (AppPlatform !== 'win32' && !RunningConfig.data.isBrowser) {
	/*
	 * Whenever the language is changed remove the native menubar and create a new one with the cached menus
	 */
	StaticConfig.keyChanged('appLanguage', () => {
		ipcRenderer.send('destroy-menus', {})
		createdMenus.map(cachedMenu => new Menu(cachedMenu, true))
	})
}

if (!RunningConfig.data.isBrowser) {
	/*
	 * Remove the default menubar
	 */
	ipcRenderer.send('destroy-menus', {})
}

class Menu {
	private MenuButton: String
	private MenuList: object[]
	constructor({ button, list }, fromEvent = false) {
		this.MenuButton = button
		this.MenuList = list.filter(Boolean)

		if ((AppPlatform === 'win32' || RunningConfig.data.isBrowser) && !fromEvent) {
			/*
			 * Display Graviton's DOM-based menus bar only in Windows
			 */
			const menuComponent = this.getDOMDropmenu(button, this.MenuList)
			const dropmenusContainer = document.getElementById('dropmenus')
			render(menuComponent, dropmenusContainer)
		} else {
			/*
			 * Display native menu bar in MacOS and GNU/Linux distributions
			 */
			const nativeMenu = this.getNativeDropmenu(button, this.MenuList)
			this.appendToNativeBar(nativeMenu)
			if (!fromEvent) {
				createdMenus.push({
					button,
					list,
				})
			}
		}
	}
	/*
	 * DOM Dropmenu
	 * Get the menu hooks
	 */
	private getMenuHooks(item, native = false) {
		return {
			setChecked(value) {
				if (native) {
					ipcRenderer.send('checkMenuItem', {
						id: item,
						checked: value,
					})
				} else {
					const tick = item.getElementsByClassName('tick')[0]
					tick.style.display = value ? 'block' : 'none'
				}
			},
		}
	}
	/*
	 * DOM Dropmenu
	 * Get the complete dropmenu component
	 */
	private getDOMDropmenu(button, list, leftMargin = 0) {
		const isSubmenu = button == null && list != null
		const data = {
			isSubmenu,
		}
		return element({
			components: {
				MenuComp,
			},
			addons: [lang(LanguageState)],
		})`
		<MenuComp class="${isSubmenu ? 'submenu' : ''}" data="${data}" style="${isSubmenu ? `position:absolute;margin-top:-20px;margin-left:${leftMargin}px;` : ''}">
			${this.getDOMDropmenuButton(isSubmenu, button)}
			<div>${this.getDOMDropmenuList(list)}</div>
		</MenuComp>
		`
	}
	/*
	 * DOM Dropmenu
	 * Get all buttons of a dropmenu
	 */
	private getDOMDropmenuList(list) {
		const self = this
		return list.map((option, index) => {
			if (!option.label) {
				/*
				 * Display a separator when no label is provided
				 */
				return element`<div class="sep"/>`
			}
			let { label, action, checked } = option

			const triggerAction = (ev: MouseEvent) => {
				if (option.list) {
					this.renderDOMSubmenu(ev, option)
				} else {
					this.hideDOMMenu(ev.target)
				}
			}

			let dropmenuOption

			if (option.list) {
				dropmenuOption = element({
					components: {
						ArrowIcon,
					},
				})`<p lang-string="${label}"></p><ArrowIcon class="arrow"/>`
			} else {
				dropmenuOption = element`<p lang-string="${label}"/>`
			}

			function mounted() {
				option.mounted?.(self.getMenuHooks(this))
			}

			return element({
				components: {
					Tick,
				},
			})`
				<div :click="${action}" mounted="${mounted}">
					<a :mouseenter="${triggerAction}" >
						<Tick class="tick" style="display: ${checked ? 'block' : 'none'}"/>
						${dropmenuOption}
					</a>
				</div>`
		})
	}
	/*
	 * DOM Dropmenu
	 * Close all submenus
	 */
	private closeAllDOMSubmenus(parent) {
		const subMenusOpened = Object.keys(parent.getElementsByClassName('submenu')).map(i => {
			return parent.getElementsByClassName('submenu')[i]
		})
		subMenusOpened.map(element => {
			element.remove()
		})
	}
	/*
	 * DOM Dropmenu
	 * Render a submenu
	 */
	private renderDOMSubmenu(e, option) {
		const submenuContainer = e.target.parentElement
		const subMenuComponent = this.getDOMDropmenu(null, option.list, e.target.clientWidth + 10)
		this.closeAllDOMSubmenus(submenuContainer.parentElement)
		render(subMenuComponent, submenuContainer)
	}
	/*
	 * DOM Dropmenu
	 * Close/Hide an specific subemnu
	 */
	private hideDOMMenu(target) {
		this.closeAllDOMSubmenus(target.parentElement.parentElement)
	}
	private getDOMDropmenuButton(isSubmenu, button) {
		if (!isSubmenu) {
			return element`
				<button :mouseover="${e => this.hideDOMMenu(e.target)}" :click="${e => this.hideDOMMenu(e.target)}" lang-string="${button}" string="{{${button}}}"/>
			`
		}
		return element` `
	}
	/*
	 * Get Native Dropmenu
	 */
	private getNativeDropmenu(button, list) {
		return {
			label: lang.getTranslation(button, LanguageState),
			submenu: this.getNativeDropmenuList(list),
		}
	}
	/*
	 * Native
	 * Convert Graviton's menu to Electron's Menu API
	 */
	private getNativeDropmenuList(list) {
		return list
			.map(option => {
				if (!option) return
				const { label, action, type, checked, list } = option
				if (label && action) {
					const id = Math.random()

					ipcRenderer.on(`menuItemClicked`, (e, menuItem) => {
						if (menuItem == id) {
							action()
						}
					})

					option.mounted?.(this.getMenuHooks(id, true))

					return {
						type,
						label: lang.getTranslation(label, LanguageState),
						id,
						checked,
					}
				} else if (label && list) {
					return {
						label: lang.getTranslation(label, LanguageState),
						submenu: this.getNativeDropmenuList(list),
					}
				} else {
					return {
						type: 'separator',
					}
				}
			})
			.filter(Boolean)
	}
	/*
	 * Native
	 * Append a dropmenu to the native menubar
	 */
	private appendToNativeBar(item) {
		ipcRenderer.send('newMenuItem', item)
	}
}

export default Menu

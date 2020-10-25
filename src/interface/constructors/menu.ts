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

const createdMenus = []

StaticConfig.keyChanged('appLanguage', () => {
	if (AppPlatform !== 'win32' && !RunningConfig.data.isBrowser) {
		ipcRenderer.send('destroy-menus', {})
	}
	createdMenus.map(m => new Menu(m, true))
})

if (!RunningConfig.data.isBrowser) ipcRenderer.send('destroy-menus', {})

class Menu {
	private MenuButton: String
	private MenuList: object[]
	constructor({ button, list }, fromEvent = false) {
		this.MenuButton = button
		this.MenuList = list.filter(Boolean)

		if ((AppPlatform === 'win32' || RunningConfig.data.isBrowser) && !fromEvent) {
			// Render Graviton's menu bar only in Windows
			const menuComponent = this.getMenuComponent(button, this.MenuList)
			const dropmenusContainer = document.getElementById('dropmenus')
			render(menuComponent, dropmenusContainer)
		} else {
			// Display native menu bar in MacOS and GNU/Linux distros
			const nativeMenu = this.createNativeMenu(button, list)
			this.appendToNativeBar(nativeMenu)
			if (!fromEvent) {
				createdMenus.push({
					button,
					list,
				})
			}
		}
	}

	private closeAllSubmenus(parent) {
		const subMenusOpened = Object.keys(parent.getElementsByClassName('submenu')).map(i => {
			return parent.getElementsByClassName('submenu')[i]
		})
		subMenusOpened.map(element => {
			element.remove()
		})
	}

	private renderSubmenu(e, option) {
		const submenuContainer = e.target.parentElement
		const subMenuComponent = this.getMenuComponent(null, option.list, e.target.clientWidth + 10)
		this.closeAllSubmenus(submenuContainer.parentElement)
		render(subMenuComponent, submenuContainer)
	}

	private hideMenus(target) {
		this.closeAllSubmenus(target.parentElement.parentElement)
	}

	private getDropmenu(list) {
		return list.map((option, index) => {
			if (option.label !== undefined) {
				let computedLabel = option.label
				if (typeof option.label === 'function') computedLabel = option.label()
				const triggerAction = e => {
					if (option.list) {
						this.renderSubmenu(e, option)
					} else {
						this.hideMenus(e.target)
					}
				}
				let dropmenuOption
				if (option.list) {
					dropmenuOption = element({
						components: {
							ArrowIcon,
						},
					})`<p lang-string="${computedLabel}"></p><ArrowIcon/>`
				} else {
					dropmenuOption = element`<p lang-string="${computedLabel}"/>`
				}
				return element`
				<div :click="${option.action}" >
					<a :mouseenter="${triggerAction}" >
						${dropmenuOption}
					</a>
				</div>`
			} else {
				return element`<div class="sep"/>`
			}
		})
	}

	private getDropmenuButton(isSubmenu, button) {
		if (!isSubmenu) {
			return element`
				<button :mouseover="${e => this.hideMenus(e.target)}" :click="${e => this.hideMenus(e.target)}" lang-string="${button}" string="{{${button}}}"/>
			`
		}
		return element` `
	}

	private getMenuComponent(button, list, leftMargin = 0) {
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
			${this.getDropmenuButton(isSubmenu, button)}
			<div>${this.getDropmenu(list)}</div>
		</MenuComp>
		`
	}
	/*
	 * Convert Graviton's menu to electron's Menu constructor
	 */
	private convertToElectronInterface(list) {
		return list.map(btn => {
			if (btn.label && btn.action) {
				const id = Math.random()
				ipcRenderer.on(`menu_${id}`, btn.action)
				return {
					label: lang.getTranslation(btn.label, LanguageState),
					action: id,
				}
			} else if (btn.label && btn.list) {
				return {
					label: lang.getTranslation(btn.label, LanguageState),
					submenu: this.convertToElectronInterface(btn.list),
				}
			} else {
				return {
					type: 'separator',
				}
			}
		})
	}

	private createNativeMenu(button, list) {
		return {
			label: lang.getTranslation(button, LanguageState),
			submenu: this.convertToElectronInterface(list),
		}
	}

	private appendToNativeBar(item) {
		ipcRenderer.send('newMenuItem', item)
	}
}

export default Menu

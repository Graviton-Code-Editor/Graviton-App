import { element, render, lang } from '@mkenzo_8/puffin'
import MenuComp from '../components/menu'
import ArrowIcon from '../components/icons/arrow'
import { LanguageState } from 'LanguageConfig'
import StaticConfig from 'StaticConfig'
import { remote } from 'electron'
const { Menu: NativeMenu } = remote
const isWindows = process.platform === 'win32'

let NativeMenuBar = new NativeMenu()
const createdMenus = []

StaticConfig.keyChanged('appLanguage', () => {
	NativeMenuBar.destroy()
	NativeMenuBar = new NativeMenu()
	createdMenus.map(m => Menu(m, true))
})

function closeAllSubmenus(parent) {
	const subMenusOpened = Object.keys(parent.getElementsByClassName('submenu')).map(i => {
		return parent.getElementsByClassName('submenu')[i]
	})
	subMenusOpened.map(element => {
		element.remove()
	})
}

function renderSubmenu(e, option) {
	const submenuContainer = e.target.parentElement
	const subMenuComponent = getMenuComponent(null, option.list, e.target.clientWidth + 10)
	closeAllSubmenus(submenuContainer.parentElement)
	render(subMenuComponent, submenuContainer)
}

const hideMenus = target => closeAllSubmenus(target.parentElement.parentElement)

function getDropmenu(list) {
	return list.map((option, index) => {
		if (option.label !== undefined) {
			let computedLabel = option.label
			if (typeof option.label === 'function') computedLabel = option.label()
			function triggerAction(e) {
				if (option.list) {
					renderSubmenu(e, option)
				} else {
					hideMenus(this)
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

const getDropmenuButton = (isSubmenu, button) => {
	if (!isSubmenu) {
		return element`
			<button :mouseover="${e => hideMenus(e.target)}" :click="${e => hideMenus(e.target)}" lang-string="${button}" string="{{${button}}}"/>
		`
	}
	return element` `
}

function getMenuComponent(button, list, leftMargin) {
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
			${getDropmenuButton(isSubmenu, button)}
			<div>${getDropmenu(list)}</div>
		</MenuComp>
	`
}

function Menu({ button, list }, fromEvent = false) {
	if (isWindows && !fromEvent) {
		// Render Graviton's menu bar only in Windows
		const menuComponent = getMenuComponent(button, list)
		const dropmenusContainer = document.getElementById('dropmenus')
		render(menuComponent, dropmenusContainer)
	} else {
		// Display native menu bar in MacOS and GNU/Linux distros
		const nativeMenu = createNativeMenu(button, list)
		appendToNativeBar(nativeMenu)
		if (!fromEvent) {
			createdMenus.push({
				button,
				list,
			})
		}
	}
}

function createNativeMenu(button, list) {
	const { MenuItem } = remote
	return new MenuItem({
		label: lang.getTranslation(button, LanguageState),
		submenu: convertToElectronInterface(list),
	})
}
/*
 * Convert Graviton's menu to electron's Menu constructor
 */
function convertToElectronInterface(list) {
	return list.map(btn => {
		if (btn.label && btn.action) {
			return {
				label: lang.getTranslation(btn.label, LanguageState),
				click: btn.action,
			}
		} else if (btn.label && btn.list) {
			return {
				label: lang.getTranslation(btn.label, LanguageState),
				submenu: convertToElectronInterface(btn.list),
			}
		} else {
			return {
				type: 'separator',
			}
		}
	})
}

function appendToNativeBar(item) {
	NativeMenuBar.append(item)
	NativeMenu.setApplicationMenu(NativeMenuBar)
}

export default Menu

import { element, style, render, lang } from '@mkenzo_8/puffin'
import MenuComp from '../components/menu'
import ArrowIcon from '../components/icons/arrow'
import { LanguageState } from 'LanguageConfig'

const { remote } = window.require('electron')
const { Menu: NativeMenu } = remote
const NativeMenuBar = new NativeMenu()

const isDarwin = window.require('process') !== 'darwin'

function closeAllSubmenus(parent) {
	const subMenusOpened = Object.keys(parent.getElementsByClassName('submenu')).map(ele => {
		return parent.getElementsByClassName('submenu')[ele]
	})
	subMenusOpened.map(element => {
		element.remove()
	})
}

function renderSubmenu(e, option) {
	closeAllSubmenus(e.target.parentElement.parentElement)
	const subMenuComponent = getMenu(null, option.list, e.target.clientWidth + 10)
	render(subMenuComponent, e.target.parentElement)
}

function getDropmenu(list) {
	function hideMenus(target) {
		closeAllSubmenus(target.parentElement.parentElement)
	}
	return list.map(function (option, index) {
		if (option.label !== undefined) {
			function triggerAction(e) {
				if (option.list) {
					renderSubmenu(e, option)
				} else {
					hideMenus(this)
				}
			}
			const dropmenuOption = option.list
				? element({
						components: {
							ArrowIcon,
						},
				  })`<p lang-string="${option.label}"></p><ArrowIcon/>`
				: element`<p lang-string="${option.label}"/>`
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
		return element`<button :mouseover="${hideMenus}" :click="${hideMenus}" lang-string="${button}" string="{{${button}}}"/>`
	}
	return element` `
}

function getMenu(button, list, leftMargin) {
	const isSubmenu = button == null && list != null
	return element({
		components: {
			MenuComp,
		},
		addons: [lang(LanguageState)],
	})`
		<MenuComp class="${isSubmenu ? 'submenu' : ''}" data="${{
		isSubmenu,
	}}" style="${isSubmenu ? `position:absolute;margin-top:-20px;margin-left:${leftMargin}px;` : ''}">
			${getDropmenuButton(isSubmenu, button)}
			<div>${getDropmenu(list)}</div>
		</MenuComp>
	`
}

function hideMenus() {
	closeAllSubmenus(this.parentElement.parentElement)
}

function Menu({ button, list }) {
	//This will ignore user's configured AppPlatform's and will use the real one
	if (isDarwin) {
		// Render Graviton's menu bar only in Windows and Linux
		const MenuComponent = getMenu(button, list)
		render(MenuComponent, document.getElementById('dropmenus'))
	} else {
		// Display MacOS's native menu bar
		appendToBar(createTemplate(button, list))
	}
}

function createTemplate(button, list) {
	const { MenuItem } = remote
	return new MenuItem({
		label: lang.getTranslation(button, LanguageState),
		submenu: parseMenu(list),
	})
}
/*
 * Convert Graviton's menu to electron's Menu constructor
 */
function parseMenu(list) {
	return list.map(btn => {
		if (btn.label && btn.action) {
			return {
				label: lang.getTranslation(btn.label, LanguageState),
				click: btn.action,
			}
		} else if (btn.label && btn.list) {
			return {
				label: lang.getTranslation(btn.label, LanguageState),
				submenu: parseMenu(btn.list),
			}
		} else {
			return {
				type: 'separator',
			}
		}
	})
}

function appendToBar(item) {
	NativeMenuBar.append(item)
	NativeMenu.setApplicationMenu(NativeMenuBar)
}

export default Menu

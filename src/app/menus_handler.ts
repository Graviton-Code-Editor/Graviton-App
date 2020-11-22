import { ipcMain, MenuItem, Menu } from 'electron'
import Store from './store_handler'

export default window => {
	const OS = (Store.get('config') as any).appPlatform
	const isWindows = OS === 'win32' || (OS === 'auto' && process.platform === 'win32')
	let NativeMenuBar = null

	if (!isWindows) {
		NativeMenuBar = new Menu()
	}

	ipcMain.on('newMenuItem', (e, props) => {
		const obj = parse(props)
		NativeMenuBar.append(new MenuItem(obj))
		Menu.setApplicationMenu(NativeMenuBar)
	})

	ipcMain.on('checkMenuItem', (e, { id, checked }) => {
		const item = NativeMenuBar.getMenuItemById(id)
		item.checked = checked
	})

	ipcMain.on('destroy-menus', (e, props) => {
		if (NativeMenuBar) NativeMenuBar.clear()
	})

	function parse(obj) {
		obj.click = () => {
			window.webContents.send('menuItemClicked', obj.id)
		}
		if (obj.submenu) {
			obj.submenu.map(menu => {
				parse(menu)
			})
		}
		return obj
	}

	ipcMain.on('newContextMenu', (e, scheme) => {
		const NativeContextMenu = new Menu()
		scheme.list.map(option => {
			const item = new MenuItem(parse(option))
			NativeContextMenu.append(item)
		})

		function closeMenu(e, scheme) {
			NativeContextMenu.closePopup()

			ipcMain.off('closeContextMenu', closeMenu)
		}

		const closeMenuListener = ipcMain.on('closeContextMenu', closeMenu)

		NativeContextMenu.popup({
			x: scheme.x,
			y: scheme.y,
			callback() {
				window.webContents.send('contextMenuClosed', scheme.id)
			},
		})
	})
}

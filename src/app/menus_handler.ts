import { ipcMain, MenuItem, Menu } from 'electron'
import Store from './store_handler'

export default window => {
	const OS = (Store.get('config') as any).appPlatform
	const isWindows = OS === 'win32' || (OS === 'auto' && process.platform === 'win32')
	let NativeMenuBar = null

	if (!isWindows) {
		NativeMenuBar = new Menu()
	}
	/*
	 * Append a menu to the menus bar
	 */
	ipcMain.on('newMenuItem', (_, props) => {
		const obj = transformActions(props)
		NativeMenuBar.append(new MenuItem(obj))
		Menu.setApplicationMenu(NativeMenuBar)
	})

	/*
	 * Check a menu item by it's ID
	 */
	ipcMain.on('checkMenuItem', (_, { id, checked }) => {
		const item = NativeMenuBar.getMenuItemById(id)
		item.checked = checked
	})

	/*
	 * Destroy the current menus bar
	 */
	ipcMain.on('destroy-menus', (_, props) => {
		if (NativeMenuBar) NativeMenuBar.clear()
	})
	/*
	 * Transfrom Graviton's `action` event to Electron's `click`
	 */
	function transformActions(obj) {
		obj.click = () => {
			window.webContents.send('menuItemClicked', obj.id)
		}
		if (obj.submenu) {
			obj.submenu.map(menu => {
				transformActions(menu)
			})
		}
		return obj
	}

	/*
	 * Display a native context menu
	 */
	ipcMain.on('newContextMenu', (_, scheme) => {
		const NativeContextMenu = new Menu()

		scheme.list.map(option => {
			const item = new MenuItem(transformActions(option))
			NativeContextMenu.append(item)
		})

		function closeMenu(_, scheme) {
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

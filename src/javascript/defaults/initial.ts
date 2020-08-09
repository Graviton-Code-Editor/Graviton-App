import { Panel, removePanel } from '../constructors/panel'
import '../utils/plugin.loader'
import { element, style } from '@mkenzo_8/puffin'
import { openFolder, openFile } from '../utils/filesystem.ts'
import path from 'path'
import PluginsRegistry from 'PluginsRegistry'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import About from './dialogs/about'
import Languages from '../collections/languages'
import configEditor from './tabs/config.editor.js'
import ContextMenu from '../constructors/contextmenu'
import Notification from '../constructors/notification'
import Explorer from '../constructors/explorer'
import SidePanel from '../constructors/side.panel'
import packageJSON from '../../../package.json'
import { Arctic, Night } from '../collections/themes'
import checkForUpdates from '../utils/check.updates'
import { GravitonIconpack } from '../collections/iconpacks'
import fs from 'fs-extra'
const { openExternal: openLink } = window.require('electron').shell
import createMenus from './menus'
import './environment.inspectors/npm'
import './project.services/node'
import './side.panels/files.explorer'
import './side.panels/env.explorer'
import './shortcuts'
import './status.bar.items/tab.size'
import './status.bar.items/git'
import './status.bar.items/zoom'
import './status.bar.items/debug'
import '../collections/codemirror'
import '../collections/plugins'

const { remote } = require('electron')

export default function init(): void {
	createMenus()

	new Panel() //Initial Panel

	PluginsRegistry.add(Arctic)
	PluginsRegistry.add(Night)
	PluginsRegistry.add({
		PATH: path.join(__dirname, '../../../Graviton'),
		...GravitonIconpack,
	})

	RunningConfig.emit('appLoaded')

	StaticConfig.data.appCheckUpdatesInStartup && checkForUpdates()

	if (RunningConfig.data.isDebug === false && RunningConfig.data.arguments[0]) {
		RunningConfig.data.arguments.map(argv => {
			const dir = path.resolve(remote.process.cwd(), RunningConfig.data.arguments[0])
			if (fs.existsSync(argv)) {
				if (fs.lstatSync(dir).isDirectory()) {
					RunningConfig.emit('addFolderToRunningWorkspace', {
						folderPath: dir,
						replaceOldExplorer: true,
						workspacePath: null,
					})
				} else {
					RunningConfig.emit('loadFile', {
						filePath: dir,
					})
				}
			}
		})
	}
}

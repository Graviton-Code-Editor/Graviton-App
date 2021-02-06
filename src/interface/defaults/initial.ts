import { Panel, removePanel } from 'Constructors/panel'
import { element, style } from '@mkenzo_8/puffin'
import * as path from 'path'
import PluginsRegistry from 'PluginsRegistry'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import Notification from 'Constructors/notification'
import { Arctic, Night } from '../collections/themes'
import checkForUpdates from '../utils/check.updates'
import { GravitonIconpack } from '../collections/iconpacks'
import Core from 'Core'
import createMenus from './menus'
import getFormat from '../utils/format_parser'
import queryString from 'query-string'
import { addPluginToRegistryStatically } from 'PluginLoader'
import { installPluginFromGVP, installPluginFromURL } from './store/utils/install.plugin'
import ExperimentalFeatureDialog from './dialogs/feature_experimental'
import './environment.inspectors/npm'
import './project.services/npm'
import './side.panels/files_explorer'
import './side.panels/project_inspector'
import './side.panels/source_tracker'
import './shortcuts'
import './status.bar.items/tab.size'
import './status.bar.items/git'
import './status.bar.items/zoom'
import './status.bar.items/debug'
import '../collections/codemirror'
import '../collections/plugins'
import '../utils/test'
import './terminal_shells/local'
import '../core/workspaces'

const { fs } = Core

export default async function init() {
	createMenus()

	new Panel() //Initial Panel

	if (RunningConfig.data.isBrowser) {
		addPluginToRegistryStatically({
			PATH: 'Graviton',
			...Arctic,
		})
		addPluginToRegistryStatically({
			PATH: 'Graviton',
			...Night,
		})
		addPluginToRegistryStatically({
			PATH: 'Graviton',
			...GravitonIconpack,
		})

		const RemoteExports = await import('../../../dist_browser_plugins/remote-plugin/index')
		const RemotePkg = await import('../../../dist_browser_plugins/remote-plugin/package.json')

		addPluginToRegistryStatically(RemotePkg, RemoteExports)
	} else {
		StaticConfig.keyChanged('experimentalEditorLSP', value => {
			if (value) {
				ExperimentalFeatureDialog().launch()
			}
		})

		addPluginToRegistryStatically({
			PATH: path.join(__dirname, '../../../Arctic'),
			...Arctic,
		})

		addPluginToRegistryStatically({
			PATH: path.join(__dirname, '../../../Night'),
			...Night,
		})

		addPluginToRegistryStatically({
			PATH: path.join(__dirname, '../../../Graviton'),
			...GravitonIconpack,
		})
	}

	RunningConfig.emit('appLoaded')

	StaticConfig.data.appCheckUpdatesInStartup && checkForUpdates()

	if (RunningConfig.data.isDebug === false && RunningConfig.data.arguments[0]) {
		RunningConfig.data.arguments.map(argv => {
			const dir = path.resolve(process.cwd(), RunningConfig.data.arguments[0])
			if (fs.existsSync(dir)) {
				if (fs.lstatSync(dir).isDirectory()) {
					RunningConfig.emit('addFolderToRunningWorkspace', {
						folderPath: dir,
						replaceOldExplorer: true,
						workspacePath: null,
					})
				} else {
					const fileFormat = getFormat(dir)
					const pluginName = path.parse(dir).name
					if (fileFormat === 'gvp') {
						new Notification({
							title: `Store`,
							content: `Installing ${pluginName}`,
						})
						installPluginFromGVP({
							path: dir,
							name: pluginName,
						}).then(() => {
							new Notification({
								title: `Store`,
								content: `Installed ${pluginName}`,
							})
						})
					} else {
						RunningConfig.emit('loadFile', {
							filePath: dir,
						})
					}
				}
			} else {
				const isGravitonURL = argv.includes('graviton:install?')
				if (isGravitonURL) {
					const { id, url } = queryString.parse(argv)
					installPluginFromURL({
						id,
						release: url,
					}).then((a, b) => {
						new Notification({
							author: 'Graviton',
							title: `Installed ${id}`,
						})
					})
				}
			}
		})
	}
}

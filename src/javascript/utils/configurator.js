import path from 'path'
import fs from 'fs-extra'
import electronStore from 'electron-store'
import getAppDataPath from 'appdata-path'
import AppPlatform from 'AppPlatform'

const DEFAULT_STATIC_CONFIGURATION = {
	config: {
		appTheme: 'Arctic',
		appIconpack: 'Graviton',
		appLanguage: 'english',
		editorFontSize: '16',
		appProjectsLog: [],
		appConfigPath: path.join(getAppDataPath(), '.graviton2'),
		appWorkspacesLog: [],
		appZoom: 1,
		editorFSWatcher: true,
		editorAutocomplete: true,
		editorIndentation: 'tab',
		editorTabSize: 4,
		editorFontFamily: 'JetBrainsMono',
		editorWrapLines: false,
		appPlatform: 'auto',
		appShortcuts: {
			SaveCurrentFile: {
				combos: ['CmdOrCtrl+S'],
			},
			NewPanel: {
				combos: ['CmdOrCtrl+N'],
			},
			CloseCurrentTab: {
				combos: ['CmdOrCtrl+T'],
			},
			CloseCurrentPanel: {
				combos: ['CmdOrCtrl+L'],
			},
			OpenEditorCommandPrompt: {
				combos: ['CmdOrCtrl+I'],
			},
			OpenExplorerCommandPrompt: {
				combos: ['CmdOrCtrl+O'],
			},
			OpenCommandPrompt: {
				combos: ['CmdOrCtrl+P'],
			},
			IterateCurrentPanelTabs: {
				combos: ['CmdOrCtrl+Tab'],
			},
			IncreaseEditorFontSize: {
				combos: ['CmdOrCtrl+Up', 'CmdOrCtrl+ScrollUp'],
			},
			DecreaseEditorFontSize: {
				combos: ['CmdOrCtrl+Down', 'CmdOrCtrl+ScrollDown'],
			},
			CloseCurrentWindow: {
				combos: ['Esc'],
			},
			CloseApp: {
				combos: [],
			},
		},
		miscEnableLiveUpdateInManualConfig: true,
		appBlurEffect: 10,
		appCheckUpdatesInStartup: true,
		appEnableSidebar: true,
		appEnableSidepanel: true,
		appEnableExplorerItemsAnimations: true,
		appOpenWelcomeInStartup: true,
		appCache: {
			store: {
				plugins: [],
			},
		},
		editorsClients: [],
		editorExcludedDirs: [],
	},
}

if (AppPlatform === 'darwin') {
	DEFAULT_STATIC_CONFIGURATION.data.config.appShortcuts.CloseApp.combos.push('CmdOrCtrl+Q')
}

function checkObject(object, subProperty, configurationStore, level) {
	if (level >= 2) return
	Object.keys(object).map(key => {
		let currentLevel = level
		const query = `config${subProperty ? `.${subProperty}` : ''}.${key}`
		if (!configurationStore.has(query)) {
			configurationStore.set(query, object[key])
		}
		const queryValue = object[key]
		if (typeof queryValue == 'object' && !Array.isArray(queryValue)) {
			checkObject(queryValue, key, configurationStore, ++currentLevel)
		}
	})
}

function initConfiguration() {
	const configurationStore = new electronStore()
	if (require('electron').remote.process.env.NODE_ENV !== 'test') console.log(configurationStore)
	checkObject(DEFAULT_STATIC_CONFIGURATION.config, null, configurationStore, 0)
	const gravitonConfigPath = configurationStore.get('config').appConfigPath
	const gravitonPluginsPath = path.join(gravitonConfigPath, 'plugins')

	//If .graviton2 doesn't exist, create it
	if (!fs.existsSync(gravitonConfigPath)) {
		fs.mkdirSync(gravitonConfigPath)
	}

	//If .graviton2/plugins doesn't exist, create it
	if (!fs.existsSync(gravitonPluginsPath)) {
		fs.mkdirSync(gravitonPluginsPath)
	}

	return configurationStore
}

function getConfiguration() {
	const store = initConfiguration()
	return {
		store: store,
		config: store.get('config'),
	}
}

export { initConfiguration, getConfiguration }

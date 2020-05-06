import path from 'path'

const fs = window.require('fs-extra')
const electronStore = window.require('electron-store')
const getAppDataPath = window.require('appdata-path')

const DEFAULT_STATIC_CONFIGURATION = {
	config: {
		appTheme: 'Arctic',
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
		editorWrapLines: false,
		appPlatform: 'auto',
		appShortcuts: {
			SaveCurrentFile: {
				combos: ['Ctrl+S'],
			},
			NewPanel: {
				combos: ['Ctrl+N'],
			},
			CloseCurrentTab: {
				combos: ['Ctrl+T'],
			},
			CloseCurrentPanel: {
				combos: ['Ctrl+L'],
			},
			OpenCommandPrompt: {
				combos: ['Ctrl+P'],
			},
			IterateCurrentPanelTabs: {
				combos: ['Ctrl+Tab'],
			},
			IncreaseEditorFontSize: {
				combos: ['Ctrl+Up', 'Ctrl+ScrollUp'],
			},
			DecreaseEditorFontSize: {
				combos: ['Ctrl+Down', 'Ctrl+ScrollDown'],
			},
			CloseCurrentWindow: {
				combos: ['Esc'],
			},
		},
		miscEnableLiveUpdateInManualConfig: true,
		appBlurEffect: 10,
		appCheckUpdatesInStartup: true,
		appEnableSidebar: true,
		appEnableExplorerItemsAnimations: true,
		appOpenWelcomeInStartup: true,
	},
}

function checkObject(object, subProperty, configurationStore, level) {
	if (level >= 2) return
	Object.keys(object).map(function (key) {
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
	console.log(configurationStore)
	checkObject(DEFAULT_STATIC_CONFIGURATION.config, null, configurationStore, 0)

	//If .graviton2 doesn't exist, it creates it
	if (!fs.existsSync(DEFAULT_STATIC_CONFIGURATION.config.appConfigPath)) {
		fs.mkdirSync(DEFAULT_STATIC_CONFIGURATION.config.appConfigPath)
	}
	//If .graviton2/plugins doesn't exist, it creates it
	console.log(path.join(DEFAULT_STATIC_CONFIGURATION.config.appConfigPath, 'plugins'))
	if (!fs.existsSync(path.join(DEFAULT_STATIC_CONFIGURATION.config.appConfigPath, 'plugins'))) {
		fs.mkdirSync(path.join(DEFAULT_STATIC_CONFIGURATION.config.appConfigPath, 'plugins'))
	}
	return {
		store: configurationStore,
	}
}

function getConfiguration() {
	const { store } = initConfiguration()
	return {
		store: store,
		config: store.get('config'),
	}
}

export { initConfiguration, getConfiguration }

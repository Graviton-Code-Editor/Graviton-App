import * as path from 'path'

/*
 * This contains the default Configuration of a just-installed Graviton version.
 */

const isWindows = process.platform == 'win32'

const defaultConfig = {
	config: {
		appTheme: 'Arctic',
		appIconpack: 'Graviton',
		appLanguage: 'english',
		editorFontSize: '16',
		appProjectsLog: [],
		appConfigPath: '',
		appWorkspacesLog: [],
		appZoom: 1,
		editorFSWatcher: true,
		editorGitIntegration: true,
		editorAutocomplete: true,
		editorIndentation: 'tab',
		editorTabSize: 2,
		editorFontFamily: 'JetBrainsMono',
		editorWrapLines: false,
		appPlatform: 'auto',
		appEnableProjectInspector: true,
		appShortcuts: {
			SaveCurrentFile: {
				combos: [isWindows ? 'Ctrl+S' : 'CmdOrCtrl+S'],
			},
			NewPanel: {
				combos: [isWindows ? 'Ctrl+N' : 'CmdOrCtrl+N'],
			},
			CloseCurrentTab: {
				combos: [isWindows ? 'Ctrl+T' : 'CmdOrCtrl+T'],
			},
			CloseCurrentPanel: {
				combos: [isWindows ? 'Ctrl+L' : 'CmdOrCtrl+L'],
			},
			OpenEditorCommandPrompt: {
				combos: [isWindows ? 'Ctrl+I' : 'CmdOrCtrl+I'],
			},
			OpenExplorerCommandPrompt: {
				combos: [isWindows ? 'Ctrl+O' : 'CmdOrCtrl+O'],
			},
			OpenCommandPrompt: {
				combos: [isWindows ? 'Ctrl+P' : 'CmdOrCtrl+P'],
			},
			IterateCurrentPanelTabs: {
				combos: [isWindows ? 'Ctrl+Tab' : 'CmdOrCtrl+Tab'],
			},
			IncreaseEditorFontSize: {
				combos: [isWindows ? 'Ctrl+Up' : 'Ctrl+Up', 'Ctrl+ScrollUp'],
			},
			DecreaseEditorFontSize: {
				combos: [isWindows ? 'Ctrl+Down' : 'Ctrl+Down', 'Ctrl+ScrollDown'],
			},
			CloseCurrentWindow: {
				combos: ['Esc'],
			},
			CloseApp: {
				combos: [],
			},
			FocusExplorerPanel: {
				combos: [isWindows ? 'Ctrl+E' : 'CmdOrCtrl+E'],
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
		editorMakeTransparentHiddenItems: false,
		appShowTerminal: false,
		experimentalEditorLSP: false,
		experimentalSourceTracker: false,
		appCheckWorkspaceExistsWhenOpeningFolders: true,
	},
}
if (process.platform === 'darwin') {
	defaultConfig.config.appShortcuts.CloseApp.combos.push('Ctrl+Q')
}

export const getElectronConfiguration = app => {
	let { config } = defaultConfig
	config.appConfigPath = path.join(app.getPath('appData'), '.graviton2')
	return {
		config,
	}
}

export const getBrowserConfiguration = () => {
	return defaultConfig
}

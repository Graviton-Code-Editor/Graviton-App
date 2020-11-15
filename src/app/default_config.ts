import * as path from 'path'

/*
 * This contains the default Configuration of a just-installed Graviton version.
 */

const isMac = process.platform == 'darwin'

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
				combos: [isMac ? 'CmdOrCtrl+S' : 'Ctrl+S'],
			},
			NewPanel: {
				combos: [isMac ? 'CmdOrCtrl+N' : 'Ctrl+N'],
			},
			CloseCurrentTab: {
				combos: [isMac ? 'CmdOrCtrl+T' : 'Ctrl+T'],
			},
			CloseCurrentPanel: {
				combos: [isMac ? 'CmdOrCtrl+L' : 'Ctrl+L'],
			},
			OpenEditorCommandPrompt: {
				combos: [isMac ? 'CmdOrCtrl+I' : 'Ctrl+I'],
			},
			OpenExplorerCommandPrompt: {
				combos: [isMac ? 'CmdOrCtrl+O' : 'Ctrl+O'],
			},
			OpenCommandPrompt: {
				combos: [isMac ? 'CmdOrCtrl+P' : 'Ctrl+P'],
			},
			IterateCurrentPanelTabs: {
				combos: [isMac ? 'CmdOrCtrl+Tab' : 'Ctrl+Tab'],
			},
			IncreaseEditorFontSize: {
				combos: [isMac ? 'CmdOrCtrl+Up' : 'Ctrl+Up', 'Ctrl+ScrollUp'],
			},
			DecreaseEditorFontSize: {
				combos: [isMac ? 'CmdOrCtrl+Down' : 'Ctrl+Down', 'Ctrl+ScrollDown'],
			},
			CloseCurrentWindow: {
				combos: ['Esc'],
			},
			CloseApp: {
				combos: [],
			},
			FocusExplorerPanel: {
				combos: [isMac ? 'CmdOrCtrl+E' : 'Ctrl+E'],
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

import * as path from 'path'

/*
 * This contains the default Configuration of a just-installed Graviton version.
 */

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
				combos: ['Ctrl+Up', 'Ctrl+ScrollUp'],
			},
			DecreaseEditorFontSize: {
				combos: ['Ctrl+Down', 'Ctrl+ScrollDown'],
			},
			CloseCurrentWindow: {
				combos: ['Esc'],
			},
			CloseApp: {
				combos: [],
			},
			FocusExplorerPanel: {
				combos: ['Ctrl+E'],
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

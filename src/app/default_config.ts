import * as path from 'path'
try {
	var isBrowser = !!eval('window')
} catch {
	var isBrowser = false
}

/*
 * This contains the default Configuration of a just-installed Graviton version.
 */

const isMac = isBrowser ? false : process.platform == 'darwin'
const isWindows = isBrowser ? false : process.platform == 'win32'

const defaultConfig = {
	config: {
		appTheme: 'Night',
		appIconpack: 'Graviton',
		appLanguage: 'english',
		editorFontSize: '14',
		appProjectsLog: [],
		appConfigPath: '',
		appWorkspacesLog: [],
		appZoom: 1,
		editorFSWatcher: true,
		editorFSIgnoreIgnoredGitFiles: true,
		editorGitIntegration: true,
		editorAutocomplete: true,
		editorIndentation: 'space',
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
			ToggleTerminal: {
				combos: [isMac ? 'CmdOrCtrl+H' : 'Ctrl+H'],
			},
		},
		miscEnableLiveUpdateInManualConfig: true,
		appBlurEffect: 10,
		appCheckUpdatesInStartup: true,
		appEnableSidebar: true,
		appEnableSidepanel: true,
		appEnableExplorerItemsAnimations: true,
		appOpenDashboardInStartup: true,
		appOpenIntroductionInStartup: true,
		appCache: {
			sidePanelWidth: '20%',
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
		editorFold: true,
		terminalDefaultShell: isBrowser ? null : isWindows ? 'PowerShell' : process.env['SHELL'],
	},
}
if (isMac) {
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

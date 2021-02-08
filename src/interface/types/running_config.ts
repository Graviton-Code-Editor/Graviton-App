import { PuffinState } from './puffin.state'
import PuffinElement from './puffin.element'
import { PuffinComponent } from './puffin.component'
import { TabEventArgs } from './tab'
import { FileEventsArgs, FolderEventsArgs } from './file_system'
import { RegisterEnvironmentInspectorArgs } from './env_inspector'
import { RegisterEditorClientArgs } from './editor_client'
import { LoadedGitRepo, gitRepoStatusUpdated } from './git'
import { RegisterCommand } from './utils'
import { EditorClient } from './editorclient'
import { NotificationInstance, NotificationDetails } from './notification'
import { ExplorerProvider } from './explorer_provider'

interface RunningConfigData {
	focusedTab: PuffinElement | null
	focusedPanel: PuffinElement
	focusedEditor: { client; instance } | null
	workspacePath: string | null
	iconpack: any
	isDebug: boolean
	isDev: boolean
	workspaceConfig: {
		name: string
		folders: Array<{ path: string; name: string }>
		settings?: any
	}
	globalCommandPrompt: Array<{ label: string; action: () => void }>
	notifications: NotificationDetails[]
	editorsRank: EditorClient[]
	openedWindows: number
	arguments: string[]
	envs: any[]
	registeredExplorerProviders: ExplorerProvider[]
	ignoredStaticConfig: any
	projectServices: any[]
	languageServers: any[]
	LSPPort: Number
	LSPServers: {
		LanguageMode: {
			server: string[]
		}
	}
	isGitInstalled: Boolean
	focusedExplorerItem: PuffinElement | null
	terminalShells: Array<() => void>
	openedTerminals: Array<{ name: string; state: PuffinState }>
	focusedTerminal: string
	localTerminalAccessories: Array<{ component: PuffinComponent }>
	isBrowser: Boolean
	parsedArguments: string[]
	windowID: string
	explorerProvider: any
	editorContextMenuButtons: any
}

interface CoreEvents {
	/* Core utils, don't use */
	addFolderToRunningWorkspace: any
	removeFolderFromRunningWorkspace: any
	addWorkspaceToLog: any
	writeToClipboard: any
	clipboardHasBeenWritten: any
	writeToClipboardSilently: any
	updatedIconpack: any
	loadFile: any
	checkAllTabsAreSaved: any
	hideAllFloatingComps: any
	setWorkspace: any
	addProjectToLog: any
	removeProjectFromLog: any
	saveCurrentWorkspace: any
	tabSaved: any
	renameWorkspace: any
	renameWorkspaceDialog: any
	removeWorkspaceFromLog: any
	openWorkspaceDialog: any
	addFolderToRunningWorkspaceDialog: any
	appLoaded: any
	allPluginsLoaded: any
	'test.bootedUp': any
}

/**
 * All events which plugins can easily use and listen
 */
interface PluginsEvents {
	/* Tab Events */
	aTabHasBeenCreated: TabEventArgs
	aTabHasBeenClosed: TabEventArgs
	aTabHasBeenFocused: TabEventArgs
	aTabHasBeenUnSaved: TabEventArgs
	aTabHasBeenUnfocused: TabEventArgs
	aTabHasBeenSaved: TabEventArgs
	/* Files and folders Events */
	aFileHasBeenRemoved: FileEventsArgs
	aFileHasBeenCreated: FileEventsArgs
	aFileHasBeenChanged: FileEventsArgs
	aFolderHasBeenChanged: FileEventsArgs
	aFolderHasBeenCreated: FileEventsArgs
	aFolderHasBeenRemoved: FileEventsArgs
	/* Terminal events */
	aTerminalHasBeenClosed: any
	aTerminalHasBeenCreated: any
	/* Terminal utils */
	createTerminalSession: any
	unregisterTerminalShell: any
	addLocalTerminalAccessory: any
	registerTerminalShell: any
	/* Misc events  */
	sidePanelHasBeenResized: any
	mainBoxHasBeenResized: any
	/* Git events */
	loadedGitRepo: LoadedGitRepo
	gitStatusUpdated: gitRepoStatusUpdated
	/* Misc utils */
	registerLanguageServer: any
	registerEnvironmentInspector: any
	registerEditorClient: any
	registerExplorerProvider: ExplorerProvider
	registerCommand: RegisterCommand
	/* Notifications events */
	aNotificationHasBeenCleared: any
	aNotificationHasBeenEmitted: any
	/* Useful commands (no parameters) */
	'command.saveCurrentFile': any
	'command.newPanel': any
	'command.closeCurrentPanel': any
	'command.increaseFontSize': any
	'command.decreaseFontSize': any
	'command.openCurrentPanelTabsIterator': any
	'command.openCommandPrompt': any
	'command.openExplorerCommandPrompt': any
	'command.closeCurrentTab': any
	'command.openEditorCommandPrompt': any
	'command.closeApp': any
	'command.closeCurrentWindow': any
	'command.focusExplorerPanel': any
}

interface AllEvents extends PluginsEvents, CoreEvents {}

export type RunningConfigPluginsInterface = PuffinState<RunningConfigData, PluginsEvents>
export type RunningConfigInterface = PuffinState<RunningConfigData, AllEvents>

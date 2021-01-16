import { PuffinState } from './puffin.state'
import { TabEventArgs } from './tab'
import { FileEventsArgs, FolderEventsArgs } from './file_system'
import { RegisterEnvironmentInspectorArgs } from './env_inspector'
import { RegisterEditorClientArgs } from './editor_client'
import { LoadedGitRepo, gitRepoStatusUpdated } from './git'
import { RegisterCommand } from './utils'

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
	registeredExplorerProvider: any
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

export type RunningConfigPluginsInterface = PuffinState<PluginsEvents>
export type RunningConfigInterface = PuffinState<AllEvents>

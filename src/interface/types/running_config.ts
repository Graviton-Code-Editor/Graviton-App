import { PuffinState } from './puffin.state'
import { TabEventArgs } from './tab'
import { FileEventsArgs, FolderEventsArgs } from './file_system'
import { RegisterEnvironmentInspectorArgs } from './env_inspector'
import { RegisterEditorClientArgs } from './editor_client'

type EventsNames =
	/*
	 * Allow custom event names
	 */
	| string
	/*
	 * Event fired when the app is fully loaded
	 * interface: none
	 */
	| 'appLoaded'
	/*
	 * Event fired when a tab is created
	 * interface: TabEventArgs
	 */
	| 'aTabHasBeenCreated'
	/*
	 * Event fired when a tab is focused
	 * interface: TabEventArgs
	 */
	| 'aTabHasBeenFocused'
	/*
	 * Event fired when a tab is closed
	 * interface: TabEventArgs
	 */
	| 'aTabHasBeenClosed'
	/*
	 * Event fired when a file has been created in any of the opened folders
	 * interface: FileEventsArgs
	 */
	| 'aFileHasBeenCreated'
	/*
	 * Event fired when a file has been changed (it's content got modified) in any of the opened folders
	 * interface: FileEventsArgs
	 */
	| 'aFileHasBeenChanged'
	/*
	 * Event fired when a folder has been created in any of the opened folders
	 * interface: FileEventsArgs
	 */
	| 'aFolderHasBeenChanged'
	/*
	 * Event fired when a folder (aka project) is opened
	 */
	| 'addFolderToRunningWorkspace'
	/*
	 * Event fired when a folder (aka project) is no longer opened
	 */
	| 'removeFolderFromRunningWorkspace'
	/*
	 * Event fired when a LSP server is being registered
	 */
	| 'registerLanguageServer'
	/*
	 * Event fired when a Environment (aka Project) Inspector is being registered
	 * interface: RegisterEnvironmentInspectorArgs
	 */
	| 'registerEnvironmentInspector'
	/*
	 * Event fired when a Editor client is being registered
	 * Interface: RegisterEditorClientArgs
	 */
	| 'registerEditorClient'

interface customEventsArgs {
	[key: string]: any
}

/*
 * Mix all Events's arguments interfaces into one
 */
interface EventsArgs extends TabEventArgs, FileEventsArgs, FolderEventsArgs, RegisterEnvironmentInspectorArgs, customEventsArgs, RegisterEditorClientArgs {}

interface RunningConfig extends PuffinState<EventsNames, EventsArgs> {}

export default RunningConfig

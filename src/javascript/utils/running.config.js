import { state } from '@mkenzo_8/puffin'
import CodemirrorClient from '../defaults/codemirror.client'
import ImageViewerClient from '../defaults/imageviewer.client'
const isDev = window.require('electron-is-dev')

const electronArguments = window.require('electron').remote.getCurrentWindow().argv || []
let isDebug = window.require('electron').remote.getCurrentWindow().isDebug
if (isDebug == null) isDebug = true

let DEFAULT_RUNTIME_CONFIGURATION = {
	focusedPanel: null,
	focusedTab: null,
	focusedEditor: null,
	workspacePath: null,
	iconpack: {},
	isDebug,
	isDev,
	workspaceConfig: {
		name: null,
		folders: [],
	},
	globalCommandPrompt: [],
	notifications: [],
	editorsRank: [CodemirrorClient, ImageViewerClient],
	openedWindows: 0,
	arguments: electronArguments,
	currentStaticConfig: {},
	envs: [],
	projectServices: [],
}

const RunningConfig = new state(DEFAULT_RUNTIME_CONFIGURATION)

console.log(RunningConfig)

export default RunningConfig

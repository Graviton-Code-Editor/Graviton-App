import { puffin } from '@mkenzo_8/puffin'
import CodemirrorClient from '../defaults/codemirror.client'
import ImageViewerClient from '../defaults/imageviewer.client'
import requirePath from './require'

let Config = {
    focusedPanel:null,
    focusedTab:null,
    focusedEditor:null,
    workspacePath:null,
    workspaceConfig:{
        name:null,
        folders:[],
    },
    globalCommandPrompt:[],
    notifications:[],
    editorsRank:[
        CodemirrorClient, //Default editor
        ImageViewerClient
    ],
	arguments:requirePath("electron").remote.getCurrentWindow().argv
}

const RunningConfig = new puffin.state(Config)
console.log(RunningConfig)
export default RunningConfig
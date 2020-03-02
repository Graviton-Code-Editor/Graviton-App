import { puffin } from '@mkenzo_8/puffin'
import CodemirrorClient from '../defaults/codemirror.client'
import ImageViewerClient from '../defaults/imageviewer.client'

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
    ]
}

const RunningConfig = new puffin.state(Config)
console.log(RunningConfig)
export default RunningConfig
import { puffin } from '@mkenzo_8/puffin'

let Config = {
    focusedPanel:null,
    focusedTab:null,
    focusedEditor:null,
    workspacePath:null,
    workspaceConfig:{
        name:null,
        folders:[],
    },
    globalCommandPrompt:[]
}

const RunningConfig = new puffin.state(Config)
console.log(RunningConfig)
export default RunningConfig
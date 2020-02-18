import {puffin} from '@mkenzo_8/puffin'

let Config = {
    focusedPanel:null,
    focusedTab:null,
    focusedEditor:null,
    openedFolders:[]
}

const RunningConfig = new puffin.state(Config)

export default RunningConfig
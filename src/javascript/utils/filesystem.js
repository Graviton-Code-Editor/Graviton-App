import requirePath from '../utils/require'
import StaticConfig from 'StaticConfig'
import Explorer from '../constructors/explorer'
import RunningConfig from 'RunningConfig'
import parseDirectory from './directory.parser'
import InputDialog from '../constructors/dialog.input'

const path = requirePath("path")
const fs = requirePath("fs-extra")

function selectFolderDialog(){
    return new Promise((resolve, reject) => {
        const { dialog , getCurrentWindow} = requirePath("electron").remote;
        dialog
            .showOpenDialog(getCurrentWindow(), {
                properties: ["openDirectory"]
            })
            .then(result => {
                if (result.canceled) return;
                resolve(result.filePaths[0])
            })
            .catch(err => {
                reject(err)
            });
    })
}

function selectFileDialog(){
    return new Promise((resolve, reject) => {
        const { dialog , getCurrentWindow} = requirePath("electron").remote;
        dialog
            .showOpenDialog(getCurrentWindow(), {
                properties: ["openFile"]
            })
            .then(result => {
                if (result.canceled) return;
                resolve(result.filePaths[0])
            })
            .catch(err => {
                reject(err)
            });
    })
}

function openFolder(){
    return new Promise((resolve, reject) => {
        selectFolderDialog().then(function(res){
            if(!StaticConfig.data.log.filter((a)=>a.directory ==res)[0]){
                StaticConfig.data.log.splice(0, 0, {
                    directory:res
                })
                StaticConfig.data.log.join()
            }
            StaticConfig.triggerChange()
            resolve(res)
        }).catch(err => {
            reject(err)
        });
    })
}

function openWorkspace(state){
    selectFileDialog().then(function(res){
        loadWorkspace(state,res)
    }).catch(function(err){
        console.log(err)
    })
}

function loadWorkspace(state,path){
    const workspaceConfig = require(path)
    state.data.workspacePath = {
        exists:true,
        path:path,
        name:workspaceConfig.name,
        folders:workspaceConfig.folders
    }
    workspaceConfig.folders.map(folder=>{
        state.emit('addFolderToWorkspace',{
            path:folder,
            replaceOldExplorer:false
        })
    })
    addRecentWorkspace(StaticConfig,path)
    return 
}

function addRecentWorkspace(state,path){

    const existingWorkspace = state.data.recentWorkspaces.filter(workspace=>{
        return workspace.path == path
    })[0]

    if(existingWorkspace == null){
        state.data.recentWorkspaces.push({
            name:RunningConfig.data.workspacePath.name,
            path:RunningConfig.data.workspacePath.path,
            folders:RunningConfig.data.workspacePath.folders
        })
        state.triggerChange()
    }
}

function isWorkspaceLoaded(){
    return  RunningConfig.data.exists
}

function stringifyWorkspaceConfig(){
    return JSON.stringify({
        name:RunningConfig.data.workspacePath.name,
        folders:RunningConfig.data.openedFolders.map(({absolutePath})=>absolutePath)
    })
}

function addFolderToWorkspace(){
    selectFolderDialog().then(function(res){
        RunningConfig.emit('addFolderToWorkspace',{
            path:res,
            replaceOldExplorer:false
        })
    }).catch(err => {
        reject(err)
    });
}

function removeWorkspace(workspacePath){
    const index = (function(){
        let index = 0;
        StaticConfig.data.recentWorkspaces.forEach(({path},i)=>{
            if(path == workspacePath) return index = i;
        })
        return index
    })()
    StaticConfig.data.recentWorkspaces.splice(index,1)
    StaticConfig.triggerChange()
}

StaticConfig.on('saveCurrentWorkspace',function(){
    function saveWorkspaceConfig(){
        fs.writeFile(RunningConfig.data.workspacePath.path,stringifyWorkspaceConfig(),'UTF-8', (err, data) => {
            if (err) throw err;
        });
    }
    if(RunningConfig.data.workspacePath.exists){
        saveWorkspaceConfig()
    }else{
        selectFolderDialog().then(function(res){
            new InputDialog({
                title:'Name your workspace',
                placeHolder:'My workspace'
            }).then(function(name){
                const resultWorkspace = path.join(res,'gv-workspace.json')
                RunningConfig.data.workspacePath = {
                    exists:true,
                    path:resultWorkspace,
                    folders:RunningConfig.data.openedFolders.map(folder=>folder.absolutePath),
                    name
                }
                addRecentWorkspace(StaticConfig,resultWorkspace)
                saveWorkspaceConfig()
            })   
        })
    }
})

export { 
    openFolder,
    openWorkspace,
    addFolderToWorkspace,
    isWorkspaceLoaded,
    loadWorkspace,
    removeWorkspace
}
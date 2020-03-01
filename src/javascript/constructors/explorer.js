import { puffin } from '@mkenzo_8/puffin'
import requirePath from '../utils/require'
import Item from '../components/explorer/item'
import path from 'path'
import parseDirectory from '../utils/directory.parser'
import RunningConfig from 'RunningConfig'
import Notification from './notification'
import "babel-polyfill";

const fs = requirePath('fs-extra')
const simpleGit = requirePath("simple-git")

function checkIfProjectIsGit(path){
    const simpleInstance = simpleGit(path)
    return new Promise((resolve,reject)=>{
        simpleInstance.checkIsRepo((err,res)=>{
            if(!err) {
                resolve(res)
            }else{
                reject(err)
            }
        })
        
    })
}

function getStatus(path){
    const simpleInstance = simpleGit(path)
    return new Promise((resolve,reject)=>{
        simpleInstance.status((err,res)=>{
            resolve(res)
        }) 
    })
}

async function Explorer(folderPath,parent,level = 0,replaceOldExplorer=true,gitChanges=null){
    if(level == 0){

        let gitResult = await checkIfProjectIsGit(folderPath)

        if( gitResult ) gitChanges = await getStatus(folderPath)

        const explorerContainer = puffin.element(`
            <Item isDirectory="true" parentFolder="${folderPath}" path="${parseDirectory(folderPath)}" fullpath="${folderPath}" level="0"/>
        `,{
            components:{
                Item:Item()
            },
            events:{
                mounted(){
                    this.state.emit('doReload')
                    this.gitChanges = gitChanges
                }
            }
        })
        if(replaceOldExplorer && parent.children[0] != null){
            for( let otherExplorer of parent.children){
                RunningConfig.emit('removeFolderFromRunningWorkspace',{
                    folderPath:otherExplorer.getAttribute("fullpath")
                })
            }
        }
        
        puffin.render(explorerContainer,parent,{
            removeContent:replaceOldExplorer
        })
    }

    fs.readdir(folderPath).then(function(paths){
        const explorerComponent = puffin.element(`
            <div class="${puffin.style.css`
                &{
                    padding:0px 7px;
                }
            `}">
                ${(function(){
                    let content = "";
                    paths.map(function(dir){
                        if(fs.lstatSync(path.join(folderPath,dir)).isDirectory()){
                            content += `<Item isDirectory="true" parentFolder="${parent.getAttribute("parentFolder")}" path="${dir}" fullpath="${path.join(folderPath,dir)}" level="${level}"/>` 
                        }
                    })
                    paths.map(function(dir){
                        if(!fs.lstatSync(path.join(folderPath,dir)).isDirectory()){
                            if(! dir.match("~") )
                                content += `<Item isDirectory="false" parentFolder="${parent.getAttribute("parentFolder")}" path="${dir}" test="${path.join(folderPath,dir)}" fullpath="${path.join(folderPath,dir)}" level="${level}"/>` 
                        }
                    })
                    return content
                })()}
            </div>
        `,{
            components:{
                Item:Item()
            },
            events:{
                mounted(){
                    this.gitChanges = gitChanges
                }
            }
        })
        if(level != 0){
            puffin.render(explorerComponent,parent,{
                removeContent:false
            })
        }
    }).catch(err=>{
        console.log(err)
        new Notification({
            title:'Error',
            content:err
        })
    })    
}

export default Explorer
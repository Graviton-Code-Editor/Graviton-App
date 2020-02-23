import { puffin } from '@mkenzo_8/puffin'
import requirePath from '../utils/require'
import Item from '../components/explorer/item'
import path from 'path'
import parseDirectory from '../utils/directory.parser'
import RunningConfig from 'RunningConfig'
import { saveWorkspace, isWorkspaceLoaded } from '../utils/filesystem'

RunningConfig.on('addFolderToWorkspace',function({
    path,
    replaceOldExplorer = true
}){
    RunningConfig.data.openedFolders.push({
        absolutePath:path,
        folderName:parseDirectory(path)
    })
    new Explorer(path,document.getElementById("sidepanel"),0,replaceOldExplorer)
    if( isWorkspaceLoaded() ) saveWorkspace()
});

function Explorer(folderPath,parent,level = 0,replaceOldExplorer=true){
    const fs = requirePath('fs-extra')
    if(level == 0){
        const explorerContainer = puffin.element(`
            <Item isDirectory="true" parentFolder="${folderPath}" path="${parseDirectory(folderPath)}" fullpath="${folderPath}" level="0"/>
        `,{
            components:{
                Item:Item()
            },
            events:{
                mounted(target){
                    target.state.emit('doReload')
                }
            }
        })
        if(replaceOldExplorer && parent.children[0] != null){

            for( let otherExplorer of parent.children){
                const index = RunningConfig.data.openedFolders.filter(({absolutePath,folderName},i)=>{
                    if(absolutePath == otherExplorer.getAttribute("fullpath") && 
                    folderName == parseDirectory(otherExplorer.getAttribute("fullpath"))) return i
                })[0]

                RunningConfig.data.openedFolders.splice(index,1) //Remove old opened folder from opened folders
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
                            content += `<Item isDirectory="false" parentFolder="${parent.getAttribute("parentFolder")}" path="${dir}" fullpath="${path.join(folderPath,dir)}" level="${level}"/>` 
                        }
                    })
                    return content
                })()}
            </div>
        `,{
            components:{
                Item:Item()
            }
        })
        if(level != 0){
            puffin.render(explorerComponent,parent,{
                removeContent:false
            })
        }
    }).catch(err=>console.log(err))

    
}

export default Explorer
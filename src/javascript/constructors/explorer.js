import requirePath from '../utils/require'
import { puffin } from '@mkenzo_8/puffin'
import Item from '../components/explorer/item'
import path from 'path'
import parseDirectory from '../utils/directory.parser'
import RunningConfig from 'RunningConfig'

function Explorer(folderPath,parent,level = 0){
    if(level == 0){
        const explorerContainer = puffin.element(`
            <Item isDirectory="true" parentFolder="${folderPath}" path="${parseDirectory(folderPath)}" fullpath="${folderPath}" level="0"/>
        `,{
            components:{
                Item:Item()
            },
            events:{
                mounted(target){
                    target.reload()
                }
            }
        })

        if(parent.children[0] != null){
            const index = RunningConfig.data.openedFolders.indexOf({
                absolutePath:parent.children[0].getAttribute("fullpath"),
                folderName:parseDirectory(parent.children[0].getAttribute("fullpath"))
            })
            RunningConfig.data.openedFolders.splice(index,1) //Remove old opened folder from opened folders
        }

        puffin.render(explorerContainer,parent,{
            removeContent:true
        })

    }
    
    const fs = requirePath('fs-extra')
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
        }else{
            RunningConfig.data.openedFolders.push({
                absolutePath:folderPath,
                folderName:parseDirectory(folderPath)
            })
        }
    })    

    
}

export default Explorer
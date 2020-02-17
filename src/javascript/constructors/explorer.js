import requirePath from '../utils/require'
import { puffin } from '@mkenzo_8/puffin'
import Item from '../components/explorer/item'
import path from 'path'
import parseDirectory from '../utils/directory.parser'

function Explorer(folderPath,parent,level = 0){
    if(level == 0){
        var test = puffin.element(`
            <Item isDirectory="true" path="${parseDirectory(folderPath)}" fullpath="${folderPath}" level="0"/>
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
        puffin.render(test,parent,{
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
                            content += `<Item isDirectory="true" path="${dir}" fullpath="${path.join(folderPath,dir)}" level="${level}"/>` 
                        }
                    })
                    paths.map(function(dir){
                        if(!fs.lstatSync(path.join(folderPath,dir)).isDirectory()){
                            content += `<Item isDirectory="false" path="${dir}" fullpath="${path.join(folderPath,dir)}" level="${level}"/>` 
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
    })    
}

export default Explorer
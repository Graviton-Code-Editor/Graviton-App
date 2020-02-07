import requirePath from '../utils/require'
import { puffin } from '@mkenzo_8/puffin'
import Item from '../components/explorer/item'
import path from 'path'

function Explorer(folderPath,parent,level = 0){
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
        puffin.render(explorerComponent,parent,{
            removeContent:level==0
        })
    })    
}

export default Explorer
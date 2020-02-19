import Dialog from '../../constructors/dialog'
import { puffin } from '@mkenzo_8/puffin'
import requirePath from '../../utils/require'
import path from 'path'

const fs = requirePath("fs-extra")

function newDirectoryDialog({
    isFolder,
    parentDirectory,
    explorerContainer
}){
    const randomSelector = Math.random();
    const component = puffin.element(`
        <div>
            <input id="${randomSelector}" placeHolder="Enter a name" keyup="$onEnter"/>
        </div>
    `,{
        methods:{
            onEnter(e){
                if(e.keyCode === 13){
                    e.preventDefault()
                    createDirectory(this,isFolder,parentDirectory,explorerContainer,DialogInstance)
                    DialogInstance.close()
                }
            }
        },
        events:{
            mounted(target){
                target.children[0].focus()
            }
        }
    })

    const DialogInstance = new Dialog({
        title:isFolder?'New Folder':'New file',
        component,
        buttons:[
            {
                label:'Continue',
                action(){
                    createDirectory(document.getElementById(randomSelector),isFolder,parentDirectory,explorerContainer,DialogInstance)
                }
            }
        ]
    })
}

function createDirectory(target,isFolder,parentDirectory,explorerContainer,DialogInstance){
    const dir = path.join(parentDirectory,target.value)
    if (!fs.existsSync(dir)){
        if(isFolder){
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
                explorerContainer.state.emit('doReload')
            }
        }else{
            fs.writeFile(dir, '', (err) => {
                if (err) throw err;
                explorerContainer.state.emit('doReload')
            }); 
        }     
    }
    
}

export default newDirectoryDialog
import { puffin } from '@mkenzo_8/puffin'
import Explorer from '../../constructors/explorer'
import ContextMenu from '../../constructors/contextmenu'
import Panel from '../../constructors/panel'
import Editor from '../../constructors/editor'

import ClosedFolder from '../../../../assets/icons/folder.closed.svg'
import OpenedFolder from '../../../../assets/icons/folder.opened.svg'

import requirePath from '../../utils/require'
const fs = requirePath("fs-extra");


const ItemWrapper = puffin.style.div`

    &{
        background:transparent;
        white-space:nowrap;
        padding:0px;

    }
    & button{
        margin:0;
        border-radius:5px;
        font-size:13px;
        transition:0.05s;
        padding:3px 5px;
        border:none;
        margin:0px;
        background:transparent;
        outline:0;
        white-space:nowrap;
        display:flex;
        align-items: center;
        justify-content: center;
    }
    & button *{
        align-items: center;
        display:flex;
    }
    & button:hover{
        background:rgba(150,150,150,0.6);
        transition:0.05s;
    }
    & .icon{
        height:20px;
        width:20px;
        margin-right:4px;
        position:relative;
    }

`

const Item = puffin.element(`
    <ItemWrapper>
        
        <button click="$openFolder" contextmenu="$contextMenu">
            <img class="icon"/>
            <span>{{path}}</span>
        </button>
    </ItemWrapper>
`,{
    props:['path'],
    components:{
        ItemWrapper
    },
    methods:{
        openFolder(e){
            if(this.parentElement.getAttribute("isDirectory") == "true"){
                if(this.parentElement.children[1] == null){
                    new Explorer(this.parentElement.getAttribute("fullpath"),this.parentElement,Number(this.parentElement.getAttribute("level"))+1)
                    setOpenIcon(this.parentElement.children[0].children[0])
                }else{
                    this.parentElement.children[1].remove()
                    setClosedIcon(this.parentElement.children[0].children[0])
                }
            }else{
                //Open the file
                const { element } = new Panel()
                fs.readFile(this.parentElement.getAttribute("fullpath"),'UTF-8').then(function(data){
                    new Editor({
                        element:element,
                        language:'javascript',
                        value:data ,
                        theme:'arctic'
                    })
                })
            }
        },
        contextMenu(e){
            if(this.parentElement.getAttribute("isDirectory") == "true"){
                new ContextMenu({
                    list:[
                        {
                            label:"New folder",
                            action:()=>console.log("test")
                        }
                    ],
                    parent:this,
                    event:e
                })
            }
        }
    },
    events:{
        mounted(target){
            target.children[0].children[1].textContent = target.props.path //FIX

            target.style.paddingLeft = `${Number(target.getAttribute("level"))*6}px`

            if(target.getAttribute("isDirectory") == "true"){
                setClosedIcon(target.children[0].children[0])
            }
            
        }
    }
})

function setOpenIcon(target){
    target.src = OpenedFolder
}

function setClosedIcon(target){
    target.src = ClosedFolder
}

export default Item
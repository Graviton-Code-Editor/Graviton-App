import {puffin} from '@mkenzo_8/puffin'

const BootAnimation = puffin.element(`
    <div class="${puffin.style.css`

        &{
            padding:100px;
            background:white;
            position:fixed;
            top:0;
            left:0;
            min-height:100%;
            min-width:100%;
            color:black;
        }
    
    `}">
        Loading Graviton Editor.
    </div>
`,{
    events:{
        mounted(target){
            window.addEventListener("load",function(){
                console.log("%c 🎉 Loaded successfully. ", "color:black; border-radius:10px; background:pink; padding:3px 8px; margin:5px 0px;")
                target.remove()
            })
        }
    }
})

export default BootAnimation
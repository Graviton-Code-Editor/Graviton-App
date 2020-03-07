import { puffin } from '@mkenzo_8/puffin'

function ContextMenu({
    list,
    parent,
    event,
    x,
    y
}){

    const ContextWrapper = puffin.style.div`
        ${ThemeProvider}
        &{
            background:var(--contextmenuBackground);
            padding:5px;
            position:fixed;
            color:white;
            border-radius:5px;
            box-shadow:0px 0px 3px rgba(0,0,0,0.2);
            display:block;
        }
        & > button{
            background:var(--contextmenuButtonBackground);
            color:var(--contextmenuButtonText);
            border:0;
            padding:6px;
            outline:0;
            border-radius:5px;
            display:block;
            width:100%;
            text-align:left;
        }
        & >  button:hover{
            background:var(--contextmenuButtonHoveringBackground);
            color:var(--contextmenuButtonHoveringText);
        }
        & >  span{
            height:1.5px;
            border-radius:25px;
            width:95%;
            display:block;
            background:var(--contextmenuDivider);
            margin:3px auto;
        }

    `
    const randomSelector = Math.random()
    const contextMenusCreated = document.getElementsByClassName("contextMenu");
    const computedMethods = {...list.map(a=>a.action)}
    if(contextMenusCreated.length != 0) {
        contextMenusCreated[0].remove()
    }
    const positions = {
        x:event!= null?event.pageX:x,
        y:event!= null?event.pageY:y,
    }
    const ContextComponent = puffin.element(`
            <ContextWrapper id="${randomSelector}" class="contextMenu" style="top:${positions.y}px; left:${positions.x};">
                ${(function(){
                    let content = "";
                        list.map((option,index)=>{
                            if(option.label != undefined){
                                content += `<button click="$${index}">${option.label}</button>`
                            }else{
                                content += `<span/>`
                            }
                            
                        })
                    return content
                })()}
            </ContextWrapper>
        `,{
            methods:computedMethods,
            components:{
                ContextWrapper
            },
            events:{
                mounted(target){
                    parent.setAttribute("hasContext","true")
                    
                    window.addEventListener("click",(e)=>{
                        if(e.target != parent) target.remove()
                    })
                    window.addEventListener("contextmenu",(e)=>{
                        e.stopPropagation()
                        
                    })

                    const calculatedHeight = positions.y-((positions.y+target.clientHeight)-window.innerHeight)-5

                    if(positions.y+target.clientHeight>window.innerHeight){
                        target.style.top = calculatedHeight
                    }
                    
                }
            }
        })
        puffin.render(ContextComponent,document.body) 
}

export default ContextMenu
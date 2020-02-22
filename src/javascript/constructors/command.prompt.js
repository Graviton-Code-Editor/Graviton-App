import { puffin } from '@mkenzo_8/puffin'
import CommandPromptBody from '../components/command.prompt/command.prompt'
import WindowBackground from '../components/window/background'

function CommandPrompt({
    name=Math.random(),
    showInput = true,
    inputPlaceHolder = "",
    options=[],
    onSelected = ()=>{}
}){
    if(document.getElementById(name) != null) return;

    let CommandPromptState = new puffin.state({
        hoveredOption : null
    })

    const CommandPromptComponent = puffin.element(`
            <CommandPromptBody id="${name}" keydown="$scrolling">
                <WindowBackground window="${name}"/>
                <div class="container">
                    ${(function(){
                        if( showInput ) return `<input placeHolder="${inputPlaceHolder}" keyup="$writing"/>`
                    })()}
                    <div/>
                </div>
            </CommandPromptBody>
    `,{
        components:{
            CommandPromptBody,
            WindowBackground
        },
        methods:{
            writing(e){
                e.preventDefault()
                switch(e.keyCode){
                    case 13:
                        selectOption({state:CommandPromptState},{onSelected})
                        closeCommandPrompt(CommandPromptComponent)
                        break;
                    case 38:
                    case 40:
                        break;
                    default:
                        renderOptions(
                            {
                                options:filterOptions(this.value,{
                                    options
                                }),
                                onSelected
                            },
                            {
                                parent:this.parentElement.children[1],
                                state:CommandPromptState,
                                component:CommandPromptComponent
                            }
                        )
                }
            },
            scrolling(e){
                switch(e.keyCode){
                    case 9:
                        e.preventDefault()
                        break;
                    case 38:
                        scrollOptions({
                            state:CommandPromptState,
                            scrollingDirection:'up'
                        })
                        break;
                    case 40:
                        scrollOptions({
                            state:CommandPromptState,
                            scrollingDirection:'down'
                        })
                        break;
                }
            }
        },
        events:{
            mounted(target){
                const container = target.children[1].children[1]
                const input = target.children[1].children[0]

                renderOptions(
                    {
                        options,
                        onSelected
                    },
                    {
                        parent:container,
                        state:CommandPromptState,
                        component:CommandPromptComponent
                    }
                )
                window.addEventListener('keydown',(e)=>{
                    if(e.keyCode === 27){
                        closeCommandPrompt(CommandPromptComponent)
                    }
                })
                if(showInput){
                    input.focus()
                }
            }
        }
    })

    puffin.render(CommandPromptComponent,document.getElementById("windows"))
}

function closeCommandPrompt(CommandPromptComponent){
    CommandPromptComponent.node.remove()
}

function scrollOptions({state,scrollingDirection}){
    const hoveredOption = state.data.hoveredOption
    const allOptions = hoveredOption.parentElement.children
    const hoveredOptionPosition = (function(){
        let index = 0;
        for(let option of allOptions){
            if(option == hoveredOption) break;
            index++
        }
        return index
    })()

    if(scrollingDirection == "up" && hoveredOptionPosition != 0 ){
        state.data.hoveredOption = allOptions[hoveredOptionPosition-1]
    }else if(scrollingDirection == "down" && hoveredOptionPosition != allOptions.length -1  ){
        state.data.hoveredOption = allOptions[hoveredOptionPosition+1]
    }

    hoverOption(state.data.hoveredOption,allOptions)   
}

function hoverOption(hoveredOption,allOptions){
    for(let option of allOptions){
        if(option == hoveredOption){
            option.classList.add('active');
        }else{
            option.classList.remove('active');
        }
    }
}

function filterOptions(search,{
    options
}){
    return options.map(function(option){
        if(option.label.match(new RegExp(search, "i"))) return option
    }).filter(Boolean)
}

function renderOptions({
    options,
    onSelected
},{
    state,
    parent,
    component
}){
    let content = ""
    options.map(({label})=>{
        content+=`
            <a click="$onClicked">${label}</a>
        `
    })

    const optionsComp = puffin.element(`
        <div>${content}</div>
    `,{
        methods:{
            onClicked(){
                closeCommandPrompt(component)
                selectOption({state},{onSelected})
            }
        }
    })

    puffin.render(optionsComp,parent,{
        removeContent:true
    })

    state.data.hoveredOption = parent.children[0].children[0]
    hoverOption(state.data.hoveredOption,parent.children[0].children)
}

function selectOption({state},{onSelected}){
    onSelected({
        label:state.data.hoveredOption.textContent
    })
}

export default CommandPrompt
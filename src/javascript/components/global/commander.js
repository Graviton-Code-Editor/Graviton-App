function openCommander(Commander){
    const commander = puffin.element(`
        <div count="0" id="commander_container" class="commander_container commander_struct">
            <input class="commander_struct" placeHolder="Write a command" keydown="$scrolling"  keyup="$writing"/>
            <div class="commander_struct">

            </div>
        </div>
    `,{
        events:{
            mounted(target){
                if(Commander.showAnimation){
                    target.style = "  animation: open_commander 0.10s;"
                }
                target.children[0].focus()
                showOptions(Commander.options)
            }
        },
        methods:[
            function scrolling(e){
                switch(e.keyCode){
                    case 13:
                        selectFromOption(Commander)
                        break;
                    case 38:
                        hintOption("up")
                        break;
                    case 40:
                        hintOption("down")
                        break;
                }                
            },
            function writing(e){
                switch(e.keyCode){
                    case 13:
                    case 38:
                    case 40:
                        break;
                    case 91:
                    case 18:
                        closeCommander()
                        break;
                    default:
                        showOptions(matchCommands(Commander,this.value))
                        break;
                }                
            }
        ]
    })
    puffin.render(commander,document.body)
}

function selectFromOption(Commander){
    const commander = document.getElementById("commander_container")
    const option = commander.getElementsByClassName("active")[0]
    if(option != undefined){
        const value = option.textContent
        if(existsCommand(Commander,value)){
            if(Commander.closeOnEnter){
                closeCommander()
            }
            executeCommand(Commander,value)
        }
    }
    
}

function hintOption(direction){
    const commander = document.getElementById("commander_container")
    const list = commander.children[1].children[0]
    let currentOption = Number(commander.getAttribute("count"))
    switch(direction){
        case "up":
            if(currentOption > 0) {
                list.children[currentOption].classList.toggle("active")
                commander.setAttribute("count",--currentOption)
                list.children[currentOption].classList.toggle("active")
                if(currentOption < list.children.length){
                    list.parentElement.scrollTop -=33
                }
            }
           
        break;
        case "down":
            if(currentOption < list.children.length-1){
                list.children[currentOption].classList.toggle("active")
                currentOption++
                commander.setAttribute("count",currentOption)
                list.children[currentOption].classList.toggle("active")
                if(currentOption > 8){
                    list.parentElement.scrollTop +=33
                }
            }
            
        break;
    }
}

function CommandLauncher({options, showAnimation = true, closeOnEnter = true}){
    return {
        options:options,
        open : ()=> openCommander({
            options:options,
            showAnimation:showAnimation,
            closeOnEnter:closeOnEnter
        }),
        close : ()=> closeCommander()
    }
}

function matchCommands(Commander,command){
   
    if(command == ""){
        return Commander.options
    }else{
        return Commander.options.filter((cmd)=>{
            return cmd.name.match(command)
        })
    }
}

function closeCommander(){
    const target = document.getElementById("commander_container")
    if(target!=null) target.remove()
}

function existsCommand(Commander,command){
    const commandSelected = Commander.options.filter(cmd => cmd.name == command)[0]
    return commandSelected == undefined? false:true
}

function executeCommand(Commander,command){
    const commandSelected = Commander.options.filter(cmd => cmd.name == command)[0]
    if(commandSelected != undefined) commandSelected.action()
}

function showOptions(options){
    const commander = document.getElementById("commander_container")
    const element = commander.children[1]
    commander.setAttribute("count",0)
    element.innerHTML = "";    
    const option = puffin.element(`
        <a click="$onClick" name="{{text}}" class="commander_struct">{{text}}</a>
    `,{
        methods:[
            function onClick(){
                options.filter(a=>a.name == this.text)[0].action()
            }
        ],
        props:["text"]
    })

    const list = puffin.element(`
        <div>
        ${(function(){
            let content = "";
            options.map((opt,index)=>{
                content += `<option text="${opt.name}" class="${index==0?'active':''}"/>`
            })
            return content;
        })()}
        </div>
    `,{
        components:{
            option
        }
    })

    puffin.render(list,element)
}


module.exports = {CommandLauncher,closeCommander}
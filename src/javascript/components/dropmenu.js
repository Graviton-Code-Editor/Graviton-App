import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from '../utils/themeprovider'

function hideAllMenus(element){
    const otherMenus = element.parentElement.children

    for(let OM of otherMenus){
        OM.children[1].style.display = "none";
        OM.children[0].classList.remove("active")
        OM.setAttribute("showed","false")
    }
}

function toggleStatus(element){
    if(element.getAttribute("showed") == "true"){
        element.children[1].style.display = "none";
        element.children[0].classList.remove("active")
        element.setAttribute("showed","false")
        element.parentElement.setAttribute("anyDropmenuOpened","false")
    }else{
        element.children[1].style.display = "block";
        element.children[0].classList.add("active")
        element.children[0].focus()
        element.setAttribute("showed","true")
        element.parentElement.setAttribute("anyDropmenuOpened","true")
    }
}

const DropMenu = puffin.element(`
    <div click="$onClick" mousemove="$onHover" showed="false" class="${puffin.style.css`
        ${ThemeProvider}
        &{
            display:block;
            white-space:nowrap;
            left:0;
        }
        & button{
            min-height:100%;
            background:{{dropmenuButtonBackground}};
            color:{{dropmenuButtonText}};
            border:none;
            outline:0;
        }
        & button:hover{
            min-height:100%;
            background:{{dropmenuButtonHoveringBackground}};
            color:{{dropmenuButtonHoveringText}}
        }
        & button.active , & button:focus{
            background:{{dropmenuButtonHoveringBackground}};
        }
        & > div{
            position:absolute;
            background:{{dropmenuBackground}};
            padding:5px;
            border-radius:5px;
            border-top-left-radius:0px;
            box-shadow:0px 1px 3px rgba(0,0,0,0.15);
            z-index:1;
        }
        & > div a{
            left:0;
            white-space:pre-wrap;
            display:block;
            font-size:14px;
            padding:7px;
            min-width:100px;
            border-radius:5px;
            color:{{dropmenuOptionText}};
            cursor:pointer;
        }
        & > div a:hover{
            background:{{accentColor}};
            color:{{dropmenuOptionHoveringText}}
            
        }
    
    `} dropmenu">

    </div>
`,{
    methods:{
        onClick(){
            toggleStatus(this)
        },
        onHover(){
            if(this.getAttribute("showed") == "true"){
                this.parentElement.setAttribute("anyDropmenuOpened","true")
            }
            if(this.parentElement.getAttribute("anyDropmenuOpened")=="true"){
                hideAllMenus(this)
                toggleStatus(this)
            }
        }
    },
    events:{
        mounted(target){
            target.id = Math.random()
            target.children[1].style.display = "none"
            window.addEventListener("click",function(e){
                e.stopPropagation()
                if(((e.target.tagName == "A" || e.target.tagName == "BUTTON") && e.target.parentElement.classList.contains("dropmenu") && e.target.parentElement.id == target.id) == false && (e.target.classList.contains("dropmenu")&& e.target.id == target.id) == false){
                    target.children[1].style.display = "none";
                    target.children[0].classList.remove("active")
                    target.setAttribute("showed","false")
                    target.parentElement.setAttribute("anyDropmenuOpened","false")
                }
            })
        }
    }
})

export default DropMenu
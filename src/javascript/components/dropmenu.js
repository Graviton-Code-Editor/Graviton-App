import { puffin } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'

function hideAllMenus(element){
	const allMenus = element.parentElement.children
	for(let otherMenu of allMenus){
		otherMenu.children[1].style.display = "none";
		otherMenu.children[0].classList.remove("active")
		otherMenu.setAttribute("showed","false")
	}
}


function toggleMenuStatus(element){
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
    <div click="$onMenuClicked" mousemove="$onMenuHovering" showed="false" class="${puffin.style.css`
		&{
			display:block;
			white-space:nowrap;
			left:0;
		}
		& > button{
			min-height:100%;
			background:var(--dropmenuButtonBackground);
			color:var(--dropmenuButtonText);
			border:none;
			outline:0;
			font-size:13px;
		}
		& > button:hover{
			min-height:100%;
			background:var(--dropmenuButtonHoveringBackground);
			color:var(--dropmenuButtonHoveringText);
		}
		& > button.active , & button:focus{
			background:var(--dropmenuButtonHoveringBackground);
		}
		& > div{
			position:absolute;
			background:var(--dropmenuBackground);
			padding:5px;
			border-radius:5px;
			border-top-left-radius:0px;
			box-shadow:0px 2px 10px rgba(0,0,0,0.2);
			z-index:1;
		}
		& > div a{
			left:0;
			white-space:pre-wrap;
			display:block;
			font-size:13px;
			padding:7px 8px;
			min-width:100px;
			border-radius:5px;
			color:var(--dropmenuOptionText);
			cursor:pointer;
		}
		& > div a:hover{
			background:var(--accentColor);
			color:var(--dropmenuOptionHoveringText);
		}
		& span{
			height:1.5px;
			border-radius:25px;
			width:95%;
			display:block;
			background:var(--dropmenuDivider);
			margin:3px auto;
		}
    `} dropmenu">
    </div>
`,{
	methods:{
		onMenuClicked(){
			toggleMenuStatus(this)
		},
		onMenuHovering(){
			if(this.getAttribute("showed") == "true"){
				this.parentElement.setAttribute("anyDropmenuOpened","true")
			}
			if(this.parentElement.getAttribute("anyDropmenuOpened")=="true"){
				hideAllMenus(this)
				toggleMenuStatus(this)
			}
		}
	},
	events:{
		mounted(target){
			target.id = Math.random()
			target.children[1].style.display = "none"
			window.addEventListener("click",function(e){
				e.stopPropagation()
				if(
					((e.target.tagName == "A" || e.target.tagName == "BUTTON") 
					&& e.target.parentElement.classList.contains("dropmenu") 
					&& e.target.parentElement.id == target.id) == false 
					&& (e.target.classList.contains("dropmenu") && e.target.id == target.id) == false
					&& target.getAttribute("showed") == "true"){
					RunningConfig.emit('hideAllFloatingComps')
				}
			})
			RunningConfig.on('hideAllFloatingComps',()=>{
				target.children[1].style.display = "none";
				target.children[0].classList.remove("active")
				target.setAttribute("showed","false")
				target.parentElement.setAttribute("anyDropmenuOpened","false")
			})
		}
	}
})

export default DropMenu
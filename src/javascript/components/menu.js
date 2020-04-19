import { element, style } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'

function hideAllMenus(element){
	const allMenus = element.parentElement.children
	for(let otherMenu of allMenus){
		if( otherMenu.children[1] ) otherMenu.children[1].style.display = "none";
		otherMenu.children[0].classList.remove("active")
		otherMenu.setAttribute("showed","false")
	}
}

function toggleMenuStatus(element){
	if(element.getAttribute("showed") == "true"){
		if( element.children[1] ) element.children[1].style.display = "none";
		element.children[0].classList.remove("active")
		element.setAttribute("showed","false")
		element.parentElement.setAttribute("anyDropmenuOpened","false")
	}else{
		if( element.children[1] ) element.children[1].style.display = "block";
		element.children[0].classList.add("active")
		element.children[0].focus()
		element.setAttribute("showed","true")
		element.parentElement.setAttribute("anyDropmenuOpened","true")
	}
}
function mounted(){
	const target = this
	target.id = Math.random()
	const isSubmenu = target.props.data.isSubmenu
	const itemsContainer = target.children[1]?target.children[1]:target.children[0]
	if( !isSubmenu ) itemsContainer.style.display = "none"
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
		itemsContainer.style.display = "none";
		target.children[0].classList.remove("active")
		target.setAttribute("showed","false")
		target.parentElement && target.parentElement.setAttribute("anyDropmenuOpened","false")
		if( isSubmenu ){
			target.remove()
		}
	})
}
function onMenuClicked(){
	toggleMenuStatus(this)
}
function onMenuHovering(){
	if(!this.parentElement) return
	if(this.getAttribute("showed") == "true"){
		this.parentElement.setAttribute("anyDropmenuOpened","true")
	}
	if(this.parentElement.getAttribute("anyDropmenuOpened")=="true"){
		hideAllMenus(this)
		toggleMenuStatus(this)
	}
}
function MenuComp(){
	return element`
		<div mounted="${mounted} :click="${onMenuClicked}" :mousemove="${onMenuHovering}" showed="false" class="${style`
			&{
				display:block;
				white-space:nowrap;
				left:0;
			}
			& > button{
				min-height:100%;
				background:var(--menuButtonBackground);
				color:var(--menuButtonText);
				border:none;
				outline:0;
				font-size:13px;
			}
			& > button:hover{
				min-height:100%;
				background:var(--menuButtonHoveringBackground);
				color:var(--menuButtonHoveringText);
			}
			& > button.active , & button:focus{
				background:var(--menuButtonHoveringBackground);
			}
			& > div{
				position:absolute;
				background:var(--menuBackground);
				padding:5px;
				border-radius:5px;
				border-top-left-radius:0px;
				box-shadow:0px 2px 10px rgba(0,0,0,0.2);
				z-index:1;
			}
			& > div p{
				margin:0;
				padding:0;
				height:16px;
			}
			& > div svg{
				right:15px;
				width:8px;
				position:absolute;
				height:16px;
			}
			& > div a{
				left:0;
				display:flex;
				font-size:13px;
				padding:7px 8px;
				min-width:100px;
				border-radius:5px;
				color:var(--menuOptionText);
				cursor:pointer;
				align-items:center;
				padding-right:20px;
			}
			& > div a:hover{
				background:var(--accentColor);
				color:var(--menuOptionHoveringText);
			}
			& > div a:hover svg path{
				fill:var(--menuOptionHoveringText);
			}
			& span{
				height:2px;
				border-radius:100px;
				width:90%;
				display:block;
				background:var(--menuDivider);
				margin:5px auto;
				box-sizing:border-box;
			}
		`} dropmenu">
		</div>
	`
}

export default MenuComp
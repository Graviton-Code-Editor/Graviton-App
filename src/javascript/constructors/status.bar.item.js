import { element, style, render } from '@mkenzo_8/puffin'
import StatusBarItemBody from '../components/status.bar/status.bar.item'
import RunningConfig from '../utils/running.config'

function StatusBarItem({
	label,
	component,
	action,
	contextAction,
	position,
	hint = ''
}){
	let elementNode;
	const ItemComponent = element({
		components:{
			StatusBarItemBody
		}
	})`
		<StatusBarItemBody title="${hint}" :click="${action} :contextmenu="${contextAction}">
			${component?component():''}
		</StatusBarItemBody>
	`
	if( document.getElementById('statusBar') ){
		const side = document.getElementById('statusBar').children[
			position === 'right' ? 1 : 0 
		]
		elementNode = render(ItemComponent,side)
	}else{
		RunningConfig.on('appLoaded',()=>{
			const side = document.getElementById('statusBar').children[
				position === 'right' ? 1 : 0 
			]
			elementNode = render(ItemComponent,side)
		})
	}
	return {
		setHint(value){
			setHint(elementNode,value)
		},
		setLabel(value){
			setLabel(elementNode,value)
		},
		show(){
			elementNode.style.display = "block"
		},
		hide(){
			elementNode.style.display = "none"
		},
		isHidden(){
			elementNode.style.display == "none"
		}
	}
}

function setHint(element,value){
	element.setAttribute('title',value)
}

function setLabel(element,value){
	element.textContent = value
}

export default StatusBarItem
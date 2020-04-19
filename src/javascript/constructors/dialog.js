import DialogBody from '../components/dialog/dialog'
import WindowBackground  from '../components/window/background'
import { element, style, render } from '@mkenzo_8/puffin'
import { Text, Titles, Button } from '@mkenzo_8/puffin-drac'
import Window from './window'

function Dialog({
	title = 'Title',
	content = "",
	component,
	buttons = []
}){
	const computedMethods = {...buttons.map(btn=>{
		if ( btn.action ){
			return btn.action
		}else{
			return function(){
				dialogWindow.close()
			}
		}
	})}
	function mounted(){
		if( component ){
			render(component,this.children[0].children[1])
		}
	}
	const DialogComp = element({
		components:{
			DialogBody,
			WindowBackground,
			H2:Titles.h2,
			Text
		},
	})`
		<DialogBody mounted="${mounted}">
			<div>
				<H2>${title}</H2>
				<Text>${content}</Text>
			</div>
			<div>
				${buttons.map(function(btn,index){
					return element({
						components:{
							Button
						}
					})`<Button index="${index}" :click="${closeWindow}">${btn.label}</Button>`
				})}
			</div>
		</DialogBody>
	`
	function closeWindow(){
		computedMethods[Number(this.getAttribute("index"))]()
		dialogWindow.close()
	}
	const dialogWindow = new Window({
		component:()=>DialogComp,
		height:'200px',
		width:'300px'
	})
	return {
		launch:()=> dialogWindow.launch(),
		close:()=> dialogWindow.close()
	}
}

export default Dialog
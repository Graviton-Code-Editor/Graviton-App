import DialogBody from '../components/dialog/dialog'
import WindowBackground  from '../components/window/background'
import {puffin} from '@mkenzo_8/puffin'
import { Titles, Text, Button } from '@mkenzo_8/puffin-drac'
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
	const DialogComp = puffin.element(`
			<DialogBody>
				<div>
					<H2>${title}</H2>
					<Text>${content}</Text>
				</div>
				<div>
					${buttons.map(function(btn,index){
						return `<Button index="${index}" click="$closeWindow">${btn.label}</Button>`
					}).join("")}
				</div>
			</DialogBody>
	`,{
		components:{
			DialogBody,
			WindowBackground,
			H2:Titles.h2,
			Text,
			Button
		},
		events:{
			mounted(){
				if(component != null){
					puffin.render(component,this.children[1].children[0])
				}
			}
		},
		methods:{
			closeWindow(){
				computedMethods[Number(this.getAttribute("index"))]()
				dialogWindow.close()
			}
		}
	})
	const dialogWindow = new Window({
		component:DialogComp,
		height:'200px',
		width:'300px'
	})
	return {
		launch:()=> dialogWindow.launch(),
		close:()=> dialogWindow.close()
	}
}

export default Dialog
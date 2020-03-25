import { puffin } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import ContextMenuWrapper from '../components/context.menu'

function ContextMenu({
	list,
	parent,
	event,
	x,
	y
}){
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
		<ContextMenuWrapper id="${randomSelector}" class="contextMenu" style="top:${positions.y}px; left:${positions.x};">
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
		</ContextMenuWrapper>
	`,{
		methods:computedMethods,
		components:{
			ContextMenuWrapper
		},
		events:{
			mounted(target){
				parent.setAttribute("hasContext","true")
				RunningConfig.emit('hideAllFloatingComps')
				window.addEventListener("click",(e)=>{
					if(e.target != parent) target.remove()
				})
				window.addEventListener("contextmenu",(e)=>{
					e.stopPropagation()
				})
				RunningConfig.on('hideAllFloatingComps',()=>{
					target.remove()
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
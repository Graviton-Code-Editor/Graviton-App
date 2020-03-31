import {puffin} from '@mkenzo_8/puffin'
import WindowBody  from '../components/window/window'
import WindowBackground  from '../components/window/background'

function Window({
	title="",
	component:contentComponent,
	height = "75%",
	width = "80%"
}){
	const randomID = Math.random()
	const WindowComponent = puffin.element(`
		<div win-title="${title}" id="${randomID}" class="window ${puffin.style.css`
			&{
				min-height:100%;
				min-width:100%;
				position:fixed;
				top:50%;
				left:50%;
				transform:translate(-50%,-50%);
			}
		`}">
			<WindowBackground window="${randomID}"/>
			<WindowBody style="height:${height};width:${width};">
				<contentComponent/>
			</WindowBody>
		</div>
	`,{
		components:{
			WindowBody,
			WindowBackground,
			contentComponent
		}
	})
	return {
		launch:()=> launchWindow(WindowComponent),
		close:()=> closeWindow(WindowComponent)
	}
}

function launchWindow(WindowComponent){
	puffin.render(WindowComponent,document.getElementById("windows"))
}

function closeWindow(WindowComponent){
	WindowComponent.node.remove()
}

export default Window
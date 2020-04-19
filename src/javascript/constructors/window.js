import { element, style, render } from '@mkenzo_8/puffin'
import WindowBody  from '../components/window/window'
import WindowBackground  from '../components/window/background'

const styleWrapper = style`
	&{
		min-height:100%;
		min-width:100%;
		position:fixed;
		top:50%;
		left:50%;
		transform:translate(-50%,-50%);
	}
`

function Window({
	title="",
	component:contentComponent,
	height = "75%",
	width = "80%"
}){
	const randomSelector = Math.random()
	const WindowComponent = element({
		components:{
			WindowBody,
			WindowBackground,
			contentComponent
		}
	})`
		<div id="${randomSelector}" win-title="${title}" class="window ${styleWrapper}">
			<WindowBackground></WindowBackground>
			<WindowBody style="height:${()=>height};width:${()=>width};">
				<contentComponent/>
			</WindowBody>
		</div>
	`
	function launchWindow(){
		render(
			WindowComponent,
			document.getElementById("windows")
		)
	}
	function closeWindow(){
		if( document.getElementById(randomSelector) ) document.getElementById(randomSelector).remove()
	}
	return {
		launch:()=> launchWindow(WindowComponent),
		close:()=> closeWindow(WindowComponent)
	}
}



export default Window
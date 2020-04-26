import { state, element, style, render } from '@mkenzo_8/puffin'
import { Text, Titles } from '@mkenzo_8/puffin-drac'
import Play from '../components/icons/play'
import Stop from '../components/icons/stop'
import Reload from '../components/icons/reload'
import Close from '../components/icons/close'

const styleWrapper = style`
	& {
		position: absolute;
		background: var(--windowBackground);
		width: auto;
		height: auto;
		top:75px;
		left: 75px;
		user-select: none;
		border-radius: 5px;
		padding:5px;
		box-shadow: 0px 2px 8px rgba(0,0,0,0.2);
	}
	& h5 {
		margin: 0;
		padding: 0;
		text-align: center;
		width: 100%;
	}
	& .buttons {
		display: flex;
	}
	& .buttons > div{
		padding: 3px 15px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius:5px;
		transition: .2s;
		background:transparent;
	}
	& .buttons > div:hover {
		background: var(--sidemenuBackground);
		transition: .2s;
	}
	& .buttons > div > svg{
		height:35%;
		margin: 5px 2px;
	}
	& .buttons  > div > p{
		font-size:10px;
		margin: 0;
		padding: 0;
	}
	& > div {
		display: flex;
	}
	& .dragger {
		background: var(--sidemenuBackground);
		border-radius:5px;
		padding: 6px 3px;
		cursor: move;
		margin-bottom:4px;
	}
	& .status{
		font-size:10px;
	}
	& .status span[status="Stopped"]{
		color: red;
	}
	& .status span[status="Started"]{
		color: #1DFA19;
	}
`

function envClient({ name }){
	
	let isClicked = false
	
	function barClicked(e){
		isClicked = true
	}
	
	function barUnClicked(e){
		isClicked = false
	}
	
	function barMoved(e){
		if ( isClicked ){
			node.style.top = e.pageY - 20
			node.style.left = e.pageX - 110
		}
	}
	
	window.addEventListener('mousemove', barMoved)
	window.addEventListener('mouseup', barUnClicked)
	
	let status = 'Stopped'
	
	const fwindow = element({
		components:{
			Play,
			Text,
			Stop,
			H5: Titles.h5,
			Reload,
			Close
		}
	})`
		<div  class="${styleWrapper}">
			<div :mousedown="${barClicked}"class="dragger">
				<H5>${name}</H5>
			</div>
			<div>
				<div class="buttons">
					<div :click="${onStart}">
						<Play/>
						<Text>Start</Text>
					</div>
					<div :click="${onStop}">
						<Stop/>
						<Text>Stop</Text>
					</div>
					<div :click="${onReload}">
						<Reload/>
						<Text>Reload</Text>
					</div>
					<div :click="${onClose}">
						<Close/>
						<Text>Close</Text>
					</div>
				</div>
			</div>
			<Text class="status" >Status: <span status="${()=>status}">${()=>status}</span></Text>
		</div>
	`
	const node = render(fwindow,document.getElementById("windows"))
	
	const clientState = new state(arguments[0])
	
	function onStart(){
		status = 'Started'
		node.children[2].children[0].update()
		clientState.emit('start')
	}
	
	function onStop(){
		status = 'Stopped'
		node.children[2].children[0].update()
		clientState.emit('stop')
	}
	
	function onReload(){
		clientState.emit('reload')
	}
	
	function onClose(){
		clientState.emit('destroy')
		onStop()
	}
	
	clientState.on('destroy',()=>{
		window.removeEventListener('mousemove', barMoved)
		window.removeEventListener('mouseup', barUnClicked)
		node.remove()
	})
	
	return clientState
}

export default envClient
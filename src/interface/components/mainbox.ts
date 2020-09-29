import { element, render } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'
import StaticConfig from 'StaticConfig'
import Terminal from './terminal'

const MainBoxStyle = style`
	position: relative;
	min-height: 50px;
	max-height: calc(100% - 2px);
	bottom: 0;
	height: 100%;
	flex: 1;
`

export default function MainBox(){
	
	function mounted(){
		if(StaticConfig.data.appShowTerminal){
			this.firstChild.style.display = 'block'
		}else{
			this.firstChild.style.display = 'none'
		}
		StaticConfig.keyChanged('appShowTerminal', (show: boolean) => {
			if(show){
				this.firstChild.style.display = 'block'
			}else{
				this.firstChild.style.display = 'none'
			}
		})
	}
	
	function resized(){
		//Send the resize event to the Terminal State
		this.lastChild.state.emit('resize') 
	}
	
	return element({
		components:{
			Terminal
		}
	})`
		<div :resized="${resized}" mounted="${mounted}" class="${MainBoxStyle}">
			<Terminal/>
		</div>
	`
}
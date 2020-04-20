import { element, style } from '@mkenzo_8/puffin'

const styleWrapper = style`
	&{
		position:fixed;
		top:0;
		left:0;
		min-height:100%;
		min-width:100%;
		background:black;
		opacity:0.3;
	}
`

function WindowBackground({ closeWindow }){
	return element`
		<div :click="${closeMe}" class="${styleWrapper}"/>
	`
	function closeMe(){
		closeWindow()
	}	
}

export default WindowBackground
import { element, style } from '@mkenzo_8/puffin'

function WindowBackground(){
	return element`
		<div :click="${closeMe}" keyup="$keyPresssed" class="${()=>style`
				&{
					position:fixed;
					top:0;
					left:0;
					min-height:100%;
					min-width:100%;
					background:black;
					opacity:0.3;
				}
			`}">
		</div>
	`
	function closeMe(){
		this.parentElement.remove()
	}	
}

export default WindowBackground
import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	@keyframes popup{
		from {
			transform: scale(0.9)
		}
		to {
			transform: scale(1)
		}
	}
	&{
		animation: popup 0.05s ease-out;
		background: var(--contextmenuBackground);
		padding: 5px;
		position: fixed;
		color: white;
		border-radius: 5px;
		box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
		display: block;
	}
	& > button{
		background:var(--contextmenuButtonBackground);
		color:var(--contextmenuButtonText);
		border:0;
		padding:6px;
		outline:0;
		border-radius:5px;
		display:block;
		width:100%;
		text-align:left;
		font-size: 12px;
	}
	& >  button:hover{
		background:var(--contextmenuButtonHoveringBackground);
		color:var(--contextmenuButtonHoveringText);
	}
	& >  div.sep{
		height:1px;
		border-radius:25px;
		width:95%;
		display:block;
		background:var(--contextmenuDivider);
		margin:3px auto;
		box-sizing:border-box;
	}
`

function ContextMenuWrapper() {
	return element`<div class="${styleWrapper}"/>`
}

export default ContextMenuWrapper

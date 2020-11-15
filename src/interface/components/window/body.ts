import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		border:1px solid var(--windowBorder);
		width:200px;
		max-width: 95%;
		max-height: 95%;
		background: var(--windowBackground);
		border-radius: 12px;
		overflow:auto;
		position:absolute;
		height:auto;
		display:flex;
		animation:windowOpens ease-out 0.12s;
		color: var(--textColor);
		box-shadow: 0px 3px 20px 3px rgba(0,0,0,0.05);
	}
`

const WindowBody = () => element`<div class="${styleWrapper}"/>`

export default WindowBody

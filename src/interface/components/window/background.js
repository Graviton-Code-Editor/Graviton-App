import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		position:fixed;
		top:0;
		left:0;
		min-height:100%;
		min-width:100%;
		background:black;
		opacity:0.2;
	}
`

const WindowBackground = ({ closeWindow }) => element`<div :click="${closeWindow}" class="${styleWrapper}"/>`

export default WindowBackground

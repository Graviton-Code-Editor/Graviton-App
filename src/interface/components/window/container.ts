import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		min-height:100%;
		min-width:100%;
		top:0;
		left:0;
		position: fixed;
		display:flex;
		align-items:center;
		justify-content:center;
	}
`

const WindowContainer = ({ closeWindowExternally: closeWindow }) => element`<div methods="${{ closeWindow }}" class="${styleWrapper}"/>`

export default WindowContainer

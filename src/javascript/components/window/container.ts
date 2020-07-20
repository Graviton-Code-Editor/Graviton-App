import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

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

const WindowContainer = ({ closeWindowExternally: closeWindow }) => element`<div methods="${{ closeWindow }}" class="${styleWrapper}"/>`

export default WindowContainer

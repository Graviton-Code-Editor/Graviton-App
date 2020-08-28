import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	&{
		display:flex;
		min-height:100%;
		min-width:100%;
		align-items:center;
		justify-content:center;
	}
`

function CenteredLayout() {
	return element`<div class="${styleWrapper}"></div>`
}

export default CenteredLayout

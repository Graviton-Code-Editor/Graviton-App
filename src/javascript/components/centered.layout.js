import { element, style } from '@mkenzo_8/puffin'

const styleWrapper = style`
	&{
		display:flex;
		min-height:100%;
		min-width:100%;
		align-items:center;
		justify-content:center;
	}
`

function CenteredLayout (){
	return element`<div class="${styleWrapper}"></div>`
}

export default CenteredLayout
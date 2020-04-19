import { element, style } from '@mkenzo_8/puffin'

const styleWrapper = style`
	&{
		flex:1;
		max-height:100%;
		overflow:auto;
	}
`

function PanelBody(){
	return element`
		<div class="${styleWrapper}"/>
	`
}

export default PanelBody
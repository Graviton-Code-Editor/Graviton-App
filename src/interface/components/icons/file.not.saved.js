import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		background:var(--fileNotSavedIndicator);
		height:9px;
		min-width:9px;
		border-radius:10px;
		margin-top:1px;
		margin-right:4px;
		margin-left:14px;
	}
	&:hover{
		background:var(--fileNotSavedHoveringIndicator);
	}
`

function UnSavedIcon() {
	return element`
		<div class="tab-save ${styleWrapper}"/>
	`
}

export default UnSavedIcon

import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	&{
		background:var(--fileNotSavedIndicator);
		height:10px;
		width:10px;
		border-radius:100px;
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

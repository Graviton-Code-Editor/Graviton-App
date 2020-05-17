import { element, style } from '@mkenzo_8/puffin'

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
		background:var(--fileNotSavedIndicatorHovering);
	}
`

function UnSavedIcon() {
	return element`
		<div class="${styleWrapper}"/>
	`
}

export default UnSavedIcon

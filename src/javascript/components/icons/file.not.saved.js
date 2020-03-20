import { puffin } from '@mkenzo_8/puffin'

const UnSavedIcon = puffin.element(`
	<div class="${puffin.style.css`
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
	`}"/>
`)

export default UnSavedIcon
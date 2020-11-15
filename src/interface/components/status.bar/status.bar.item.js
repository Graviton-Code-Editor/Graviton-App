import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		min-height:100%;
		display:block;
		margin:0;
		padding:0 6px;
		background:var(--statusbarItemBackground);
		color:var(--statusbarItemText);
		border:0px;
		white-space:nowrap;
		font-size: 12px;
	}
	&:hover{
		background:var(--statusbarItemHoveringBackground);
		color:var(--statusbarItemHoveringText);
	}
	&[important="true"]{
		background: var(--statusbarItemImportantBackground);
		color: var(--statusbarItemImportantText);
	}
`

function StatusBarItemBody() {
	return element`
		<button class="${styleWrapper}"/>
	`
}

export default StatusBarItemBody

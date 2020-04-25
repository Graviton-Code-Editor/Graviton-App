import { element, style } from '@mkenzo_8/puffin'

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
		font-size: 13px;
	}
	&:hover{
		background:var(--statusbarItemHoveringBackground);
		color:var(--statusbarItemHoveringText);
	}
`

function StatusBarItemBody(){
	return element`
		<button class="${styleWrapper}"/>
	`
}

export default StatusBarItemBody
import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const StatusStyle = style`
	&{
		border-top:1px solid var(--statusbarBorder);
		min-height:25px;
		max-height:25px;
		background:var(--statusbarBackground);
		box-sizing:border-box;
		display:flex;
		box-sizing:border-box;
		user-select:none;
	}
	& > div{
		width:auto;
		flex:1;
		display:flex;
		overflow: hidden;
	}
	& > div:nth-child(2){
		display:flex;
		justify-content:flex-end;
	}
`

function PanelStatusBar() {
	return element`
	<div id="statusBar" class="${StatusStyle}">
		<div/>
		<div/>
	</div>
	`
}

export default PanelStatusBar

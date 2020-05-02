import { element, style } from '@mkenzo_8/puffin'

function PanelStatusBar(){
	return element`
	<div id="statusBar" class="${
		style`
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
				width:50%;
				max-width:50%;
				flex:1;
				display:flex;
			}
			& > div:nth-child(2){
				display:flex;
				justify-content:flex-end;
			}
		`}">
		<div/>
		<div/>
	</div>
	`
}

export default PanelStatusBar
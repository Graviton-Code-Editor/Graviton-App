import { puffin } from '@mkenzo_8/puffin'

const StatusBarItemBody = puffin.element(`
	<button class="${
		puffin.style.css`
			&{
				min-height:100%;
				display:block;
				margin:0;
				padding:0 6px;
				background:var(--statusbarItemBackground);
				color:var(--statusbarItemText);
				border:0px;
				white-space:nowrap;
			}
			&:hover{
				background:var(--statusbarItemHoveringBackground);
				color:var(--statusbarItemHoveringText);
			}
		`}"
	/>
`)


export default StatusBarItemBody
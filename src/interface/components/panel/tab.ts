import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		height:37px;
		background:var(--tabBackground);
		color:var(--tabText);
		min-width: 125px;
		width: 125px;
		max-width: 125px;
		display:flex;
		justify-content:flex-start;
		align-items:center;
		cursor:pointer;
		padding:0px 10px;
		user-select:none;
		position: relative;
		-webkit-tap-highlight-color: rgba(255, 255, 255, 0); 
    -webkit-focus-ring-color: rgba(255, 255, 255, 0);
		border-right: 1px solid var(--tabBordersBackground);
		&[active="true"]{
			background:var(--tabActiveBackground);
			color:var(--tabActiveText);
		}
		&:hover:not([active="true"]){
			background:var(--tabHoveringBackground, var(--tabHoveringWhileDraggingBackground));
		}
	}
	& > p {
		pointer-events: none;
	}
	& img{
		height: 20px;
		margin-right: 10px;
		margin-bottom: 2px;
	}
	& p{
		margin:0;
		font-size:13px;
		height:17px;
		position:relative;
		max-width:100px;
		overflow:hidden;
		text-overflow:ellipsis;
		flex: 3;
	}
	& .tab-button{
		padding-left:auto;
		min-height:12px;
		min-width:12px;
		right:0;
		flex:1;
		display:flex;
		justify-content:flex-end;
		margin-right:7px;
	}
	& .tab-button > svg{
		max-height:18px;
		max-width:18px;
		padding:0;
		margin:0;
		flex:1;   
		margin-left:10px; 
	}
	& .tab-icon {
		 pointer-events: none;
	}
	&[active=false].dragging{
		background:var(--tabHoveringWhileDraggingBackground);
		& .tab-button {
			pointer-events: none;
		}
	}
	&.closing {
		animation: tabCloses ease-out 0.14s;
		opacity: 0;
		width: 0;
	}
	&.opening {
		animation: tabOpens ease-in 0.14s;
	}
`

function TabBody() {
	return element`
		<div class="${styleWrapper}"/>
	`
}
export default TabBody

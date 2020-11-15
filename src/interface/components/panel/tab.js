import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		height:40px;
		background:var(--tabBackground);
		color:var(--tabText);
		min-width: 140px;
		width: 140px;
		max-width: 140px;
		display:flex;
		justify-content:flex-start;
		align-items:center;
		cursor:pointer;
		padding:0px 10px;
		user-select:none;
		position: relative;
		&[active="true"]{
			background:var(--tabActiveBackground);
			box-shadow:0px 0px 10px rgba(0,0,0,0.2);
			color:var(--tabActiveText);
		}
		&:hover:not([active="true"]){
			background:var(--tabHoveringBackground, var(--tabHoveringWhileDraggingBackground));
		}
	}
	& img{
		height: 20px;
		margin-right: 10px;
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
	&.dragging{
		background:var(--tabHoveringWhileDraggingBackground);
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

import { element, style } from '@mkenzo_8/puffin'

const styleWrapper = style`
	&{
		height:40px;
		background:var(--tabBackground);
		color:var(--tabText);
		min-width:150px;
		max-width:150px;
		display:flex;
		justify-content:flex-start;
		align-items:center;
		cursor:pointer;
		padding:0px 10px;
		user-select:none;
	}
	&:active{
		transform:scale(0.98);
	}
	& p{
		margin:0;
		font-size:13px;
		height:17px;
		position:relative;
		max-width:100px;
		overflow:hidden;
		text-overflow:ellipsis;
	}
	& > div{
		padding-left:auto;
		min-height:12px;
		min-width:12px;
		right:0;
		flex:1;
		display:flex;
		justify-content:flex-end;
		margin-right:7px;
	}
	& > div > svg{
		max-height:18px;
		max-width:18px;
		padding:0;
		margin:0;
		flex:1;   
		margin-left:10px; 
	}
	&[active="true"]{
		background:var(--tabActiveBackground);
		box-shadow:0px 0px 10px rgba(0,0,0,0.2);
		color:var(--tabActiveText);
	}
	&.dragging{
		background:var(--tabHoveringWhileDraggingBackground);
	}
`

function TabBody(){
	return element`
		<div class="${styleWrapper}"/>
	`	
}
export default TabBody
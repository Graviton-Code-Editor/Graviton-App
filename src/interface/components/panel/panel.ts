import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		flex:1;
		min-width:1px;
		overflow:hidden;
		max-height:100%;
		min-height:100%;
		display:flex;
		flex-direction:column;
		border-left:1px solid var(--panelBorder);
	}
	& .tabsbar{
		min-height:37px;
		max-height:37px;
		white-space:nowrap;
		display:flex;
		flex:1;
		overflow-x: auto;
		overflow-y: hidden;
		background:var(--tabsbarBackground);
		opacity: 1;
	}
	& .tabsbar:empty{
		transition:0.1s;
		opacity: 0;
		min-height: 0px;
		max-height: 0px;
	}
	& .tabsbar::-webkit-scrollbar {
		height:4px !important;
	}
	& > div:nth-child(2){
		flex:1;
		height: 100%;
		max-height:100%;
		overflow:auto;
	}
`

function PanelBody() {
	return element`
		<div class="${styleWrapper}"/>
	`
}

export default PanelBody

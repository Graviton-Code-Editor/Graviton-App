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
		min-height:40px;
		max-height:40px;
		white-space:nowrap;
		display:flex;
		flex:1;
		overflow-x: auto;
		overflow-y: hidden;
		background:var(--tabsbarBackground);
		transition:0.1s;
	}
	& .tabsbar:empty{
		transition:0.1s;
		background:transparent;
	}
	& .tabsbar::-webkit-scrollbar {
		height:4px;
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

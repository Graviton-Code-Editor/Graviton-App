import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
		#body{
			display:flex;
			flex-direction:columns;
			background:var(--bodyBackground);
			height:calc(100% - 68px);
		}
		* {
			font-family: mainfont, Apple Color Emoji,Segoe UI,Segoe UI Emoji,Segoe UI Symbol !important;
		}
		.CodeMirror *:not(.CodeMirror-dialog) {
			font-family:var(--codeFont) !important;
		}
		&[os="darwin"] #body, &[os="linux"] #body{
			height: calc(100% - 25px);
		}
		#sidebar{
			padding:5px;
			min-width:50px;
			max-width:50px;
			overflow:auto;
			float: left;
			left: 0;
			border-right:1px solid var(--panelBorder);
			border-top-right-radius:  8px;
			border-top:1px solid var(--panelBorder);
			background:var(--sidebarBackground);
		}
		#sidepanel{
			border-top-right-radius:  8px;
			background:var(--bodyBackground);
			min-width:50px;
			width:35%;
			max-height:100%;
			overflow:auto;
			float: left;
			left: 0;
			padding: 10px;
			& > div{
				height: 100%;
			}
		}
		#mainpanel{
			min-width:50px;
			display:flex;
			flex-direction:columns;
			min-width:50px;
			width:300px;
			flex:1;
			border-top:1px solid var(--panelBorder);
			border-top-left-radius: 8px;
			background:var(--mainpanelBackground);
			&[blocked="true"]{
				border-top-left-radius: 0px;
			}
		}
		#mainpanel {
			border-left:1px solid var(--panelBorder);
			&  .tabsbar > div:nth-last-child(1){
				border-top-right-radius:5px;
			}
			& > div:nth-child(1){
				border-top-left-radius:8px;
				border-left:transparent;
			}
		}
		#windows{
			position:absolute;
			top:0;
			height:0;
			width:0;
			display:flex;
		}
		#notifications{
			position:absolute;
			bottom:10px;
			right:10px;
			display:flex;
			flex-direction:column;
			overflow:hidden;
		}
    `

function AppBody() {
	return element`<div class="${styleWrapper}"/>`
}

export default AppBody

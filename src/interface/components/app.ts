import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import StaticConfig from 'StaticConfig'

const styleWrapper = style`
		& > div{
			height: 100%;
		}
		#body{
			display:flex;
			flex-direction:columns;
			background:var(--bodyBackground);
			height:calc(100% - 68px);
		}
		&[browser="false"][os="darwin"], &[browser="false"][os="linux"]{
			#body{
				height: calc(100% - 25px);
			}
		}
		&[os="win32"], &[browser="true"]{
			& #sidebar{
				border-top-right-radius:  8px;
				border-top:1px solid var(--panelBorder);
			}
			& #mainpanel{
				border-top-left-radius: 8px;
				border-top:1px solid var(--panelBorder);
				border-left:1px solid var(--panelBorder);
				& #panels_stack > div:nth-child(1){
					border-top-left-radius:8px;
					border-left:transparent;
				}
			}
		}
		&[browser="true"]{
			#body{
				min-height: calc(100% - 70px);
			}
			@media only screen and (max-width: 500px) {
				#statusbar{
					padding: 0 10px 5px 10px;
					min-height: 30px;
					max-height: 30px;
				}
			}
		}
		.CodeMirror *:not(.CodeMirror-dialog) {
			font-family:var(--codeFont) !important;
		}
		* , .CodeMirror .CodeMirror-dialog * {
			font-family: mainfont, Apple Color Emoji,Segoe UI,Segoe UI Emoji,Segoe UI Symbol !important;
		}
		#sidebar{
			padding:5px;
			min-width:50px;
			max-width:50px;
			overflow:auto;
			float: left;
			left: 0;
			border-right:1px solid var(--panelBorder);
			background:var(--sidebarBackground);
			&::-webkit-scrollbar {
				width: 4px !important;
			}
		}
		#sidepanel{
			background:var(--bodyBackground);
			min-width:50px;
			width: ${StaticConfig.data.appCache.sidePanelWidth};
			max-height:100%;
			overflow:auto;
			float: left;
			left: 0;
			padding: 5px 2px;
			& > div{
				height: calc(100% - 8px);
				padding: 4px 0px;
			}
		}
		#mainpanel{
			min-width:50px;
			flex-direction:column;
			min-width:50px;
			width:300px;
			display: flex;
			flex:1;
			background:var(--mainpanelBackground);
			border-left:1px solid var(--panelBorder);
			&[blocked="true"]{
				border-top-left-radius: 0px;
			}
			& > div {
				width: 100%;
			}
			& #panels_stack{
				display:flex;
				min-height: 5%;
				height:  100%;
				max-height: 100%;
				flex-direction:columns;
				& > div:nth-child(1) {
					border: none;
				}
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
			height: auto;
		}
  `

function AppBody() {
	return element`<div class="${styleWrapper}"/>`
}

export default AppBody

import { element, style } from '@mkenzo_8/puffin'

const styleWrapper = style`
		body{
			padding:0px;
			margin:0px;
			max-width:100%;
			max-height:100%;
			overflow:hidden;
			--puffinFont:mainFont;
			background: var(--bodyBackground);
			--codeFont: JetBrainsMono;
		}
		@font-face {
			font-family: mainFont;
			src: url(Inter-Regular.woff2) format("woff2") ;
		}
		@font-face {
			font-family: JetBrainsMono;
			src: url(JetBrainsMono-Regular.woff2) format("woff2") ;
		}
		* {
			font-family: mainFont;
		}
		.CodeMirror *:not(.CodeMirror-dialog) {
			font-family:var(--codeFont);
		}
		#body{
			display:flex;
			flex-direction:columns;
			background:var(--bodyBackground);
			height:calc(100% - 68px);
		}
		.app-container[os="darwin"] #body, .app-container[os="linux"] #body{
			height: calc(100% - 28px);
		}
		#sidebar{
			background: gray;
			padding:4px;
			min-width:50px;
			max-width:50px;
			overflow:auto;
			float: left;
			left: 0;
			border-top-right-radius: 5px;
			border-right:1px solid var(--panelBorder);
			border-top:1px solid var(--panelBorder);
			background:var(--sidebarBackground);
		}
		#sidepanel{
			background:var(--bodyBackground);
			min-width:50px;
			width:35%;
			max-height:100%;
			overflow:auto;
			float: left;
			left: 0;
			padding: 10px;
		}
		#sidepanel > div{
			height: 100%;
		}
		#mainpanel{
			min-width:50px;
			display:flex;
			flex-direction:columns;
			min-width:50px;
			width:300px;
			flex:1;
			border-top:1px solid var(--panelBorder);
			background:var(--mainpanelBackground);
		}
		#mainpanel[blocked=false]{
			border-left:1px solid var(--panelBorder);
			border-top-left-radius:5px;
		}
		#mainpanel > div:nth-child(1){
			border-top-left-radius:5px;
			border-left:transparent;
		}
		#mainpanel .tabsbar > div:nth-last-child(1){
			border-top-right-radius:5px;
		}
		#windows{
			position:absolute;
			top:0;
			height:0;
			width:0;
			display:flex;
		}
		#windows > div.window {
			display:flex;
			align-items:center;
			justify-content:center;
		}
		#windows > div.window > div {
			flex:1;
		}
		#notifications{
			position:absolute;
			bottom:10px;
			right:10px;
			display:flex;
			flex-direction:column;
			overflow:hidden;
		}
		* {
			outline: 0;
			text-rendering: optimizeLegibility !important;
			-webkit-font-smoothing: subpixel-antialiased !important;
			-webkit-box-sizing: default !important;
			box-sizing: default !important;
		}
		html *::-webkit-scrollbar {
			transition: 0.1s;
			width: 10px;
			height: 10px;
			background: transparent;
		}
		html * ::-webkit-scrollbar-track {
			background: transparent;
		}
		html * ::-webkit-scrollbar-thumb {
			border-radius: 0.2rem;
			transition: 0.1s;
			background: var(--scrollbarBackground);
		}
		html * ::-webkit-scrollbar-thumb:hover {
			transition: 0.1s;
			background: var(--scrollbarHoveringBackground);
		}
		html * ::-webkit-scrollbar-corner {
			visibility: hidden !important;
			opacity: 0 !important;
			height: 0 !important;
			width: 0 !important;
			display: none !important;
		}
		html * ::-webkit-resizer {
			cursor: ew-resize;
		}
    `

function AppBody() {
	return element`<div class="${styleWrapper}"/>`
}

export default AppBody

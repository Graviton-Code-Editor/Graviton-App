//Renderer process
import { element, style, render } from '@mkenzo_8/puffin'
import TitleBar from './components/titlebar/titlebar'
import SplashScreen from './components/splash.screen'
import init from './defaults/initial'
import Welcome from './defaults/windows/welcome'
import ThemeProvider from 'ThemeProvider'
import Resizer from './components/panel/resizer.horizontally'
import StatusBar from './components/status.bar/status.bar'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import ContextMenu from './constructors/contextmenu'
window.require('v8-compile-cache')

import '../sass/main.scss'

let blurViewApp = false

const App = element({
	components:{
		TitleBar,
		SplashScreen,
		StatusBar,
		Resizer
	},
})`
    <div mounted="${mountedApp}" class="${style`
		body{
			padding:0px;
			margin:0px;
			max-width:100%;
			max-height:100%;
			overflow:hidden;
			--puffinFont:mainFont;
			background: var(--bodyBackground);
		}
		@font-face {
			font-family: mainFont;
			src: url(Inter-Regular.woff2) format("woff2") ;
		}
		@font-face {
			font-family: codeFont;
			src: url(JetBrainsMono-Regular.woff2) format("woff2") ;
		}
		* {
			font-family: mainFont;
		}
		.CodeMirror *:not(.CodeMirror-dialog) {
			font-family:codeFont;
		}
		#body{
			display:flex;
			flex-direction:columns;
			height:calc(100% - 68px);
			background:var(--bodyBackground);
		}
		#sidebar{
			background: gray;
			padding:4px;
			width:50px;
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
		#mainpanel{
			min-width:50px;
			display:flex;
			flex-direction:columns;
			min-width:50px;
			width:300px;
			flex:1;
			border-left:1px solid var(--panelBorder);
			border-top:1px solid var(--panelBorder);
			border-top-left-radius:5px;
			background:var(--mainpanelBackground);
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
			background: var(--scrollbarHoverBackground);
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
    `}">
		<div mounted="${mountedAppView}" style="${()=> blurViewApp ? `filter:blur(${StaticConfig.data.appBlurEffect}px);` : ''}">
			<TitleBar/>
			<div id="body">
				<div id="sidebar" :contextmenu="${sidebarContext}" style="${()=>StaticConfig.data.appEnableSidebar ? 'opacity:1' : 'opacity:0;width:10px;'}"/>
				<div id="sidepanel"/>
				<Resizer/>
				<div id="mainpanel"/>          
			</div>
			<StatusBar/>
		</div>
		<div id="windows"/>
		<div id="notifications"/>
		<SplashScreen/>
	</div>
`
function mountedAppView(){
	RunningConfig.keyChanged('openedWindows', value =>{
		if( value <= 0 ){
			blurViewApp = false
		} else {
			blurViewApp = true
		}
		this.update()
	})
	StaticConfig.keyChanged('appBlurEffect', value =>{
		if( blurViewApp ){
			this.update()
		}
	})
	StaticConfig.keyChanged('appEnableSidebar', value =>{
		document.getElementById('sidebar').update()
	})
}

function sidebarContext(e){
	if( StaticConfig.data.appEnableSidebar ){
		new ContextMenu({
			list:[
				{
					label: 'Hide',
					action(){
						StaticConfig.data.appEnableSidebar = false
					}
				}
			],
			parent:document.body,
			event:e
		})
	}else{
		new ContextMenu({
			list:[
				{
					label: 'Show',
					action(){
						StaticConfig.data.appEnableSidebar = true
					}
				}
			],
			parent:document.body,
			event:e
		})
	}
}

function mountedApp(){
	init()
	window.addEventListener("load",function(){
		if(RunningConfig.data.arguments[0] == null){
			Welcome().launch()
		}
	})
}

render(App,document.getElementById("App"))

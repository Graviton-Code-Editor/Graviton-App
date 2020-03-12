//Renderer process
import { puffin } from '@mkenzo_8/puffin'
import TitleBar from './components/titlebar/titlebar'
import SplashScreen from './components/splash.screen'
import init from './defaults/initial'
import Welcome from './defaults/windows/welcome'
import ThemeProvider from 'ThemeProvider'
import Resizer from './components/panel/resizer.horizontally'
import StatusBar from './components/status.bar/status.bar'
import requirePath from './utils/require'
requirePath('v8-compile-cache')

import '../sass/main.scss'

const ThemeWrapper = puffin.style.css`
${ThemeProvider}
	html{
			--puffinAccent:{{accentColor}};
			--puffinTextColor:{{textColor}};
			--puffinFont:mainFont;
			--puffinButtonBackground:{{buttonBackground}};
			--puffinCardBackground:{{cardBackground}};
			--puffinRadioBackgroundHovering:{{radioBackgroundHovering}};
			--puffinRadioCircleBackground:{{radioCircleBackground}};
			--puffinRadioCircleBorder:{{radioCircleBorder}};
			--puffinRadioCircleBorderHovering:{{radioCircleBorderHovering}};
			--accentColor: {{accentColor}};
			--textColor:{{textColor}};
			--bodyBackground:{{bodyBackground}};
			--titlebarBackground:{{titlebarBackground}};
			--dropmenuBackground:{{dropmenuBackground}};
			--dropmenuButtonBackground:{{dropmenuButtonBackground}};
			--dropmenuButtonHoveringBackground:{{dropmenuButtonHoveringBackground}};
			--dropmenuButtonText:{{dropmenuButtonText}};
			--dropmenuButtonHoveringText:{{dropmenuButtonHoveringText}};
			--dropmenuOptionText:{{dropmenuOptionText}};
			--dropmenuOptionHoveringText:{{dropmenuOptionHoveringText}};
			--dropmenuDivider:{{dropmenuDivider}};
			--controlButtonsFill:{{controlButtonsFill}};
			--controlButtonsHoverBackground:{{controlButtonsHoverBackground}};
			--controlCloseButtonHoverBackground:{{controlCloseButtonHoverBackground}};
			--controlCloseButtonHoverFill:{{controlCloseButtonHoverFill}};
			--windowBackground:{{windowBackground}};
			--contextmenuBackground:{{contextmenuBackground}};
			--contextmenuButtonBackground:{{contextmenuButtonBackground}};
			--contextmenuButtonText:{{contextmenuButtonText}};
			--contextmenuButtonHoveringBackground:{{contextmenuButtonHoveringBackground}};
			--contextmenuButtonHoveringText:{{contextmenuButtonHoveringText}};
			--mainpanelBackground:{{mainpanelBackground}};
			--tabsbarBackground:{{tabsbarBackground}};
			--tabText:{{tabText}};
			--tabBackground:{{tabBackground}};
			--tabActiveText:{{tabActiveText}};
			--tabActiveBackground:{{tabActiveBackground}};
			--scrollbarBackground:{{scrollbarBackground}};
			--scrollbarHoverBackground:{{scrollbarHoverBackground}};
			--tabIconFill:{{tabIconFill}};
			--tabIconHoverFill:{{tabIconHoverFill}};
			--sidemenuBackground:{{sidemenuBackground}};
			--sidemenuButtonBackground:{{sidemenuButtonBackground}};
			--sidemenuButtonHoverBackground:{{sidemenuButtonHoverBackground}};
			--sidemenuButtonActiveBackground:{{sidemenuButtonActiveBackground}};
			--sidemenuButtonText:{{sidemenuButtonText}};
			--sidemenuButtonActiveText:{{sidemenuButtonActiveText}};
			--sidemenuSearcherBackground:{{sidemenuSearcherBackground}};
			--sidemenuSearcherText:{{sidemenuSearcherText}};
			--explorerItemText:{{explorerItemText}};
			--explorerItemHoveringBackground:{{explorerItemHoveringBackground}};
			--explorerItemSelectedBackground:{{explorerItemSelectedBackground}};
			--explorerItemArrowBackground:{{explorerItemArrowBackground}};
			--explorerItemGitModifiedText:{{explorerItemGitModifiedText}};
			--explorerItemGitModifiedIndicator:{{explorerItemGitModifiedIndicator}};
			--explorerItemGitNotAddedText:{{explorerItemGitNotAddedText}};
			--explorerItemGitNotAddedIndicator:{{explorerItemGitNotAddedIndicator}};
			--windowBorder:{{windowBorder}};
			--fileNotSavedIndicator:{{fileNotSavedIndicator}};
			--fileNotSavedIndicatorHovering:{{fileNotSavedIndicatorHovering}};
			--controlCloseButtonActiveBackground:{{controlCloseButtonActiveBackground}};
			--controlCloseButtonActiveFill:{{controlCloseButtonActiveFill}};
			--editorDialogBackground:{{editorDialogBackground}};
			--editorDialogText:{{editorDialogText}};
			--contextmenuDivider:{{contextmenuDivider}};
			--statusbarBackground:{{statusbarBackground}};
			--statusbarItemBackground:{{statusbarItemBackground}};
			--statusbarItemHoveringBackground:{{statusbarItemHoveringBackground}};
			--statusbarItemText:{{statusbarItemText}};
			--statusbarItemHoveringText:{{statusbarItemHoveringText}};
			--statusbarItemIconBackground:{{statusbarItemIconBackground}};
			--inputBackground:{{inputBackground}};
			--inputText:{{inputText}};
			--splashScreenText:{{splashScreenText}};
			--splashScreenBackground:{{splashScreenBackground}};
			--commandPromptInputBackground:{{commandPromptInputBackground}};
			--commandPromptInputText:{{commandPromptInputText}};
			--commandPromptInputBorder:{{commandPromptInputBorder}};
			--commandPromptBackground:{{commandPromptBackground}};
			--commandPromptOptionBackground:{{commandPromptOptionBackground}};
			--commandPromptOptionActiveBackground:{{commandPromptOptionActiveBackground}};
			--commandPromptOptionText:{{commandPromptOptionText}};
			--commandPromptOptionActiveText:{{commandPromptOptionActiveText}};
			--notificationBackground:{{notificationBackground}};
			--notificationTitleText:{{notificationTitleText}};
			--notificationContentText:{{notificationContentText}};
			--componentsBorder:{{componentsBorder}};
			--notificationButtonBackground:{{notificationButtonBackground}};
			--switchBackground:{{switchBackground}};
			--switchIndicatorActivatedBackground:{{switchIndicatorActivatedBackground}};
			--switchIndicatorDesactivatedBackground:{{switchIndicatorDesactivatedBackground}};
		}
`

const App = puffin.element(`
    <div class="${ThemeWrapper} ${puffin.style.css`
		body{
			padding:0px;
			margin:0px;
			max-width:100%;
			max-height:100%;
			overflow:hidden;
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
			height:calc(100% - 65px);
			background:var(--bodyBackground);
		}
		#sidepanel{
			background:var(--bodyBackground);
			padding:10px;
			min-width:50px;
			width:35%;
			max-height:100%;
			overflow:auto;
			float: left;
			left: 0;
		}
		#mainpanel{
			min-width:50px;
			display:flex;
			flex-direction:columns;
			min-width:50px;
			width:300px;
			flex:1;
			border-left:1px solid var(--componentsBorder);
			border-top:1px solid var(--componentsBorder);
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
		<TitleBar/>
		<div id="body">
			<div id="sidepanel"/>
			<Resizer/>
			<div id="mainpanel"/>          
		</div>
			<StatusBar/>
			<div id="windows"/>
			<div id="notifications"/>
			<SplashScreen/>
	</div>
`,{
	components:{
		TitleBar,
		SplashScreen,
		Resizer,
		StatusBar
	},
	events:{
		mounted(){
			init()
			window.addEventListener("load",function(){
				Welcome().launch()
			})
		}
	}
})

puffin.render(App,document.getElementById("App"),{
	removeContent:true
})

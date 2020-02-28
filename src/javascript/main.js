//Renderer process
import { puffin } from '@mkenzo_8/puffin'
import TitleBar from './components/titlebar/titlebar'
import SplashScreen from './components/splash.screen'
import init from './defaults/initial'
import Welcome from './defaults/windows/welcome'
import ThemeProvider from 'ThemeProvider'
import Resizer from './components/panel/resizer.horizontally'
import StatusBar from './components/status.bar/status.bar'

import '../sass/main.scss'

const App = puffin.element(`
    <div class="${puffin.style.css`
        ${ThemeProvider}
        body{
            padding:0px;
            margin:0px;
            max-width:100%;
            max-height:100%;
            overflow:hidden;
            --puffinAccent:{{accentColor}};
            --puffinTextColor:{{textColor}};
            --puffinFont:mainFont;
            --sidemenuButtonActiveText:{{sidemenuButtonActiveText}};
            --puffinButtonBackground:{{buttonBackground}};
            --puffinCardBackground:{{cardBackground}};
            --puffinRadioBackgroundHovering:{{radioBackgroundHovering}};
            --puffinRadioCircleBackground:{{radioCircleBackground}};
            --puffinRadioCircleBorder:{{radioCircleBorder}};
            --puffinRadioCircleBorderHovering:{{radioCircleBorderHovering}};
            --editorDialogBackground:{{editorDialogBackground}};
            --editorDialogText:{{editorDialogText}};
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
            background:{{bodyBackground}};
        }
        #sidepanel{
            background:{{bodyBackground}};
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
            border-left:1px solid rgba(150,150,150);
            border-top:1px solid rgba(150,150,150);
            border-top-left-radius:5px;
            background:{{mainpanelBackground}};
        }
        #mainpanel > div:nth-child(1){
            border-top-left-radius:5px;
            border-left:transparent;
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
        & *::-webkit-scrollbar {
            transition: 0.1s;
            width: 10px;
            height: 10px;
            background: transparent;
        }
        & * ::-webkit-scrollbar-track {
            background: transparent;
        }
        & * ::-webkit-scrollbar-thumb {
            border-radius: 0.2rem;
            transition: 0.1s;
            background: {{scrollbarBackground}};
            
        }
        & * ::-webkit-scrollbar-thumb:hover {
            transition: 0.1s;
            background: {{scrollbarHoverBackground}};
        }
        & * ::-webkit-scrollbar-corner {
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            display: none !important;
        }
        & * ::-webkit-resizer {
            cursor: ew-resize;
        }
    `}">
        <TitleBar/>
        <div id="body">
            <div id="sidepanel">
                
            </div>
            <Resizer/>
            <div id="mainpanel">
            
            </div>
          
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

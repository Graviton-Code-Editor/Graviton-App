/*
########################################
              MIT License

Copyright (c) 2019 Graviton Editor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
let nav_bar_settings ;
function hideSettings(){
	document.getElementById("window").remove();
	saveConfig();
}
function openSettings(){
	 nav_bar_settings =` 
	 <h2 class="window_title translate_word"  idT="Settings">${current_config.language["Settings"]}</h2> 
			<div id="nav_bar">
	        <ol>
	          <li id="navB1" onclick="goSPage('1')"><a class="translate_word" idT="Customization">${current_config.language["Customization"]}</a></li>
	          <li id="navB2" onclick="goSPage('2')"><a class="translate_word" idT="Languages">${current_config.language["Languages"]}</a></li>
	          <li id="navB3" onclick="goSPage('3')"><a class="translate_word" idT="Editor">${current_config.language["Editor"]}</a></li>
	        	<li id="navB4" onclick="goSPage('4')"><a class="translate_word" idT="Advanced">${current_config.language["Advanced"]}</a></li>
	        	<li id="navB5" onclick="goSPage('5')"><a class="translate_word" idT="About">${current_config.language["About"]}</a></li>
	        </ol>
	    </div>`;
	const all = document.createElement("div");
	all.setAttribute("id","window");
	all.setAttribute("style","-webkit-user-select: none;");
	const background = document.createElement("div");
	background.setAttribute("class","opened_window");
	background.setAttribute("onclick","hideSettings()"); 
	const body = document.createElement("div");
	body.setAttribute("class","body_window");
	body.setAttribute("id","body_window");
	const content = document.createElement("div");
	content.setAttribute("id","body_content");
	body.innerHTML =  nav_bar_settings;
	body.appendChild(content);
	all.appendChild(background);
	all.appendChild(body);
	document.body.appendChild(all);
}
function updateEditorFontSize() {
	current_config.fontSizeEditor =  document.getElementById("fs-input").value;
	if(editor!=undefined){
		document.documentElement.style.setProperty("--editor-font-size",`${document.getElementById("fs-input").value}px`);//Update settings from window
		editor.refresh();
	}
}
function updateSettings(){
	document.documentElement.style.setProperty("--editor-font-size",`${current_config.fontSizeEditor}px`); //Update settings from start
	if(current_config.appZoom==0){
		webFrame.setZoomFactor(0.8); //Small size
	}else if(current_config.appZoom==20){
		webFrame.setZoomFactor(1); 	//Default size
	}else if(current_config.appZoom==40){ 
		webFrame.setZoomFactor(1.2); //Big size
	}
}
function updatezoom(){
	const value = document.getElementById("slider_zoom").value;
	if(value==0){
		webFrame.setZoomFactor(0.8); //Small size
	}else if(value==20){
		webFrame.setZoomFactor(1); //Default size
	}else if(value==40){ 
		webFrame.setZoomFactor(1.2); //Big size
	}
	current_config.appZoom = value;
}
function goSPage(num){
	for(i = 0; i <document.getElementById("nav_bar").children[0].children.length;i++){
		document.getElementById("nav_bar").children[0].children[i].classList = " ";
	}
	switch (num){
		case "1":
				document.getElementById("body_content").innerHTML=`
				<div id="dpi">
						<h3>${current_config.language["ZoomSize"]}</h3>
						<div class="section">
								<p>Adjust to the size you prefer.</p>
								<input id="slider_zoom" onchange="updatezoom()" type="range" min="0" step="20" max="40" value="${current_config.appZoom}" class="slider" id="myRange">
						</div>
				</div>
				<h3>${current_config.language["Themes"]}</h3> 
				<div class="section">
						<div id='theme_list'></div> 
						<p class="link">Wanna create your own?</p>
				</div>
				<h3>${current_config.language["ZenMode"]}</h3>
				<div class="section">
								<p>${current_config.language["ZenMode.ShowDirectoryExplorer"]}</p>
								<gv-switch  onclick="g_ZenMode(true)" class="${editor_mode!="zen"?"activated":"desactivated"}"></gv-switch>
				</div>
				`;
				for(i=0;i<themes.length; i++){			
						const themeDiv = document.createElement("div");
						themeDiv.setAttribute("class","theme_div");
						themeDiv.setAttribute("onclick","loadTheme('"+i+"'); selectTheme('1',this);");
						themeDiv.innerText=themes[i].Name; //Theme's name
						const author = document.createElement("p");
						author.innerText = current_config.language["MadeBy"] + themes[i]["Author"]; //Theme's autor's name
						author.setAttribute("style","font-size:15px")
						const description = document.createElement("p");
						description.innerText = themes[i]["Description"]; //Theme's description
						description.setAttribute("style","font-size:13px; line-height:2px;");
						themeDiv.appendChild(author);
						themeDiv.appendChild(description);				
						if(themes[i]["Name"] === current_config.theme["Name"]){
							selectTheme("1",themeDiv);
						}
						document.getElementById("theme_list").appendChild(themeDiv);
				}
				document.getElementById("navB1").classList.add("active");
		break;
		case "2":	
				document.getElementById("body_content").innerHTML=`		
				<div id='language_list'></div> `;
				for(i=0;i<languages.length; i++){
						const languageDiv = document.createElement("div");
						languageDiv.setAttribute("class","language_div");
						languageDiv.setAttribute("onclick","loadLanguage('"+languages[i]["g_l"]+"'); selectLang(this);");
						languageDiv.innerText=languages[i]["g_l"];			
						if(languages[i]["g_l"] === current_config.language["g_l"]){
							selectLang(languageDiv);
						}
					document.getElementById("language_list").appendChild(languageDiv);
				}
				document.getElementById("navB2").classList.add("active");
		break;
		case "3":	
				document.getElementById("body_content").innerHTML=`
				<div id="editor_fs">
						<h3>${current_config.language["FontSize"]}</h3>
						<div class="section">
								<input class="Input1" id="fs-input" onchange="updateEditorFontSize()" type="number" value="${current_config.fontSizeEditor}">
						</div>
						<h3>${current_config.language["Auto-Completion"]}</h3>
						<div class="section">
								<p>Disable to hide predictions</p>
								<gv-switch  onclick="g_turnAutoCompletion()" class="${current_config["autoCompletionPreferences"]}"></gv-switch>
						</div>
						
				</div>
				`;
				document.getElementById("navB3").classList.add("active");
		break;
		case "4":	
				document.getElementById("body_content").innerHTML=`
				<h3>${current_config.language["Performance"]}</h3>
				<div class="section">
						<p>${current_config.language["Settings-Advanced-Performance-Animations"]}</p>
						<gv-switch  onclick="g_disable_animations()" class="${current_config.animationsPreferences}"></gv-switch>
				</div>
				<div class="section">
						<p>${current_config.language["Highlighting"]}</p>
						<gv-switch  onclick="g_highlightingTurn()" class="${g_highlighting}"></gv-switch>
				</div>
				<h3>${current_config.language["Developers"]}</h3>
				<div class="section">
						<p>${current_config.language["Settings-Advanced-Developer-Tools-text"]}</p>
						<button class="button1" onclick="graviton.openDevTools();">${current_config.language["DeveloperTools"]}</button>
				</div>
				<h3>${current_config.language["FactoryReset"]}</h3>
				<div class="section">
						<p>${current_config.language["Settings-Advanced-FactoryReset-text"]}</p>
						<button class="button1 red" onclick="factory_reset_dialog();">${current_config.language["FactoryReset"]}</button>
				</div>
				
				`;
				document.getElementById("navB4").classList.add("active");
		break;
		case "5":	
				document.getElementById("body_content").innerHTML=`
				<h3>${current_config.language["About"]} </h3>
				<div class="section">
						<p>${current_config.language["About-text1"]}</p>
						<p>${current_config.language["About-text2"]}</p>
						<button class="button1" onclick="shell.openExternal('https://github.com/Graviton-Code-Editor')">Website</button>
						<button class="button1" onclick="shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/')">Source Code</button>
						<button class="button1" onclick="shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md')">License</button>
				</div>
				<h3>${current_config.language["CurrentVersion"]}</h3>
				<div class="section">
						<p>${current_config.language['Version']}: ${g_version.version} (${g_version.date}) - ${g_version.state}</p>
      			<p> ${current_config.language['OS']}: ${graviton.currentOS()}</p>
						<button class="button1" onclick="CHECK_UPDATES();">Check for updates</button>
				</div>`;
				document.getElementById("navB5").classList.add("active");
		break;
	}
}
const g_highlightingTurn = function(){
	if(g_highlighting == "activated"){
		for(i=0;i<editors.length;i++){
			if(editors[i]!=undefined){
				editors[i].editor.setOption("mode","text/plain");
				editors[i].editor.refresh();
			}
		}
		g_highlighting = "desactivated";
	}else{
		for(i=0;i<editors.length;i++){
			if(editors[i].path.split(".").pop()=="html"){
				editors[i].editor.setOption("mode", "htmlmixed");
        editors[i].editor.setOption("htmlMode", true);
			}else{
				editors[i].editor.setOption("mode",editors[i].path.split(".").pop());
			}
			editors[i].editor.refresh();
		}
		g_highlighting = "activated";
	}
}
const g_turnAutoCompletion = ()=> current_config["autoCompletionPreferences"] = current_config["autoCompletionPreferences"]=="activated"? "desactivated":"activated";

const g_disable_animations = ()=>{
	if(current_config.animationsPreferences == "activated"){
		if(document.getElementById("_ANIMATIONS") != null){
			document.getElementById("_ANIMATIONS").innerText =`*{  transition: none !important;}`; 
		}else{
			const  style = document.createElement("style");
			style.innerText = `*{  transition: none !important;}`;
		  style.id = "_ANIMATIONS";
		  document.body.insertBefore(style,document.body.children[0]);
		}
		current_config.animationsPreferences = "desactivated";
	}else{
		document.getElementById("_ANIMATIONS").innerText = "";
		current_config.animationsPreferences = "activated";
	}
}
function factory_reset_dialog(){
	createDialog({
    id:"factory_reset",
    title:current_config.language['FactoryReset'],
    content:current_config.language['FactoryReset-dialog-message'],
    buttons:{
      [current_config.language['Decline']]:"closeDialog(this)",
      [`${current_config.language['Yes']} , ${current_config.language['Continue']}`]:"closeDialog(this); FactoryReset()",
    }
  })
}
function selectLang(lang){
	const languages_divs = document.getElementsByClassName("language_div");
	for(i=0; i <languages_divs.length; i++){
		languages_divs[i].style = "";
	}
	lang.style = "background: var(--accentColor); color:white;";
}
function selectTheme(from,theme){
	let themes_divs;
	if(from==="1"){
			themes_divs = document.getElementsByClassName("theme_div");
	}else{
			themes_divs = document.getElementsByClassName("theme_div_welcomePage");
	}
	for(i=0; i <themes_divs.length; i++){
			themes_divs[i].style = "";
	}
	theme.style = "background: var(--accentColor); color:white;";
}
function getState(element){
        if(element.classList.contains("disabled")){
            return "disabled";
        }else{
            return element.classList.contains("activated");
        }
}
class Switch extends  HTMLElement {
    constructor() {
        super(); 
    }
    connectedCallback(){
    		this.innerHTML = "";
        const body = document.createElement("div");
        const dot = document.createElement("div");
        body.setAttribute("class",this.getAttribute("class")+" switch");
        this.appendChild(body);
        body.appendChild(dot);
        this.addEventListener('click', function(){
                const dot = this.childNodes[0];
                if(this.classList.contains("disabled")===false){
                    if( getState(this)) {
                        this.classList.replace("activated","desactivated");
                        dot.classList.replace("activated","desactivated");
                    }else {
                        this.classList.replace("desactivated","activated");
                        dot.classList.replace("desactivated","activated");
                     }
                }
        });
    }
}
window.customElements.define('gv-switch', Switch);
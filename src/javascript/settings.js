/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
function openSettings(){
	const settings_window = new Window({
	id:"settings_window",
	content:`
		<div id="g_settings_panel">
			<h2 class="window_title window_title2 translate_word"  idT="Settings">${current_config.language["Settings"]}</h2> 
			<div id="nav_bar">
	      <button id="navB1" onclick="goSPage('1')" class="translate_word" idT="Customization">${current_config.language["Customization"]}</button>
	      <button id="navB2" onclick="goSPage('2')" class="translate_word" idT="Languages">${current_config.language["Languages"]}</button>
	      <button id="navB3" onclick="goSPage('3')" class="translate_word" idT="Editor">${current_config.language["Editor"]}</button>
	    	<button id="navB4" onclick="goSPage('4')" class="translate_word" idT="Advanced">${current_config.language["Advanced"]}</button>
	    	<button id="navB5" onclick="goSPage('5')" class="translate_word" idT="About">${current_config.language["About"]}</button>
			</div>
	  </div>
	  <div id="settings_content"></div>`,
	onClose:"saveConfig();"
	})
	settings_window.launch()
}
function updateSettingsFromUI() {
	current_config.fontSizeEditor =  document.getElementById("fs-input").value;
	document.documentElement.style.setProperty("--editor-font-size",`${document.getElementById("fs-input").value}px`);//Update settings from window
	for(i=0;i<editors.length;i++){
		editors[i].editor.refresh();
	}
}
function updateCustomization(){
	current_config.appZoom = document.getElementById("slider_zoom").value;
	webFrame.setZoomFactor(current_config.appZoom/25); 
}
function updateSettings(){
	document.documentElement.style.setProperty("--editor-font-size",`${current_config.fontSizeEditor}px`); //Update settings from start
	webFrame.setZoomFactor(current_config.appZoom/25); 
}

function goSPage(num){
	for(i = 0; i <document.getElementById("nav_bar").children.length;i++){
		document.getElementById("nav_bar").children[i].classList.remove("active");
	}
	switch (num){
	case "1":
			document.getElementById("settings_content").innerHTML=`
			<div id="dpi">
				<h3>${current_config.language["ZoomSize"]}</h3>
				<div class="section">
					<input id="slider_zoom" onchange="updateCustomization()" type="range" min="0" step="5" max="50" value="${current_config.appZoom}" class="slider" id="myRange">
				</div>
			</div>
			<h3>${current_config.language["Themes"]}</h3> 
			<div class="section">
				<div id='theme_list'></div> 
				<p>${current_config.language["Themes.Text"]}</p>
				<gv-switch  onclick="useSystemColors()" class="${current_config.accentColorPreferences=="system"?"activated":"desactivated"}"></gv-switch>
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
				themeDiv.innerHTML=`
				<p style="margin:11px 0; font-size:17px; line-height:2px;">${themes[i].Name}</p>
				<p style="font-size:15px;">${current_config.language["MadeBy"] + themes[i]["Author"]}</p>
				<p style="font-size:13px; line-height:2px;">${themes[i]["Description"]}</p>
				`
				if(themes[i]["Name"] === current_config.theme["Name"]){
					selectTheme("1",themeDiv);
				}
				document.getElementById("theme_list").appendChild(themeDiv);
			}
			document.getElementById("navB1").classList.add("active");
		break;
		case "2":	
				document.getElementById("settings_content").innerHTML=`		
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
				document.getElementById("settings_content").innerHTML=`
				<div id="editor_fs">
						<h3>${current_config.language["FontSize"]}</h3>
						<div class="section">
								<input class="input1" id="fs-input" onchange="updateSettingsFromUI()" type="number" value="${current_config.fontSizeEditor}">
						</div>
						<h3>${current_config.language["Auto-Completion"]}</h3>
						<div class="section">
								<p>${current_config.language["Settings-Editor-AutoCompletion-text"]} </p>
								<gv-switch  onclick="g_turnAutoCompletion()" class="${current_config["autoCompletionPreferences"]}"></gv-switch>
						</div>
						<h3>${current_config.language["Line-Wrapping"]}</h3>
						<div class="section">
								<gv-switch onclick="g_turnLineWrapping()" class="${current_config["lineWrappingPreferences"]}"></gv-switch>
						</div>
						<h3>${current_config.language["Highlighting"]}</h3>
						<div class="section">
						<gv-switch  onclick="g_highlightingTurn()" class="${g_highlighting}"></gv-switch>
				</div>
						
				</div>
				`;
				document.getElementById("navB3").classList.add("active");
		break;
		case "4":	
				document.getElementById("settings_content").innerHTML=`
				<h3>${current_config.language["Performance"]}</h3>
				<div class="section">
						<p>${current_config.language["Settings-Advanced-Performance-Animations"]}</p>
						<gv-switch  onclick="g_disable_animations()" class="${current_config.animationsPreferences}"></gv-switch>
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
				document.getElementById("settings_content").innerHTML=`
				<h3>${current_config.language["About"]} </h3>
				<div class="section">
						<p>${current_config.language["About-text1"]}</p>
						<p>${current_config.language["About-text2"]}</p>
						<button class="button1" onclick="shell.openExternal('https://www.graviton.ml')">Website</button>
						<button class="button1" onclick="shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/')">Source Code</button>
						<button class="button1" onclick="shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md')">License</button>
				</div>
				<h3>${current_config.language["CurrentVersion"]}</h3>
				<div class="section">
					<div id="about_section">
						<p>${current_config.language['Version']}: ${g_version.version} (${g_version.date}) - ${g_version.state}</p>
      			<p>${current_config.language['OS']}: ${graviton.currentOS()}</p>
      		</div>
      		<button class="button1" onclick="graviton.dialogChangelog();">${current_config.language["Changelog"]}</button>
					<button class="button1" onclick="CHECK_UPDATES();">${current_config.language["CheckUpdates"]}</button>
				</div>`;
				if(new_update!=false){
					document.getElementById("about_section").innerHTML += `
					<p style="color:var(--accentColor);">New update is live! - ${new_update[g_version.state]["version"]}</p>
					`;
				}
				document.getElementById("navB5").classList.add("active");
		break;
	}
}
const useSystemColors=()=>{
	if(current_config.accentColorPreferences=="manual"){
		current_config["accentColorPreferences"]= "system";
		try{
			document.documentElement.style.setProperty("--accentColor","#"+systemPreferences.getAccentColor()); 
		}catch{ //Returns an error = system is not compatible, Linux-based will probably throw that error
			new Notification("Issue","Your system is not compatible with this feature.")
		}
	}else{
		document.documentElement.style.setProperty("--accentColor",themeObject.Colors.accentColor); 
		current_config["accentColorPreferences"]= "manual";
	}
}
const g_highlightingTurn = function(){
	if(g_highlighting == "activated"){
		for(i=0;i<editors.length;i++){
			if(editors[i].editor!=undefined){
				editors[i].editor.setOption("mode","text/plain");
				editors[i].editor.refresh();
			}
		}
		g_highlighting = "desactivated";
	}else{
		for(i=0;i<editors.length;i++){
			if(editors[i].editor!=undefined){
				if(editors[i].path.split(".").pop()=="html"){
					editors[i].editor.setOption("mode", "htmlmixed");
		      editors[i].editor.setOption("htmlMode", true);
		      editors[i].editor.refresh();
				}else{
					updateCodeMode(editors[i].editor,path);
				}
				
			}
		}
		g_highlighting = "activated";
	}
}

const g_turnAutoCompletion = ()=> current_config["autoCompletionPreferences"] = current_config["autoCompletionPreferences"]=="activated"? "desactivated":"activated";
const g_turnLineWrapping = ()=>{
	if(current_config["lineWrappingPreferences"]=="activated"){
		for(i=0;i<editors.length;i++){
			if(editors[i].editor!=undefined){
				editors[i].editor.setOption("lineWrapping",false);
				editors[i].editor.refresh();
			}
		}
		current_config["lineWrappingPreferences"]="desactivated"
	}else{
		for(i=0;i<editors.length;i++){
			if(editors[i].editor!=undefined){
				console.log(editors[i].editor);
				editors[i].editor.setOption("lineWrapping",true);
				editors[i].editor.refresh();
			}
		}
		current_config["lineWrappingPreferences"]="activated"
		console.log(current_config);
	}
}
const g_disable_animations = ()=>{
	if(current_config.animationsPreferences == "activated"){
		const  style = document.createElement("style");
		style.innerText = `*{-webkit-transition: none !important;
			  -moz-transition: none !important;
			  -o-transition: none !important;
			  transition: none !important;
				animation:0;}`;
	  style.id = "_ANIMATIONS";
	  document.documentElement.style.setProperty("--scalation","1");
	  document.documentElement.appendChild(style);
		current_config.animationsPreferences = "desactivated";
	}else{
		document.getElementById("_ANIMATIONS").remove();
		document.documentElement.style.setProperty("--scalation","0.98");
		current_config.animationsPreferences = "activated";
	}
}
function factory_reset_dialog(){
	new g_dialog({
    id:"factory_reset",
    title:current_config.language['FactoryReset'],
    content:current_config.language['FactoryReset-dialog-message'],
    buttons:{
    	[current_config.language['Decline']]:"closeDialog(this)",
      [`${current_config.language['Yes']} , ${current_config.language['Continue']}`]:"closeDialog(this); FactoryReset()"
      
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
        this.innerHTML = `
        <div class="${this.getAttribute("class")} switch">
        	<div></div>
        </div>`
        this.addEventListener('click', function(){
	        const dot = this.children[0];
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
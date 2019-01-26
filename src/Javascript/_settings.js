
const {webFrame} = require('electron');
 var nav_bar_settings ;
function hideSettings(){
	document.getElementById("window").remove();
	saveConfig();
}

function openSettings(){
	 nav_bar_settings =` 
	 <p style='font-size:25px; font-weight:800; line-height:7px; text-align:center;'>`+selected_language["Settings"]+`</p> 
			<div id="nav_bar">
	        <ol>
	          <li class="" id="navB1" onclick="goSPage('1')"><a>`+selected_language["Customization"]+`</a></li>
	          <li class="" id="navB2" onclick="goSPage('2')"><a>`+selected_language["Language"]+`</a></li>
	          <li class="" id="navB3" onclick="goSPage('3')"><a>`+selected_language["Advanced"]+`</a></li>
	        </ol>
	    </div>`;

	var all = document.createElement("div");
	all.setAttribute("id","window");
	all.setAttribute("style","-webkit-user-select: none;");

	var background = document.createElement("div");
	background.setAttribute("class","opened_window");
	background.setAttribute("onclick","hideSettings()"); 
	
	var body = document.createElement("div");
	body.setAttribute("class","body_window");
	body.setAttribute("id","body_window");
	
	var content = document.createElement("div");
	content.setAttribute("id","body_content");

	body.innerHTML =  nav_bar_settings;
	body.appendChild(content);

	all.appendChild(background);
	all.appendChild(body);
	document.body.appendChild(all);
	
}

function updateEditorFontSize() {
		
		document.documentElement.style.setProperty("--editor-font-size",document.getElementById("fs-input").value +"px");//Update settings from window
		FontSizeEditor =  document.getElementById("fs-input").value;
}

function updateSettings(){

	document.documentElement.style.setProperty("--editor-font-size",FontSizeEditor+"px"); //Update settings from start
	
	myCodeMirror.refresh();
	if(zoom_app==0){
		webFrame.setZoomFactor(0.8);
	}else if(zoom_app==20){
		webFrame.setZoomFactor(1);
	}else if(zoom_app==40){ 
		webFrame.setZoomFactor(1.2);
	}
}
function updatezoom(){

	var value = document.getElementById("slider_zoom").value;

	if(value==0){
		webFrame.setZoomFactor(0.8);
	}else if(value==20){
		webFrame.setZoomFactor(0.95);
	}else if(value==40){ 
		webFrame.setZoomFactor(1.2);
	}
	zoom_app = value;

}

function goSPage(num){
	for(i = 0; i <document.getElementById("nav_bar").children[0].children.length;i++){
		document.getElementById("nav_bar").children[0].children[i].classList = " ";
	}
	switch (num){
		case "1":
				
				document.getElementById("body_content").innerHTML=`
				<div id="dpi">
				<p>`+selected_language["Phrase1"]+`</p>
				 <input id="slider_zoom" onchange="updatezoom()" type="range" min="0" step="20" max="40" value="`+zoom_app+`" class="slider" id="myRange">
				</div>
				<p>`+selected_language["Phrase2"]+`</p> 
				<div id='theme_list'></div> 
				<div id="editor_fs">
				<p>`+selected_language["Phrase4"]+`</p>
				<input class="Input1" id="fs-input" onchange="updateEditorFontSize()" type="number" value="`+FontSizeEditor+`">
				<p>`+selected_language["Phrase5"]+`</p>
				<gv-switch id="time_spent_allow" class="`+allow_time_spent+`"></gv-switch>
				</div>`;
				for(i=0;i<themes.length; i++){
					
						var themeDiv = document.createElement("div");
						themeDiv.setAttribute("class","theme_div");
						themeDiv.setAttribute("onclick","loadTheme('"+i+"'); selectTheme('1',this);");
						themeDiv.innerText=themes[i].Name;
						var author = document.createElement("p");
						author.innerText = selected_language["Phrase3"] + themes[i]["Author"];
						author.setAttribute("style","font-size:15px")
						var description = document.createElement("p");
						description.innerText = themes[i]["Description"];
						description.setAttribute("style","font-size:13px; line-height:2px;");

						themeDiv.appendChild(author);
						themeDiv.appendChild(description);
						
						if(themes[i]["Name"] === current_theme["Name"]){

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

						var languageDiv = document.createElement("div");
						languageDiv.setAttribute("class","language_div");
						languageDiv.setAttribute("onclick","loadLanguage('"+languages[i]["Name"]+"'); selectLang(this);");
						languageDiv.innerText=languages[i]["Name"];
						
						if(languages[i]["Name"] === selected_language["Name"]){

							selectLang(languageDiv);
						}

					document.getElementById("language_list").appendChild(languageDiv);

				}
				document.getElementById("navB2").classList.add("active");

		break;
		case "3":
				
				document.getElementById("body_content").innerHTML=`
				
				<p>`+selected_language["FactoryReset"]+`</p>
				<button onclick="hideSettings(); createDialog('factory_reset',selected_language['FactoryReset'],selected_language['FactoryReset-dialog-message'],selected_language['Decline'],selected_language['Accept'],'closeDialog(this); ','closeDialog(this); FactoryReset();')">Factory Reset</button> `;

				document.getElementById("navB3").classList.add("active");

		break;

	}
	
}

function selectLang(lang){
	var languages_divs = document.getElementsByClassName("language_div");
	for(i=0; i <languages_divs.length; i++){
		languages_divs[i].style = "";
	}
	lang.style = "background: var(--accentColor); color:white;";
}

function selectTheme(from,theme){
	if(from==="1"){
	var themes_divs = document.getElementsByClassName("theme_div");
}else{
	var themes_divs = document.getElementsByClassName("theme_div_welcomePage");
}
	for(i=0; i <themes_divs.length; i++){
		themes_divs[i].style = "";
	}
	theme.style = "background: var(--accentColor); color:white;";
}
	
function getState(element){

        if(document.getElementById(element).classList.contains("disabled")){
            return "disabled";
        }else{
            return document.getElementById(element).classList.contains("activated");
        }

}

	class Switch extends  HTMLElement {
    constructor() {
        super(); 
    }
    connectedCallback(){
        var body = document.createElement("div");
        var dot = document.createElement("div");
        body.setAttribute("class",this.getAttribute("class")+" switch");
        body.setAttribute("id",this.id);
        this.appendChild(body);
        body.appendChild(dot);
        this.removeAttribute('id');
        body.addEventListener('click', function(){
                var dot = this.childNodes[0];
                if(this.classList.contains("disabled")===false){
                    if( getState(this.id)) {
                        this.classList.replace("activated","desactivated");
                        dot.classList.replace("activated","desactivated");
                        onChange(this.id);
                        return false;   
                    }else {
                        this.classList.replace("desactivated","activated");
                        dot.classList.replace("desactivated","activated");
                        onChange(this.id);
                        return true;
                     }
                }
        });
    }
}
window.customElements.define('gv-switch', Switch);

function FactoryReset(){
	fs.unlinkSync(configDir, (err)=>{	});  
	restartApp();
}

const {webFrame} = require('electron');
function hideSettings(){
	document.getElementById("window").remove();
}

function openSettings(){
	var all = document.createElement("div");
	all.setAttribute("id","window");
	all.setAttribute("style","-webkit-user-select: none;");

	var background = document.createElement("div");
	background.setAttribute("class","opened_window");
	background.setAttribute("onclick","hideSettings()"); 
	
	var body = document.createElement("div");
	body.setAttribute("class","body_window");
	body.setAttribute("id","body_window");
	

	//Window
	body.innerHTML = ` 
		
		<p style='font-size:30px; font-weight:800; line-height:7px; text-align:center;'>Settings</p> 
		<div id="dpi">
		<p>Screen Size</p>
		 <input id="slider_zoom" onchange="updatezoom()" type="range" min="0" step="20" max="40" value="`+zoom_app+`" class="slider" id="myRange">
		</div>
		<p>Themes</p> 
		<div id='theme_list'></div> 
		<div id="editor_fs">
		<p>Editor Font size</p>
		<input class="Input1" id="fs-input" type="number" value="`+FontSizeEditor+`">
		</div>
		<div id="time_spent_coding">
		<p>Time Spent Coding</p>
		</div>
		<p >Version 0.6.0</p>
		<button class='Button1' id="saveSettings"	onclick='saveSettings()'> Save Changes </button>
		

		`;
		console.log(FontSizeEditor);

	all.appendChild(background);
	all.appendChild(body);
	document.body.appendChild(all);

	for(i=0;i<themes.length; i++){
		var themeDiv = document.createElement("div");
		themeDiv.classList.add("theme_div");
		themeDiv.setAttribute("onclick","loadTheme('"+i+"')");
		themeDiv.innerText=themes[i].Name;
		var author = document.createElement("p");
		author.innerText = "Made by: " + themes[i]["Author"];
		author.setAttribute("style","font-size:15px")
		var description = document.createElement("p");
		description.innerText = themes[i]["Description"];
		description.setAttribute("style","font-size:13px; line-height:2px;");

		themeDiv.appendChild(author);
		themeDiv.appendChild(description);
	
		document.getElementById("theme_list").appendChild(themeDiv);
	}
	
}

function saveSettings() {
		
		document.documentElement.style.setProperty("--CodeFontSize",document.getElementById("fs-input").value +"px");//Update settings from window
		FontSizeEditor =  document.getElementById("fs-input").value;

		saveConfig();
		hideSettings(); //Hide settings page after saving all changes

}

function updateSettings(){

	document.documentElement.style.setProperty("--CodeFontSize",FontSizeEditor+"px"); //Update settings from start
	
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
		webFrame.setZoomFactor(1);
	}else if(value==40){ 
		webFrame.setZoomFactor(1.2);
	}
	zoom_app = value;

}
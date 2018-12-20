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
		<p>Themes</p> 
		<div id='theme_list'></div> 
		<div id="editor_fs">
		<p>Editor Font size</p>
		<input class="Input1" id="fs-input" type="number" value="`+FontSizeEditor+`">
		</div>
		<button class='Button1' id="saveSettings"	onclick='saveSettings()'> Save Changes </button>
		<p >Version 0.5.2</p>
		<p> We will notify you when a new version is released  </p>
		`

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

		saveConfig();
		hideSettings(); //Hide settings page after saving all changes

}

function updateSettings(){

	document.documentElement.style.setProperty("--CodeFontSize",FontSizeEditor+"px"); //Update settings from start
	myCodeMirror.refresh();
}
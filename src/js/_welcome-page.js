/*
########################################
              MIT License

Copyright (c) 2019 Graviton Editor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const g_hideWelcome = ()=> document.getElementById("welcome_window").remove();
const g_hideSetup = () => {
	document.getElementById("setup_p2").remove();
	current_config.justInstalled = false;
	saveConfig();
}
function g_welcomePage(){
	const all = document.createElement("div");
	all.setAttribute("id","welcome_window");
	all.setAttribute("style","-webkit-user-select: none;");
	const background = document.createElement("div");
	background.setAttribute("class","opened_window"); 
	background.setAttribute("onclick","g_hideWelcome()"); 
	const body = document.createElement("div");
	body.setAttribute("class","body_window2 flex");
	body.setAttribute("id","body_window_welcome");
	body.innerHTML = `
		<h1 id='title_welcome'>${current_config.language["Welcome"]}</h1> 
		<div id='recent_projects'><h2 class='title2'>${current_config.language["RecentProjects"]}</h2></div> 
		<div id='notes'><h2 class='title2'>${current_config.language["Notes"]}</h2>
		<p> Current build: ${ g_version.date } </p> 
		<p> OS: ${graviton.currentOS()}</p> 
		<p onclick="graviton.dialogChangelog()"><a>Changelog</a></p>
		<div class='welcomeButtons'>
		<button onclick='openFolder(); g_hideWelcome();' id='open_folder_welcome' class=" button1 translate_word" idT="OpenFolder">${current_config.language["OpenFolder"]}</button> 
		<button onclick='g_hideWelcome()' id='skip_welcome' class=" button1 translate_word" idT="Skip">${current_config.language["Skip"]}</button> 
		</div> </div>`;
	all.appendChild(background);
	all.appendChild(body);
	document.body.appendChild(all);
	fs.readFile(logDir, 'utf8', function (err,data) {
		  if (err) return console.log(err);
		  const objectLog = JSON.parse(data);
		  for(i=0;i<objectLog.length; i++){
					const project = document.createElement("div");
					project.setAttribute("class","project_div");
					project.setAttribute("onclick",`loadDirs('${objectLog[i].Path.replace(/\\/g, "\\\\")}','g_directories','yes'); g_hideWelcome();`);
					project.innerText=objectLog[i].Name;
					const description = document.createElement("p");
					description.innerText = objectLog[i].Path;
					description.setAttribute("style","font-size:12px;")
					project.appendChild(description);
					document.getElementById("recent_projects").appendChild(project);
			}
 	});
 setTimeout(function(){ DeleteBoot(); }, 1100); //Delay to load all the config
}
function g_Setup(){
	const all = document.createElement("div");
	all.setAttribute("id","setup_p1");
	all.setAttribute("style","-webkit-user-select: none;");
	const background = document.createElement("div");
	background.setAttribute("class","opened_window"); 
	const body = document.createElement("div");
	body.setAttribute("class","body_window2 ");
	body.setAttribute("id","body_firstTime_window");
	body.innerHTML =`		
				<h1 style="font-size:50px; text-align:center; " class="translate_word" idT="Languages">${current_config.language["Languages"]}</h1> 
				<div id='language_list'></div> 
				<button onclick='FTGoPage("2"); ' style=" position:fixed; right:5%; bottom: 5%;" class="button1 translate_word" idT="Continue">${current_config.language["Continue"]}</button> `;		
	all.appendChild(background);
	all.appendChild(body);
	document.body.appendChild(all);
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
	fs.writeFile(logDir, "[]", (err) => { }); //Delete old log
	DeleteBoot();
}
function FTGoPage(number){
	switch(number){
		case "1":
		document.getElementById("setup_p2").remove();
		break;
		case "2":
			document.getElementById("setup_p1").remove();
			const all = document.createElement("div");
			all.setAttribute("id","setup_p2");
			all.setAttribute("style","-webkit-user-select: none;");
			const background = document.createElement("div");
			background.setAttribute("class","opened_window"); 
			const body = document.createElement("div");
			body.setAttribute("class","body_window2");
			body.setAttribute("id","body_firstTime_window");
			body.innerHTML = `
				<h1 style="font-size:50px;  text-align:center;" class="translate_word" idT="Welcome.TakeATheme" >${current_config.language["Welcome.TakeATheme"]}</h1> 
				<div id='theme_list' style="height:60%;"></div> 
				<button onclick='FTGoPage("1"); g_Setup();' style=" position:fixed; left:5%; bottom: 5%;  " class='button1 translate_word' idT="Back">${current_config.language["Back"]}</button> 
				<button id="FROM_THEMES_CONTINUE" onclick='g_hideSetup(); g_welcomePage();' style=" position:fixed; right:5%; bottom: 5%;"  class="button1 disabled translate_word" idT="Finish">${current_config.language["Finish"]}</button> 
				`;
			all.appendChild(background);
			all.appendChild(body);
			document.body.appendChild(all);
			for(i=0;i<themes.length; i++){
				const themeDiv = document.createElement("div");
				themeDiv.setAttribute("class","  theme_div_welcomePage ");
				themeDiv.setAttribute("onclick",`loadTheme('${i}'); selectTheme('2',this);`);
				themeDiv.innerText=themes[i].Name;
				const author = document.createElement("p");
				author.innerText =`Made by: ${ themes[i]["Author"]}`;
				author.setAttribute("style","font-size:15px")
				const description = document.createElement("p");
				description.innerText = themes[i]["Description"];
				description.setAttribute("style","font-size:13px; line-height:2px;");
				themeDiv.appendChild(author);
				themeDiv.appendChild(description);
				themeDiv.addEventListener("click", function(){
					document.getElementById("FROM_THEMES_CONTINUE").classList.remove("disabled") ;
				});
				if(themes[i]["Name"] === current_config.theme["Name"]){
						selectTheme("2",themeDiv);
						console.log(themeDiv);
				}
				document.getElementById("theme_list").appendChild(themeDiv);		
			}
		break;
	}
}
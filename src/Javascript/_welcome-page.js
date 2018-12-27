let objectLog = " ";

function welcomePage(){

	let all = document.createElement("div");
	all.setAttribute("id","welcome_window");
	all.setAttribute("style","-webkit-user-select: none;");
	
	let background = document.createElement("div");
	background.setAttribute("class","opened_window"); 
	background.setAttribute("onclick","hideWelcome()"); 
	
	let body = document.createElement("div");
	body.setAttribute("class","body_window2 flex");
	body.setAttribute("id","body_window_welcome");

	body.innerHTML = `
		<h1 id='title_welcome'>Welcome</h1> 
		<div id='recent_projects'><h2 class='title2'>Recent projects</h2></div> 
		<div id='notes'><h2 class='title2'>Notes</h2> 
		<div class='welcomeButtons'>
		<button onclick='openFolder(); hideWelcome();' id='open_folder_welcome' class='button1'>Open Folder</button> 
		<button onclick='hideWelcome()' id='skip_welcome' class='button1'>Skip</button> 
		</div> </div>`;

	all.appendChild(background);
	all.appendChild(body);
	document.body.appendChild(all);
fs.readFile(register, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  if(objectLog != undefined) objectLog = JSON.parse(data);
  for(i=0;i<objectLog.length; i++){
  	var realPath = objectLog[i].Path.replace(/\\/g, "\\\\"); //Replace \ with \\  
		let project = document.createElement("div");
		project.setAttribute("class","project_div");
		project.setAttribute("onclick","loadDirs('"+realPath+"','left-bar','yes'); hideWelcome();");
		project.innerText=objectLog[i].Name;
		let description = document.createElement("p");
		description.innerText = objectLog[i].Path;
		description.setAttribute("style","font-size:13px;")
		project.appendChild(description);
		
		document.getElementById("recent_projects").appendChild(project);
	}
 });

 setTimeout(function(){ DeleteBoot(); }, 1000); //Delay to load all the config
 
}
function hideWelcome(){
	document.getElementById("welcome_window").remove();

}
function hideFirstTime(){
	document.getElementById("ft_2").remove();
	_firsTime = false;
	saveConfig();

}

function FirstTime(){

	let all = document.createElement("div");
	all.setAttribute("id","ft_1");
	all.setAttribute("style","-webkit-user-select: none;");
	
	let background = document.createElement("div");
	background.setAttribute("class","opened_window"); 
	
	let body = document.createElement("div");
	body.setAttribute("class","body_window2 flex");
	body.setAttribute("id","body_firstTime_window");

	body.innerHTML = `
		<h1  style="font-size:50px; text-align:center; position:absolute; left:50%; top: 40%;  transform: translate(-50%, -50%);">Welcome to Graviton!</h1> 
		
		<button onclick='FTGoPage("2")' style=" position:fixed; right:5%; bottom: 5%;  " class='button1'>Next</button> 
		`;

	all.appendChild(background);
	all.appendChild(body);
	document.body.appendChild(all);
	
	fs.writeFile(register, "[]", (err) => { });
	setTimeout(function(){ DeleteBoot(); }, 1000); //Delay to load all the config
}

function FTGoPage(number){
	switch(number){
		case "1":
		document.getElementById("ft_2").remove();
		break;
		case "2":
		document.getElementById("ft_1").remove();

		let all = document.createElement("div");
	all.setAttribute("id","ft_2");
	all.setAttribute("style","-webkit-user-select: none;");
	
	let background = document.createElement("div");
	background.setAttribute("class","opened_window"); 

	
	let body = document.createElement("div");
	body.setAttribute("class","body_window2");
	body.setAttribute("id","body_firstTime_window");

	body.innerHTML = `
		<h1 style="font-size:50px;  text-align:center;" >Take a theme!</h1> 

		<div id='theme_list' style="height:60%;"></div> 
		<button onclick='FTGoPage("1"); FirstTime();' style=" position:fixed; left:5%; bottom: 5%;  " class='button1'>Back</button> 
		<button onclick='hideFirstTime(); welcomePage();' style=" position:fixed; right:5%; bottom: 5%;  " class='button1'>Finish</button> 
		`;

	all.appendChild(background);
	all.appendChild(body);
	document.body.appendChild(all);

	for(i=0;i<themes.length; i++){
		var themeDiv = document.createElement("div");
		themeDiv.classList.add("theme_div_welcomePage");
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

		break;
		case "3":
		

		break;
	}
}


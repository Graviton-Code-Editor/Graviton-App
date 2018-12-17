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
 
 checkForUpdates(); //Call the function to check if there are updates

}
function hideWelcome(){
	document.getElementById("welcome_window").remove();
}
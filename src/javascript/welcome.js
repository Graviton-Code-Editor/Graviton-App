/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanztor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

let welcome_window;
function openWelcome() {
  welcome_window = new Window({
    id: "welcome_window",
    content: `
		<h2  idT="Welcome" class='translate_word window_title'>${
      current_config.language["Welcome"]
    }</h2> 
		<div class="flex">
      <div id="recent_projects" class="horizontal">
      <elastic-container>
				<h2  idT="RecentProjects" class="translate_word">${
          current_config.language["RecentProjects"]
        }</h2>
        </elastic-container>
			</div> 
			<div id="notes" class="horizontal">
				<h2  idT="Notes" class='translate_word title2'>${
          current_config.language["Notes"]
        }</h2>
				<p> ${current_config.language["Version"]}: ${g_version.version} (${
      g_version.date
    }) - ${g_version.state}</p> 
				<p  > OS: ${graviton.currentOS().name}</p> 
				<p idT="Changelog" class="translate_word link" onclick="graviton.dialogChangelog()">${
          current_config.language["Changelog"]
        }</p>
			</div>
		</div>
		<div class='welcomeButtons'>
			<button onclick='openFolder(); welcome_window.close();' id='open_folder_welcome' class=" button1 translate_word" idT="OpenFolder">${
        current_config.language["OpenFolder"]
      }</button> 
			<button onclick='welcome_window.close();' id='skip_welcome' class=" button1 translate_word" idT="Skip">${
        current_config.language["Skip"]
      }</button> 
		</div>`
  });
  welcome_window.launch();
  fs.readFile(logDir, "utf8", function(err, data) {
    if (err) return console.log(err);
    const objectLog = JSON.parse(data);
    for (i = 0; i < objectLog.length; i++) {
      const project = document.createElement("div");
      project.setAttribute("class", "project_div");
      project.setAttribute(
        "onclick",
        `loadDirs('${objectLog[i].Path.replace(
          /\\/g,
          "\\\\"
        )}','g_directories','yes'); welcome_window.close();`
      );
      project.innerText = objectLog[i].Name;
      const description = document.createElement("p");
      description.innerText = objectLog[i].Path;
      description.setAttribute("style", "font-size:12px;");
      project.appendChild(description);
      document.getElementById("recent_projects").appendChild(project);
    }
  });
  if (error_showed == false) DeleteBoot(); // Delay to load all the config
}
const Setup = {
  open: function() {
    for (i = 0; i < languages.length + 1; i++) {
      if (i == languages.length) {
        loadLanguage(languages[0]); // Load english in case Graviton doesn't support the system's language
      } else if (languages[i].g_l_a == navigator.language) {
        loadLanguage(languages[i].g_l); // Load system language
      }
    }
    const all = document.createElement("div");
    all.setAttribute("id", "g_setup");
    all.innerHTML = `
  	<div class="body_window_full">
  		<div id="body_window_full">
  		</div>
  	</div>`;
    document.body.appendChild(all);
    Setup.navigate("languages");
    graviton.deleteLog();
    if (error_showed == false) DeleteBoot();
  },
  close: function() {
    document.getElementById("g_setup").remove();
    current_config.justInstalled = false;
    saveConfig();
  },
  navigate: function(number) {
    switch (number) {
      case "languages":
        document.getElementById("body_window_full").innerHTML = `
          <h1 style="font-size:50px; text-align:center; position:relative; " class="translate_word" idT="Languages">${
            current_config.language["Languages"]
          }</h1> 
          
          <div id='language_list' class=welcome><elastic-container related=parent></elastic-container></div> 
          
          <button onclick=${
            themes.length != 0 ? "Setup.navigate('themes');" : "Setup.navigate('3');"
          }  style=" position:fixed; right:5%; bottom: 5%;" class="button1 translate_word" idT="Continue">${
          current_config.language["Continue"]
        }</button>      `;
        for (i = 0; i < languages.length; i++) {
          const languageDiv = document.createElement("div");
          languageDiv.setAttribute("class", "language_div");
          languageDiv.setAttribute(
            "onclick",
            "loadLanguage('" + languages[i]["g_l"] + "'); selectLang(this);"
          );
          languageDiv.innerText = languages[i]["g_l"];
          if (languages[i]["g_l"] === current_config.language["g_l"]) {
            selectLang(languageDiv);
          }
          document.getElementById("language_list").appendChild(languageDiv);
        }
        break;
      case "themes":
        document.getElementById("body_window_full").innerHTML = `
          <h1 style=" text-align:center;" class="translate_word" idT="Welcome.TakeATheme" >${
            current_config.language["Welcome.TakeATheme"]
          }</h1> 
          <div class=theme_divs>
            <img draggable=false onclick="setThemeByName('Dark'); selectTheme('2',this);" class='theme_div2 active' src=src/icons/dark.svg>
            <img draggable=false onclick="setThemeByName('Arctic'); selectTheme('2',this);" class=theme_div2 src=src/icons/light.svg>
          </div> 
          <button onclick='Setup.navigate("languages"); ' style=" position:fixed; left:5%; bottom: 5%;  " class='button1 translate_word' idT="Back">${
            current_config.language["Back"]
          }</button> 
          <button  onclick='Setup.navigate("welcome");' style=" position:fixed; right:5%; bottom: 5%;"  class="button1 translate_word" idT="Continue">${
            current_config.language["Continue"]
          }</button> 
        `;
        break;
      case "welcome":
        document.getElementById("body_window_full").innerHTML = `
          <h1 style=" font-size:30px;
           margin-top:100px;
            text-align:center;" 
            class="translate_word" 
            idT="Welcome.ThanksForInstalling">
            ${current_config.language["Welcome.ThanksForInstalling"]} ${
          g_version.version
        } - ${g_version.state}</h1> 
          <button onclick="Setup.close(); extensions.openStore(function(){extensions.navigate('all')});" style=" position:fixed;  left:5%; bottom: 5%;"  class="button1 translate_word" idT="Market">${
            current_config.language["Market"]
          }</button> 
          <button onclick='Setup.close(); openWelcome();' style=" position:fixed;  right:5%; bottom: 5%;"  class="button1 translate_word" idT="Finish">${
            current_config.language["Finish"]
          }</button> 
          `;
        break;
    }
  }
};

/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanztor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict"
log = require(logDir)
let welcome_window;
function openWelcome() {
  if(graviton.isProduction()==true){
    if(remote.process.argv[1] !=undefined){
      const dir = path.resolve(remote.process.argv[1])
      console.log(dir)
      loadDirs(dir, "g_directories", true);
      if (error_showed == false) DeleteBoot(); 
      return;
    }
  }
  welcome_window = new Window({
    id: "welcome_window",
    content: `
		<h2  idT="Welcome" class='translate_word window_title'>${
      getTranslation("Welcome")
    }</h2> 
		<div class="flex">
      <div id="recent_projects" class="horizontal">
      <elastic-container>
        <div class="flex-2">
          <h2  idT="RecentProjects" class="translate_word">${
            getTranslation("RecentProjects")
          }</h2>
          <div style="float:right; right:0; position:relative; top:16px; margin:4px; margin-left:auto; margin-right:0;">
            <button style=display:none id=clear_log onclick="graviton.deleteLog(); closeWindow('welcome_window')" class=button3>Clear</button>
          </div>
        </div>
      </elastic-container>
			</div> 
			<div id="notes" class="horizontal">
				<h2  idT="Notes" class='translate_word title2'>${
          getTranslation("Notes")
        }</h2>
				<p> ${getTranslation("Version")}: ${g_version.version} (${
      g_version.date
    }) - ${g_version.state}</p> 
				<p  > OS: ${graviton.currentOS().name}</p> 
				<p idT="Changelog" class="translate_word link" onclick="graviton.dialogChangelog()">${
          getTranslation("Changelog")
        }</p>
			</div>
		</div>
		<div class='welcomeButtons'>
			<button onclick='openFolder(); welcome_window.close();' id='open_folder_welcome' class=" button1 translate_word" idT="OpenFolder">${
        getTranslation("OpenFolder")
      }</button> 
			<button onclick='welcome_window.close();' id='skip_welcome' class=" button1 translate_word" idT="Skip">${
        getTranslation("Skip")
      }</button> 
		</div>`
  });
  welcome_window.launch();
  for (i = 0; i < log.length; i++) {
    const project = document.createElement("div");
    project.setAttribute("class", "section-2");
    project.setAttribute(
      "onclick",
      `loadDirs('${log[i].Path.replace(
        /\\/g,
        "\\\\"
      )}','g_directories','yes'); welcome_window.close();`
    );
    project.innerText = log[i].Name;
    const description = document.createElement("p");
    description.innerText = log[i].Path;
    description.setAttribute("style", "font-size:12px;");
    project.appendChild(description);
    if(  document.getElementById("recent_projects")==undefined) return;
    document.getElementById("recent_projects").appendChild(project);
    document.getElementById("clear_log").style="";
  }
  if (error_showed == false) DeleteBoot(); 
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
    all.id = "graviton_setup"
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
    document.getElementById("graviton_setup").remove();
    current_config.justInstalled = false;
    saveConfig();
  },
  navigate: function(number) {
    switch (number) {
      case "languages":
        document.getElementById("body_window_full").innerHTML = `
          <h1 style="font-size:40px; text-align:center; position:relative; " class="translate_word" idT="Languages">${
            getTranslation("Languages")
          }</h1> 
          
          <div id='language_list' class=welcome><elastic-container related=parent></elastic-container></div> 
          
          <button onclick=${
            themes.length != 0 ? "Setup.navigate('themes');" : "Setup.navigate('additional_settings');"
          }  style=" position:fixed; right:5%; bottom: 5%;" class="button1 translate_word" idT="Continue">${
            getTranslation("Continue")
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
          <h1 style="font-size:40px; text-align:center;" class="translate_word" idT="Welcome.TakeATheme" >${
            getTranslation("Welcome.TakeATheme")
          }</h1> 
          <div class=theme_divs>
            <img draggable=false onclick="graviton.setTheme('Dark'); selectTheme('2',this);" class='theme_div2 ${current_config.theme=="Dark"?"active":""}' src=src/icons/dark.svg>
            <img draggable=false onclick="graviton.setTheme('Arctic'); selectTheme('2',this);" class='theme_div2 ${current_config.theme=="Arctic"?"active":""}' src=src/icons/light.svg>
          </div> 
          <button onclick='Setup.navigate("languages"); ' style=" position:fixed; left:5%; bottom: 5%;  " class='button1 translate_word' idT="Back">${
            getTranslation("Back")
          }</button> 
          <button  onclick='Setup.navigate("additional_settings");' style=" position:fixed; right:5%; bottom: 5%;"  class="button1 translate_word" idT="Continue">${
            getTranslation("Continue")
          }</button> 
        `;
        break;
      case "additional_settings":
          document.getElementById("body_window_full").innerHTML = `
          <h1 style="font-size:40px; text-align:center;" class="translate_word" idT="Welcome.TakeATheme" >${
            getTranslation("Welcome.AdditionalSettings")
          }</h1> 
          <div style="overflow:auto; position:relative;max-height:60%">
            
            <div class=section-1>
              <div class=section-4>
                <p>${getTranslation("ZoomSize")}</p>
                <input id="slider_zoom" onchange="updateCustomization(); saveConfig();" type="range" min="0" step="5" max="50" value="${
                current_config.appZoom
              }" class="slider" >
              </div> 
              <div class=section-4>
                <p>${getTranslation("Blur")}</p>
                <input id="slider_blur" onchange="updateCustomization(); saveConfig();" type="range" min="0" step="0.2" max="50" value="${
                  current_config.blurPreferences
                }" class="slider" >
              </div> 
              <div class=section-4>
                <p>${getTranslation("Bounce")}</p>
                <gv-switch  onclick="graviton.toggleBounceEffect(); saveConfig();" class="${
                  current_config.bouncePreferences
                }"></gv-switch>
              </div> 
              <div class=section-4>
                <p>${getTranslation("MiniMap")}</p>
                <gv-switch  onclick="graviton.toggleMiniMap(); saveConfig();" class="${
                  current_config.miniMapPreferences
                }"></gv-switch>
              </div> 
            </div> 
            </div>
            <button onclick='Setup.navigate("themes"); ' style=" position:fixed; left:5%; bottom: 5%;  " class='button1 translate_word' idT="Back">${
              getTranslation("Back")
            }</button> 
            <button  onclick='Setup.navigate("welcome");' style=" position:fixed; right:5%; bottom: 5%;"  class="button1 translate_word" idT="Continue">${
              getTranslation("Continue")
            }</button> 
            
        `;
          break;
      case "welcome":
        document.getElementById("body_window_full").innerHTML = `
          <h1 style=" font-size:40px;
          transform:translate(-50%,-50%);
          position:absolute;
          top:45%;
          left:50%;
            text-align:center;" 
            class="translate_word" 
            idT="Welcome.ThanksForInstalling">
            ${getTranslation("Welcome.ThanksForInstalling")} ${
          g_version.version
        } - ${g_version.state} <img draggable="false" class="emoji-title" src="src/openemoji/1F973.svg"> </h1> 
          <button onclick="Setup.close(); extensions.openStore(function(){extensions.navigate('all')});" style=" position:fixed;  left:5%; bottom: 5%;"  class="button1 translate_word" idT="Market">${
            getTranslation("Market")
          }</button> 
          <button onclick='Setup.close(); openWelcome();' style=" position:fixed;  right:5%; bottom: 5%;"  class="button1 translate_word" idT="Finish">${
            getTranslation("Finish")
          }</button> 
          `;
        break;
    }
  }
};
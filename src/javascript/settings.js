/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const Settings = {
  open: function() {
    const settings_window = new Window({
      id: "settings_window",
      content: `
      <div class="g_lateral_panel">
        <h2 class="window_title window_title2 translate_word"  idT="Settings">${
          current_config.language["Settings"]
        }</h2> 
        <div id="navbar1" class="navbar">
          <button id="navB1" onclick="Settings.navigate('1')" class="translate_word" idT="Customization">${getTranslation(
            "Customization"
          )}</button>
          <button id="navB2" onclick="Settings.navigate('2')" class="translate_word" idT="Languages">${getTranslation(
            "Languages"
          )}</button>
          <button id="navB3" onclick="Settings.navigate('3')" class="translate_word" idT="Editor">${getTranslation(
            "Editor"
          )}</button>
          <button id="navB4" onclick="Settings.navigate('4')" class="translate_word" idT="Advanced">${getTranslation(
            "Advanced"
          )}</button>
          <button id="navB5" onclick="Settings.navigate('5')" class="translate_word" idT="About">${getTranslation(
            "About"
          )}</button>
        </div>
      </div>
      <div id="_content1" class="window_content"></div>`,
      onClose: "saveConfig();"
    });
    settings_window.launch();
  },
  navigate: function(num) {
    for (i = 0; i < document.getElementById("navbar1").children.length; i++) {
      document.getElementById("navbar1").children[i].classList.remove("active");
    }
    switch (num) {
      case "1":
        document.getElementById("_content1").innerHTML = `
        <elastic-container related=self>
          <div id="dpi">
            <h>${current_config.language["ZoomSize"]}</h4>
            <div class="section-1">
              <input id="slider_zoom" onchange="updateCustomization(); saveConfig();" type="range" min="0" step="5" max="50" value="${
                current_config.appZoom
              }" class="slider" >
            </div>
          </div>
          <h4>${current_config.language["Themes"]}</h4> 
          <div class="section-1">
            <div id='theme_list'></div> 
            <p class="link" onclick="closeWindow('settings_window');extensions.openStore(function(){extensions.navigate('all')})">${getTranslation(
              "Market"
            )}</p>   
            <p>${current_config.language["Themes.Text"]}</p>
            <gv-switch  onclick="graviton.useSystemAccent(); saveConfig();" class="${
              current_config.accentColorPreferences == "system"
                ? "activated"
                : "desactivated"
            }"></gv-switch>
          </div>
          <h4>${getTranslation("Blur")}</h4>
          <div class="section-1">
            <input id="slider_blur" onchange="updateCustomization(); saveConfig();" type="range" min="0" step="0.2" max="50" value="${
              current_config.blurPreferences
            }" class="slider" >
          </div>
          <h4>${getTranslation("Bounce")}</h4>
          <div class="section-1">
          <gv-switch  onclick="graviton.toggleBounceEffect(); saveConfig();" class="${
            current_config.bouncePreferences
          }"></gv-switch>
          </div>
          <h4>${current_config.language["ZenMode"]}</h4>
          <div class="section-1">
            <p>${current_config.language["ZenMode.ShowDirectoryExplorer"]}</p>
            <gv-switch  onclick="graviton.toggleZenMode()" class="${
              editor_mode != "zen" ? "activated" : "desactivated"
            }"></gv-switch>
            
          </div>
          </elastic-container>`;
        for (i = 0; i < themes.length; i++) {
          const themeDiv = document.createElement("div");
          themeDiv.setAttribute("class", "theme_div");
          themeDiv.setAttribute(
            "onclick",
            `graviton.setTheme('${themes[i].name}'); selectTheme('1',this); saveConfig();`
          );
          themeDiv.innerHTML = `
            <p style="margin:11px 0; font-size:17px; line-height:2px;">${
              themes[i].name
            }</p>
            <p style="font-size:14px;">${current_config.language["MadeBy"] +
              themes[i]["author"]}</p>
            <p style="font-size:13px; line-height:2px;">${
              themes[i]["description"]
            }</p>
            <div class="accent" style="background:${
              themes[i].type != "custom_theme"
                ? themes[i].colors["accentColor"]
                : "transparent"
            };"></div>
          `;
          if (themes[i]["name"] === current_config.theme) {
            selectTheme("1", themeDiv);
          }
          document.getElementById("theme_list").appendChild(themeDiv);
        }
        document.getElementById("navB1").classList.add("active");
        break;
      case "2":
        document.getElementById("_content1").innerHTML = `   
          <div id='language_list'></div> `;
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
        document.getElementById("navB2").classList.add("active");
        break;
      case "3":
        document.getElementById("_content1").innerHTML = `
          <div id="editor_fs">
            <h4>${current_config.language["FontSize"]}</h4>
            <div class="section-1">
              <input class="input1" id="fs-input" onchange="updateSettingsFromUI()" type="number" value="${
                current_config.fontSizeEditor
              }">
            </div>
            <h4>${current_config.language["Auto-Completion"]}</h4>
            <div class="section-1">
              <p>${
                current_config.language[
                  "Settings-Editor-AutoCompletion-text"
                ]
              } </p>
              <gv-switch  onclick="graviton.toggleAutoCompletation()" class="${
                current_config["autoCompletionPreferences"]
              }"></gv-switch>
            </div>
            <h4>${current_config.language["Line-Wrapping"]}</h4>
            <div class="section-1">
              <gv-switch onclick="graviton.toggleLineWrapping()" class="${
                current_config["lineWrappingPreferences"]
              }"></gv-switch>
            </div>
            <h4>${current_config.language["Highlighting"]}</h4>
            <div class="section-1">
            <gv-switch  onclick="graviton.toggleHighlighting()" class="${g_highlighting}"></gv-switch>
          </div>
          `;
        document.getElementById("navB3").classList.add("active");
        break;
      case "4":
        document.getElementById("_content1").innerHTML = `
          <h4>${current_config.language["Performance"]}</h4>
          <div class="section-1">
              <p>${
                current_config.language[
                  "Settings-Advanced-Performance-Animations"
                ]
              }</p>
              <gv-switch  onclick="graviton.toggleAnimations()" class="${
                current_config.animationsPreferences
              }"></gv-switch>
          </div>
          <h4>${current_config.language["Developers"]}</h4>
          <div class="section-1">
              <p>${
                current_config.language[
                  "Settings-Advanced-Developer-Tools-text"
                ]
              }</p>
              <button class="button1" onclick="graviton.openDevTools();">${
                current_config.language["DeveloperTools"]
              }</button>
          </div>
          <h4>${current_config.language["FactoryReset"]}</h4>
          <div class="section-1">
              <p>${
                current_config.language["Settings-Advanced-FactoryReset-text"]
              }</p>
              <button class="button1 red" onclick="factory_reset_dialog();">${
                current_config.language["FactoryReset"]
              }</button>
          </div>
          
          `;
        document.getElementById("navB4").classList.add("active");
        break;
      case "5":
        document.getElementById("_content1").innerHTML = `
          <h4>${current_config.language["About"]} </h4>
          <div class="section-1">
              <p>${current_config.language["About-text1"]}</p>
              <p>${current_config.language["About-text2"]}</p>
              <button class="button1" onclick="shell.openExternal('https://www.graviton.ml')">Website</button>
              <button class="button1" onclick="shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/')">Source Code</button>
              <button class="button1" onclick="shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md')">License</button>
          </div>
          <h4>${current_config.language["CurrentVersion"]}</h4>
          <div class="section-1">
            <div id="about_section">
              <p>${current_config.language["Version"]}: ${g_version.version} (${
          g_version.date
        }) - ${g_version.state}</p>
              <p>${current_config.language["OS"]}: ${
          graviton.currentOS().name
        }</p>
            </div>
            <button class="button1" onclick="graviton.dialogChangelog();">${
              current_config.language["Changelog"]
            }</button>
            <button class="button1" onclick="updater.check_updates();">${
              current_config.language["CheckUpdates"]
            }</button>
          </div>`;
        if (new_update != false) {
          document.getElementById("about_section").innerHTML += `
            <p style="color:var(--accentColor);">New update is live! - ${
              new_update[g_version.state]["version"]
            }</p>
            `;
        }
        document.getElementById("navB5").classList.add("active");
        break;
    }
  }
};

function updateSettingsFromUI() {
  current_config.fontSizeEditor = document.getElementById("fs-input").value;
  document.documentElement.style.setProperty(
    "--editor-font-size",
    `${document.getElementById("fs-input").value}px`
  ); // Update settings from window
  for (i = 0; i < editors.length; i++) {
    if (editors[i].editor != undefined) editors[i].editor.refresh();
  }
}

function updateCustomization() {
  current_config.appZoom = document.getElementById("slider_zoom").value;
  webFrame.setZoomFactor(current_config.appZoom / 25);
  current_config.blurPreferences = document.getElementById("slider_blur").value;
  if (current_config.blurPreferences != 0) {
    document.documentElement.style.setProperty(
      "--blur",
      `${current_config.blurPreferences}px`
    );
  } else {
    document.documentElement.style.setProperty("--blur", `none`);
  }
  saveConfig();
}

function updateSettings() {
  document.documentElement.style.setProperty(
    "--editor-font-size",
    `${current_config.fontSizeEditor}px`
  ); // Update settings from start
  webFrame.setZoomFactor(current_config.appZoom / 25);
  if (current_config.blurPreferences != 0) {
    document.documentElement.style.setProperty(
      "--blur",
      `${current_config.blurPreferences}px`
    );
  } else {
    document.documentElement.style.setProperty("--blur", `none`);
  }
}

function factory_reset_dialog() {
  new Dialog({
    id: "factory_reset",
    title: current_config.language["FactoryReset"],
    content: current_config.language["FactoryReset-dialog-message"],
    buttons: {
      [current_config.language["Decline"]]: {},
      [`${current_config.language["Yes"]} , ${
        current_config.language["Continue"]
      }`]: {
        click: ()=>{
          FactoryReset()
        },
        important: true
      }
    }
  });
}

function selectLang(lang) {
  const languages_divs = document.getElementsByClassName("language_div");
  for (i = 0; i < languages_divs.length; i++) {
    languages_divs[i].classList.remove("active");
  }
  lang.classList.add("active");
}

function selectTheme(from, theme) {
  let themes_divs;
  switch (from) {
    case "1":
      themes_divs = document.getElementsByClassName("theme_div");
      break;
    case "2":
      themes_divs = document.getElementsByClassName("theme_div2");
      break;
  }
  for (i = 0; i < themes_divs.length; i++) {
    themes_divs[i].classList.remove("active");
  }
  theme.classList.add("active");
}

class Switch extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <div class="${this.getAttribute("class")} switch">
      	<div></div>
      </div>`;
    this.addEventListener("click", function() {
      const dot = this.children[0];
      if (this.classList.contains("disabled") === false) {
        if (this.getState(this)) {
          this.classList.replace("activated", "desactivated");
          dot.classList.replace("activated", "desactivated");
        } else {
          this.classList.replace("desactivated", "activated");
          dot.classList.replace("desactivated", "activated");
        }
      }
    });
  }
  getState(element) {
    if (element.classList.contains("disabled")) {
      return "disabled";
    } else {
      return element.classList.contains("activated");
    }
  }
}
window.customElements.define("gv-switch", Switch);

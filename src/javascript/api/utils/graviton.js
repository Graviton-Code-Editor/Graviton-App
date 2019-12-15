const graviton = {
    getCurrentTheme: function() {
      // Get the theme name of the applied theme
      return themeObject.name;
    },
    getSelectedText: function() {
      // Get te text you have selected
      const selected_text = window.getSelection().toString();
      if (selected_text !== "") {
        return selected_text;
      } else return null; // Returns null if there is not text selected
    },
    getCurrentFile: function() {
      return {
        path: filepath
      };
    },
    getCurrentEditor: function() {
      if (editors.length == 0) return null;
      return editors.find(item => item.id === editorID);
    },
    getCurrentDirectory: function() {
      if (dir_path == undefined) return null;
      return dir_path;
    },
    currentOS: function() {
      switch (process.platform) {
        case "win32":
          return {
            codename: process.platform,
            name: "Windows"
          };
          break;
        case "darwin":
          return {
            codename: process.platform,
            name: "MacOS"
          };
          break;
        case "linux":
          return {
            codename: process.platform,
            name: "Linux"
          };
          break;
        default:
          return {
            codename: process.platform,
            name: process.platform
          };
      }
    },
    openDevTools: function() {
      remote.getCurrentWindow().toggleDevTools();
    },
    editorMode: function() {
      return editor_mode;
    },
    throwError: function(message) {
      console.log(`(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()})%c Graviton ERROR :: `, " color: red",message);
      new Notification({
        title: "Error ",
        content: message
      });
    },
    dialogAbout: function() {
      new Dialog({
        id: "about",
        title: "",
        content: `
        <div style="display:flex; justify-content:center;  overflow:hidden; min-width:230px; ">
          <div>
            <img style="height:40px; margin-bottom:15px;" src="src/icons/logo.svg">
            <br>
            <span class="divider-2" style="margin:0px 30px; margin-bottom:20px; "></span>
            <div style=" left:17%;position:relative;text-align:left;margin-bottom:10px;">
            <b> ${getTranslation("Version")}:</b> ${GravitonInfo.version} <br>
            <b> ${getTranslation("Build")}: </b> ${GravitonInfo.date}<br>
            <b> ${getTranslation("State")}: </b> ${GravitonInfo.state}<br>
            <b> ${getTranslation("SO")}: </b> ${graviton.currentOS().name}
            </div>
          </div>
        </div>`,
        buttons: {
          [getTranslation("Close")]: {
            click: {},
            important: true
          }
        }
      });
    },
    dialogChangelog: function() {
      const marked = require("marked")
      fs.readFile(path.join(__dirname,"..","..","..","..", "RELEASE_CHANGELOG.md"), "utf8", function(
        err,
        data
      ) {
        new Dialog({
          id: "changelog",
          title: `${getTranslation("Changelog")} - v${GravitonInfo.version}`,
          content: `<div style="padding:2px;">${marked(data)}</div>`,
          buttons: {
            [getTranslation("Close")]: {}
          }
        });
      });
    },
    factoryResetDialog: function() {
      new Dialog({
        id: "factory_reset",
        title: getTranslation("FactoryReset"),
        content: getTranslation("FactoryReset-dialog-message"),
        buttons: {
          [getTranslation("Decline")]: {},
          [`${getTranslation("Yes")} , ${getTranslation("Continue")}`]: {
            click: () => {
              FactoryReset();
            },
            important: true
          }
        }
      });
    },
    removeScreen: function() {
      let content_editors = "";
      for (i = 0; i < editor_screens.length; i++) {
        content_editors += `
               <div onclick="if(screens.remove('${editor_screens[i].id}')){this.remove();}  " class="section-3" style="width:60px; height:100px; background:var(--accentColor);"></div>
               `;
      }
      new Dialog({
        id: "remove_screen",
        title: getTranslation("Dialog.RemoveScreen.title"),
        content: `<div style="overflow: auto;min-width: 100%;height: auto;overflow: auto;white-space: nowrap; display:flex;" >${content_editors}</div>`,
        buttons: {
          [getTranslation("Accept")]: {}
        }
      });
    },
    closingFileWarn: function(ele) {
      new Dialog({
        id: "saving_file_warn",
        title: getTranslation("Warn"),
        content: getTranslation("FileExit-dialog-message"),
        buttons: {
          [getTranslation("FileExit-dialog-button-accept")]: {
            click: () => {
              closeTab(ele.getAttribute("tabid"), true);
            }
          },
          [getTranslation("Cancel")]: {},
          [getTranslation("FileExit-dialog-button-deny")]: {
            click: () => {
              saveFile();
            },
            important: true
          }
        }
      });
    },
    addContextMenu: function(panel) {
      Object.keys(panel).forEach(function(key) {
        context_menu_list_text[key] = panel[key];
      });
    },
    toggleFullScreen: function(status) {
      g_window.setFullScreen(status);
    },
    toggleZenMode: function() {
      if (editor_mode == "zen") {
        editor_mode = "normal";
        document.getElementById("explorer_app").style =
          "visibility: visible; width:210px; display:flex;";
        document.getElementById("editor_resizer").style = " display:block;";
      } else {
        editor_mode = "zen";
        document.getElementById("explorer_app").style =
          "visibility: hidden; width:0px; display:none;";
        document.getElementById("editor_resizer").style =
          " width:0; display:none;";
      }
    },
    deleteLog: function() {
      fs.writeFile(logDir, "[]", err => {});
    },
    toggleAutoCompletation: function() {
      current_config["autoCompletionPreferences"] =
        current_config["autoCompletionPreferences"] == "activated"
          ? "desactivated"
          : "activated";
    },
    toggleLineWrapping: function() {
      if (current_config["lineWrappingPreferences"] == "activated") {
        for (i = 0; i < editors.length; i++) {
          if (editors[i].editor != undefined) {
            editors[i].editor.setOption("lineWrapping", false);
            editors[i].editor.refresh();
          }
        }
        current_config["lineWrappingPreferences"] = "desactivated";
      } else {
        for (i = 0; i < editors.length; i++) {
          if (editors[i].editor != undefined) {
            editors[i].editor.setOption("lineWrapping", true);
            editors[i].editor.refresh();
          }
        }
        current_config["lineWrappingPreferences"] = "activated";
      }
    },
    toggleHighlighting: function() {
      if (g_highlighting == "activated") {
        for (i = 0; i < editors.length; i++) {
          if (editors[i].editor != undefined) {
            editors[i].editor.setOption("mode", "text/plain");
            editors[i].editor.refresh();
          }
        }
        g_highlighting = "desactivated";
      } else {
        for (i = 0; i < editors.length; i++) {
          if (editors[i].editor != undefined) {
            updateCodeMode(editors[i].editor, path);
          }
        }
        g_highlighting = "activated";
      }
    },
    useSystemAccent: function() {
      const tinycolor = require("tinycolor2");
      if (current_config.accentColorPreferences == "manual") {
        current_config["accentColorPreferences"] = "system";
        try {
          document.documentElement.style.setProperty(
            "--accentColor",
            "#" + systemPreferences.getAccentColor()
          );
          document.documentElement.style.setProperty(
            "--accentDarkColor",
            tinycolor(systemPreferences.getAccentColor())
              .darken()
              .toString()
          );
          document.documentElement.style.setProperty(
            "--accentLightColor",
            tinycolor(systemPreferences.getAccentColor())
              .brighten()
              .toString()
          );
        } catch (err) {
          // Returns an error = system is not compatible, Linux-based will probably throw that error
          new Notification({
            title: "Warn",
            content: getTranslation("SystemAccentColor.Error1")
          });
          return;
        }
        if (themeObject.type == "custom_theme") {
          new Notification({
            title: "Warn",
            content: getTranslation("SystemAccentColor.Error2")
          });
        }
      } else {
        document.documentElement.style.setProperty(
          "--accentColor",
          themeObject.colors.accentColor
        );
        document.documentElement.style.setProperty(
          "--accentDarkColor",
          themeObject.colors.accentDarkColor
        );
        document.documentElement.style.setProperty(
          "--accentLightColor",
          themeObject.colors.accentLightColor
        );
        current_config["accentColorPreferences"] = "manual";
      }
    },
    toggleAnimations() {
      if (current_config.animationsPreferences == "activated") {
        const style = document.createElement("style");
        style.innerText = `*{-webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            transition: none !important;
            animation:0;}`;
        style.id = "_ANIMATIONS";
        document.documentElement.style.setProperty("--scalation", "1");
        document.documentElement.appendChild(style);
        current_config.animationsPreferences = "desactivated";
      } else {
        document.getElementById("_ANIMATIONS").remove();
        document.documentElement.style.setProperty("--scalation", "0.98");
        current_config.animationsPreferences = "activated";
      }
    },
    setZoom(_value) {
      if (_value >= 0 && _value <= 50) {
        current_config.appZoom = _value;
        webFrame.setZoomFactor(current_config.appZoom / 25);
        graviton.saveConfiguration();
      }
    },
    editorSearch() {
      if (editor != undefined) {
        CodeMirror.commands.find(editor);
      }
    },
    editorReplace() {
      if (editor != undefined) {
        CodeMirror.commands.replace(editor);
      }
    },
    editorJumpToLine() {
      if (editor != undefined) {
        CodeMirror.commands.jumpToLine(editor);
      }
    },
    restartApp() {
      remote.app.relaunch();
      remote.app.exit(0);
    },
    isProduction() {
      return (
        path.basename(sourceDir) !== "Graviton-Editor" &&
        path.basename(sourceDir) !== "Graviton-App"
      );
    },
    resizeTerminals() {
      const {FitAddon} = require("xterm-addon-fit");
      const fit = new FitAddon()
      if (terminal != (null || undefined)) {
        graviton.getTerminal().xterm.loadAddon(fit);
        fit.fit();
      }
    },
    toggleFullScreen() {
      if (graviton.isProduction()) {
        if (g_window.isFullScreen() === false) {
          g_window.setFullScreen(true);
        } else {
          g_window.setFullScreen(false);
        }
      }
    },
    toggleMenus() {
      if (menus_showing === true) {
        document.getElementById("dropmenus_app").style =
          "visibility:hidden; width:0;";
        menus_showing = false;
      } else {
        document.getElementById("dropmenus_app").style = "";
        menus_showing = true;
      }
    },
    getPlugin: function(plugin_name) {
      for (i = 0; i < marketCache.plugins.length; i++) {
        if (marketCache.plugins[i].package.name == plugin_name) {
          return {
            repo: marketCache.plugins[i],
            package: (function() {
              for (let a = 0; a < plugins_list.length; a++) {
                if (plugins_list[a].name == plugin_name) {
                  return plugins_list[a];
                }
              }
              for (let a = 0; a < marketCache.plugins.length; a++) {
                if (marketCache.plugins[a].package.name == plugin_name) {
                  return marketCache.plugins[a].package;
                }
              }
              return undefined;
            })(),
            isInstalled:(function(){
              for (let a = 0; a < plugins_list.length; a++) {
                if (plugins_list[a].name == plugin_name) {
                  return true
                }
              }
              return false
            })(),
            database: (function() {
              for (let a = 0; a < plugins_dbs.length; a++) {
                if (plugins_dbs[a].plugin_name == plugin_name) {
                  return plugins_dbs[a].db;
                }
              }
              return undefined;
            })()
          };
        }
      }
      for (let a = 0; a < plugins_list.length; a++) {
        if (plugins_list[a].name == plugin_name) {
          return {
            package: plugins_list[a],
            repo: undefined
          };
        }
      }
    },
    getTypePlugin(config) {
      if (config.icons != undefined) {
        return "custom_theme";
      }
      if (config.css != undefined) {
        return "custom_theme";
      }
      if (config.colors != undefined) {
        return "theme";
      }
      if (config.main != undefined) {
        return "plugin";
      }
    },
    windowContent(id, content) {
      document.getElementById(`${id}_body`).innerHTML = content;
    },
    toggleBounceEffect() {
      if (current_config.bouncePreferences == "activated") {
        current_config.bouncePreferences = "desactivated";
      } else {
        current_config.bouncePreferences = "activated";
      }
    },
    setTitle(title) {
      if (graviton.currentOS().codename != "linux") {
        document.getElementById("title_directory").children[0].innerText =
          title + " · Graviton";
      } else {
        g_window.setTitle(title + " · Graviton");
      }
    },
    consoleInfo(message) {
      console.log(`(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()})%c INFO::`, "color:#0066FF;", message);
    },
    consoleWarn(message) {
      console.log(`(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()})%c WARN::`, "color:#F6B149;", message);
    },
    focusScreen(screen_id) {
      for (i = 0; i < editor_screens.length; i++) {
        if (editor_screens[i].id == screen_id) {
          current_screen.id = screen_id;
          return true;
        }
      }
      return false;
    },
    getTerminal() {
      /**
       * @desc This is to avoid API issues whern there are breaking changes.
       */
      return terminal;
    },
    getUILanguage(){
      return current_config.language.name
    },
    getLanguage() {
      if (graviton.getCurrentFile().path == null) {
        return null;
      }
      return getLanguageName(
        getFormat(path.basename(graviton.getCurrentFile().path)).lang != "unknown"
          ? getFormat(path.basename(graviton.getCurrentFile().path)).lang
          : path
              .basename(graviton.getCurrentFile().path)
              .split(".")
              .pop()
      );
    },
    getCurrentTab() {
      return document.getElementById(editingTab);
    },
    getRandom: () => Math.floor(Math.random() * 400) + Math.floor(Math.random()),
    getScreens: () => editor_screens,
    getEnv: () => {
      return new Promise(resolve => {
        if(fs.existsSync(path.join(graviton.getCurrentDirectory(),"package.json"))){
          fs.readFile(path.join(graviton.getCurrentDirectory(),"package.json"),"UTF-8",(err,data)=>{
            const packageJSON = JSON.parse(data);
            resolve({
              path:graviton.getCurrentDirectory(),
              env:"node",
              scripts: packageJSON.scripts !== undefined? packageJSON.scripts : []
            })
          })
  
        }
      });
    },
    panels: [],
    notifications:[],
    toggleNPMPanel:function(){
      if(current_config.npm_panel){
        const npm_panel = graviton.panels.filter(panel => panel.panelObject.id === "npm_panel")[0]
        if(npm_panel!=undefined){
          npm_panel.close()
        }
      }else{
        const npm_panel = graviton.panels.filter(panel => panel.panelObject.id === "npm_panel")[0]
        if(npm_panel!=undefined){
          npm_panel.open()
        }
      }
      current_config.npm_panel = !current_config.npm_panel
    },
    refreshCustomization : function(){
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
    },
    updateAvailable(){
      return new_update;
    }
  };
  
  

  module.exports = graviton;
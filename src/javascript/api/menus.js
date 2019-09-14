/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
"use strict";

module.exports = {
  Menus: {
    loadDefaults: () => {
      const File = new dropMenu({
        id: "file",
        translation: true
      });
      const Tools = new dropMenu({
        id: "tools",
        translation: true
      });
      const Edit = new dropMenu({
        id: "edit",
        translation: true
      });
      const Editor = new dropMenu({
        id: "editor",
        translation: true
      });
      const WindowDM = new dropMenu({
        id: "window",
        translation: true
      });
      const Help = new dropMenu({
        id: "help",
        translation: true
      });

      File.setList({
        button: "File",
        list: {
          "Open Folder": () => openFolder(),
          "Open File": () => openFile(),
          "Save As": () => saveFileAs(),
          Save: {
            click: () => saveFile(),
            hint: "Ctrl+S"
          },
          "*line": "",
          "New Project": () => NewProject.open(),
          space1: "*line",
          Exit: {
            click: () => remote.app.exit(0),
            icon: "exit"
          }
        }
      });
      Edit.setList({
        button: "Edit",
        list: {
          Undo: {
            click: () => {
              if (editor != undefined) editor.execCommand("undo");
            },
            hint: "Ctrl+Z"
          },
          Redo: {
            click: () => {
              if (editor != undefined) editor.execCommand("redo");
            },
            hint: "Ctrl+Y"
          },
          "1a": "*line",
          Search: {
            click: () => graviton.editorSearch(),
            hint: "Ctrl+F"
          },
          Replace: {
            click: () => graviton.editorReplace(),
            hint: "Ctrl+Shit+R"
          },
          JumpToLine: {
            click: () => graviton.editorJumpToLine(),
            hint: "Alt+G"
          }
        }
      });
      Tools.setList({
        button: "Tools",
        list: {
          Market: () => {
            Market.open(err => Market.navigate("all", err));
          },
          ShowWelcome: () => Welcome.open(),
          "Zen Mode": {
            click: () => graviton.toggleZenMode(),
            hint: "Ctrl+E"
          },
          "2a": "*line",
          Settings: {
            click: () => {
              Settings.open();
              Settings.navigate("customization");
            },
            icon: "settings"
          }
        }
      });

      Editor.setList({
        button: "Editor",
        list: {
          DefaultView: () => screens.default(),
          SplitScreen: {
            click: () => screens.add(),
            icon: "split_screen",
            hint: "Ctrl+N"
          },
          RemoveScreen: {
            click: () => graviton.removeScreen(),
            icon: "remove_screen",
            hint: "Ctrl+L"
          },
          a2: "*line",
          openTerminal: {
            click: () => {
              if (terminal != null) {
                commanders.show(terminal.id);
                return;
              }
              commanders.terminal();
            },
            icon: "new_terminal",
            hint: "Ctrl+T"
          },
          hideTerminal: {
            click: () => commanders.hide(terminal.id),
            hint: "Ctrl+H"
          },
          closeTerminal: {
            click: () => commanders.closeTerminal(),
            icon: "close_terminal",
            hint: "Ctrl+U"
          }
        }
      });
      WindowDM.setList({
        button: "Window",
        list: {
          "Developer Tools": () => graviton.openDevTools(),
          "1a": "*line",
          HideMenus: {
            click: () => {
              graviton.toggleMenus();
              new Notification({
                title: getTranslation("Tip"),
                content: getTranslation("ToggleMenuTipMessage")
              });
            },
            hint: "Ctrl+Tab"
          },
          "2a": "*line",
          IncreaseZoom: {
            click: () => graviton.setZoom(parseInt(current_config.appZoom) + 3),
            icon: "plus"
          },
          DicreaseZoom: {
            click: () =>
              graviton.setZoom(parseInt(current_config.appZoom) + -3),
            icon: "minus"
          },
          DefaultZoom: {
            click: () => graviton.setZoom(25),
            icon: "default_zoom"
          },
          Fullscreen: {
            click: () => graviton.toggleFullScreen(),
            hint: "F11"
          }
        }
      });
      Help.setList({
        button: "Help",
        list: {
          "Issues": () =>
            shell.openExternal(
              "https://github.com/Graviton-Code-Editor/Graviton-App/issues"
            ),
          "Source Code": () =>
            shell.openExternal(
              "https://github.com/Graviton-Code-Editor/Graviton-App"
            ),
          "a1": "*line",
          "Telegram Channel": () =>
            shell.openExternal("https://t.me/gravitoneditor"),
          "Discord": () =>
            shell.openExternal("https://discord.gg/gg6CTYA"),
          "Twitter": () =>
            shell.openExternal("https://twitter.com/gravitoneditor"),
          "Donate": () => shell.openExternal("https://www.paypal.me/mkenzo8"),
          "FAQs": () => shell.openExternal("https://www.graviton.ml/faqs"),
          "Website": () => shell.openExternal("https://www.graviton.ml"),
          "a2": "*line",
          "Changelog": () => graviton.dialogChangelog(),
          "About": {
            click: () => graviton.dialogAbout(),
            icon: "info"
          }
        }
      });

      
    },
    trigger: id => {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].id != id) {
          dropdowns[i].classList.replace("show", "hide"); // Close the other menus
        } else {
          if (dropdowns[i].classList.contains("show")) {
            dropdowns[i].classList.replace("show", "hide"); // Hide the clicked menu
            anyDropON = null;
          } else {
            dropdowns[i].classList.replace("hide", "show"); // Show the clicked menu
            anyDropON = id;
          }
        }
      }
    }
  }
};

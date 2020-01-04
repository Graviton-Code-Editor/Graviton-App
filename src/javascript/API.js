/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
"use strict";

const _os = require("os");
const pty = require("node-pty");
const path = require("path");
const { saveFile, saveFileAs, openFolder, openFile } = require(path.join(__dirname,"src","javascript","api","utils","filesystem.js"))
let graviton = require(path.join(__dirname,"src","javascript","api","utils","graviton.js"))

let menus_showing = true;
let context_menu_list_text = {
  // Initial value
  Copy: () => {
    document.execCommand("copy");
  },
  Paste: () => {
    document.execCommand("paste");
  }
};

const context_menu_list_tabs = {
  Close: function() {
    closeTab(
      document.getElementById(this.getAttribute("target")).getAttribute("TabID")
    );
  }
};
const context_menu_list_file = {
  Remove: function() {
    directories.removeFileDialog(
      document.getElementById(
        document
          .getElementById(this.getAttribute("target"))
          .getAttribute("parent")
      )
    );
  },
  a1: "*line",
  CopyPath: function() {
    graviton.copyText(
      document
        .getElementById(this.getAttribute("target"))
        .getAttribute("dir")
        .replace(/\\\\/g, "\\")
    );
  }
};
const context_menu_resizer_options = {
  Hide: function() {
      const resizeElement = document.getElementById(this.getAttribute("target"))
      for(i=0; i< resizeElement.parentElement.children.length;i++){
        if(resizeElement.parentElement.children[i] == resizeElement){
          resizeElement.parentElement.children[i+1].style.display = "none";
          resizeElement.style = "padding-bottom:20px;";
        }
      }
  },
  Show: function() {
    const resizeElement = document.getElementById(this.getAttribute("target"))
    for(i=0; i< resizeElement.parentElement.children.length;i++){
      if(resizeElement.parentElement.children[i] == resizeElement){
        resizeElement.parentElement.children[i+1].style.display="block";
        resizeElement.style = "";
      }
    }
}
}
const context_menu_directory_options = {
  Reload: function() {
    Explorer.load(
      document.getElementById(this.getAttribute("target")).getAttribute("dir"),
      document
        .getElementById(this.getAttribute("target"))
        .getAttribute("parent"),
      document
        .getElementById(this.getAttribute("target"))
        .getAttribute("global")
    );
  },
  OpenInExplorer: function() {
    const { shell } = require("electron")
    shell.openItem(
      document
        .getElementById(
          document
            .getElementById(this.getAttribute("target"))
            .getAttribute("parent")
        )
        .getAttribute("dir")
    );
  },
  OpenAsGlobal: function() {
    Explorer.load(
      document
        .getElementById(this.getAttribute("target"))
        .getAttribute("dir")
        .replace(/\\\\/g, "\\"),
      "g_directories",
      true
    );
  },
  a1: "*line",
  NewFolder: function() {
    directories.newFolder(
      document
        .getElementById(this.getAttribute("target"))
        .getAttribute("parent")
    );
  },
  NewFile: function() {
    directories.newFile(
      document
        .getElementById(this.getAttribute("target"))
        .getAttribute("parent")
    );
  },
  a2: "*line",
  CopyPath: function() {
    graviton.copyText(
      document
        .getElementById(this.getAttribute("target"))
        .getAttribute("dir")
        .replace(/\\\\/g, "\\")
    );
  },
  a3: "*line",
  SendToTrash: function() {
    directories.removeFolderDialog(
      document.getElementById(
        document
          .getElementById(this.getAttribute("target"))
          .getAttribute("parent")
      )
    );
  }
};
class Plugin {
  constructor(object) {
    for (i = 0; i < plugins_list.length; i++) {
      if (plugins_list[i].name == object.name) {
        // List package information
        this.name = plugins_list[i].name;
        this.author = plugins_list[i].author;
        this.version = plugins_list[i].version;
        this.description = plugins_list[i].description;
      }
    }
    if (this.name == undefined) {
      console.warn(` Plugin by name > ${object.name} < doesn't exist `);
    }
  }
  saveData(data, callback) {
    plugins_dbs[this.index].db = data;
    fs.writeFileSync(
      path.join(plugins_db, this.name) + ".json",
      JSON.stringify(data),
      function(err) {}
    );
    if (!callback == undefined) return callback;
  }
  setData(key, data) {
    const name = this.name;
    if (fs.existsSync(path.join(plugins_db, name) + ".json")) {
      this.getData(function(object) {
        object[key] = data;
        fs.writeFileSync(
          path.join(plugins_db, name) + ".json",
          JSON.stringify(object),
          function(err) {
            plugins_dbs[this.index].db = object;
          }
        );
      });
    }
  }
  createData(data) {
    if (!fs.existsSync(path.join(plugins_db, this.name) + ".json")) {
      const db = {
        plugin_name: this.name,
        db: data
      };
      plugins_dbs.push(db);
      this.index = plugins_dbs.length - 1;
      fs.writeFileSync(
        path.join(plugins_db, this.name) + ".json",
        JSON.stringify(data),
        function(err) {}
      );
      return "created";
    }
    return "already_exists";
  }
  getData(callback) {
    const me = this;
    if (plugins_dbs[this.index] == undefined) {
      const name = this.name;
      fs.readFile(path.join(plugins_db, name + ".json"), "utf8", function(
        err,
        data
      ) {
        const object = {
          plugin_name: path.basename(name, ".json"),
          db: JSON.parse(data)
        };
        plugins_dbs.push(object);
        for (i = 0; i < plugins_dbs.length; i++) {
          if (plugins_dbs[i].plugin_name == name) {
            // List package information
            me.index = i;
          }
        }
        return typeof callback === "function"
          ? callback(plugins_dbs[me.index].db)
          : plugins_dbs[me.index].db;
      });
    } else {
      return typeof callback === "function"
        ? callback(plugins_dbs[me.index].db)
        : plugins_dbs[this.index].db;
    }
  }
  deleteData(data) {
    if (data == undefined) {
      plugins_dbs[this.index].db = {};
      fs.writeFileSync(
        path.join(plugins_db, this.name) + ".json",
        "{}",
        function(err) {}
      );
    } else {
      const object = this.getData();
      delete object[data];
      fs.writeFileSync(
        path.join(plugins_db, this.name) + ".json",
        JSON.stringify(object),
        function(err) {}
      );
      plugins_dbs[this.index].db = object;
    }
  }
}

function sleeping(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

function floatingWindow([xSize, ySize], content) {
  // Method to create flaoting windows
  const floatinGravitonWindow = document.createElement("div");
  floatinGravitonWindow.style.height = ySize + "px";
  floatinGravitonWindow.style.width = xSize + "px";
  floatinGravitonWindow.classList = "floatinGravitonWindow";
  floatinGravitonWindow.innerHTML = content;
  document.body.appendChild(floatinGravitonWindow);
}
document.addEventListener("mousedown", function(event) {
  if (editor_booted === true) {
    if (event.button === 2) {
      graviton.closeDropmenus(); // Close opened dropmenu
      if (document.getElementById("context_menu") !== null) {
        document.getElementById("context_menu").remove();
      }
      const context_menu = document.createElement("div");
      const line_space = document.createElement("span");
      line_space.classList = "line_space_menus";
      context_menu.setAttribute("id", "context_menu");
      context_menu.style = `left:${event.pageX + 1}px; top:${event.pageY +
        1}px`;
      switch (event.target.getAttribute("elementType")) {
        case "file":
          Object.keys(context_menu_list_file).forEach(function(key, index) {
            if (context_menu_list_file[key] != "*line") {
              const button = document.createElement("button");
              button.classList.add("part_of_context_menu");
              button.innerText = getTranslation(key);
              button.setAttribute("target", event.target.id);
              context_menu.appendChild(button);
              sleeping(1).then(() => {
                button.onclick = context_menu_list_file[key];
              });
            } else {
              const span = document.createElement("span");
              span.classList = "line_space_menus";
              context_menu.appendChild(span);
            }
          });
          break;
        case "tab":
          Object.keys(context_menu_list_tabs).forEach(function(key, index) {
            if (context_menu_list_tabs[key] != "*line") {
              const button = document.createElement("button");
              button.classList.add("part_of_context_menu");
              button.innerText = getTranslation(key);
              button.setAttribute("target", event.target.id);
              context_menu.appendChild(button);
              sleeping(1).then(() => {
                button.onclick = context_menu_list_tabs[key];
              });
            } else {
              const span = document.createElement("span");
              span.classList = "line_space_menus";
              context_menu.appendChild(span);
            }
          });
          break;
        case "directory":
          Object.keys(context_menu_directory_options).forEach(function(
            key,
            index
          ) {
            if (context_menu_directory_options[key] != "*line") {
              const button = document.createElement("button");
              button.classList.add("part_of_context_menu");
              button.innerText = getTranslation(key);
              button.setAttribute("target", event.target.id);

              sleeping(1).then(() => {
                button.addEventListener(
                  "click",
                  context_menu_directory_options[key]
                );
              });
              context_menu.appendChild(button);
            } else {
              const span = document.createElement("span");
              span.classList = "line_space_menus";
              context_menu.appendChild(span);
            }
          });
          break;
        case "panel_resizer":
            Object.keys(context_menu_resizer_options).forEach(function(
              key,
              index
            ) {
              if (context_menu_resizer_options[key] != "*line") {
                const button = document.createElement("button");
                button.classList.add("part_of_context_menu");
                button.innerText = getTranslation(key);
                button.setAttribute("target", event.target.id);

                sleeping(1).then(() => {
                  button.addEventListener(
                    "click",
                    context_menu_resizer_options[key]
                  );
                });
                context_menu.appendChild(button);
              } else {
                const span = document.createElement("span");
                span.classList = "line_space_menus";
                context_menu.appendChild(span);
              }
            });
          break;
        default:
          Object.keys(context_menu_list_text).forEach(function(key, index) {
            if (context_menu_list_text[key] != "*line") {
              const button = document.createElement("button");
              button.classList.add("part_of_context_menu");
              if (index < 2) {
                button.innerText = getTranslation(key);
                context_menu.appendChild(button);
              } else {
                if (index == 2) {
                  context_menu.appendChild(line_space);
                }
                button.innerText = key;
                context_menu.appendChild(button);
              }
              sleeping(1).then(() => {
                button.onclick = context_menu_list_text[key];
              });
            } else {
              const span = document.createElement("span");
              span.classList = "line_space_menus";
              context_menu.appendChild(span);
            }
          });
      }
      document.body.appendChild(context_menu);
    } else if (
      event.button === 0 &&
      !(
        event.target.matches("#context_menu") ||
        event.target.matches(".part_of_context_menu")
      ) &&
      document.getElementById("context_menu") !== null
    ) {
      document.getElementById("context_menu").remove();
    }
    if (!event.target.matches(".floatinGravitonWindow")) {
      if (document.getElementsByClassName("floatinGravitonWindow").length != 0) {
        for (
          i = 0;
          i < document.getElementsByClassName("floatinGravitonWindow").length;
          i++
        ) {
          document.getElementsByClassName("floatinGravitonWindow")[i].remove();
        }
      }
    }
    if (!event.target.matches(".commander_struct")) {
      graviton.closeCommander()
    }
  }
});

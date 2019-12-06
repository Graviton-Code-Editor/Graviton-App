/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

// Creating a tab, example:

/*

const my_tab = new Tab({
    id:'my_tab1',
    type:'free',
    name:'Hello World',
    data:'Initial content'
})

my_tab.setData('A new content') //Setting a new content

closeTab('my_tab1_freeTab') //Closing the tab by passing it's ID + '_freeTab'

loadTab(document.getElementById('my_tab1_freeTab')) //Load the tab by passing it's HTML element

*/

"use strict";

function Tab({ id = Math.random().toString(), type, name, path, data }) {
  /**
   * Tab constructor
   * @param {string} id    unique ID for the tab
   * @param {string} type  type of the tab (free,image,file)
   * @param {string} name  the tab's title
   * @param {string} data  the tab's content
   */
  this.type = type;
  this.id = id;
  this.path = path;
  switch (type) {
    case "file":
      for (i = 0; i < tabs.length + 1; i++) {
        if (i != tabs.length && tabs[i].getAttribute("longPath") === path) {
          loadTab(tabs[i]);
          return;
        } else if (i == tabs.length) {
          hideScreenDefaults(current_screen.id)
          const retrieveTab = require("../components/global/tab")
          filepath = path;
          switch (filepath.split(".").pop()) {
            case "woff2":
            case "ttf":
              const fontTab = retrieveTab({
                id: id,
                name: name,
                data: data,
                screen: current_screen.id,
                type:"font",
                longpath:path
              });
              puffin.render(fontTab,document.getElementById(current_screen.id).children[0])
              editingTab = fontTab.node.id;
              tabs.filter(loopedTab => {
                if( loopedTab.getAttribute("screen") == current_screen.id && loopedTab.classList.contains("selected")){
                  loopedTab.classList.remove("selected")
                }
              });
              tabs.push(fontTab.node)
              editingTab = fontTab.node.id;
              graviton.loadEditor(
                {
                  type: "font",
                  dir: filepath,
                  data: null,
                  screen: current_screen.id
                },
                function() {
                  document.dispatchEvent(graviton.events.tabCreated(fontTab.node)); //Throw tab created event
                  if ( document.getElementById(current_screen.id).children[0].children.length === 1) {
                    document.dispatchEvent(graviton.events.screenLoaded(current_screen.id))
                  }
                }
              );
              break;
            case "svg":
            case "png":
            case "ico":
            case "jpg":
              const imageTab = retrieveTab({
                id: id,
                name: name,
                data: data,
                screen: current_screen.id,
                type:"image",
                longpath:path
              });
              puffin.render(imageTab,document.getElementById(current_screen.id).children[0])
              editingTab = imageTab.node.id;
              tabs.filter(loopedTab => {
                if( loopedTab.getAttribute("screen") == current_screen.id && loopedTab.classList.contains("selected")){
                  loopedTab.classList.remove("selected")
                }
              });
              tabs.push(imageTab.node)
              graviton.loadEditor(
                {
                  type: "image",
                  dir: filepath,
                  data: null,
                  screen: current_screen.id
                },
                function() {
                  document.dispatchEvent(graviton.events.tabCreated(imageTab.node)); //Throw tab created event
                  if (document.getElementById(current_screen.id).children[0].children.length === 1) {
                    document.dispatchEvent(graviton.events.screenLoaded(current_screen.id))
                  }
                }
              );
              break;
            default:
              (async () => {
                const data = await fs.readFile(path, "utf-8");
                const textTab = retrieveTab({
                  id: id,
                  name: name,
                  data: data,
                  screen: current_screen.id,
                  type:"text",
                  longpath:path
                });
                puffin.render(textTab,document.getElementById(current_screen.id).children[0])
                tabs.filter(loopedTab => {
                  if( loopedTab.getAttribute("screen") == current_screen.id && loopedTab.classList.contains("selected")){
                    loopedTab.classList.remove("selected")
                  }
                });
                tabs.push(textTab.node)
                editingTab = textTab.node.id;
                graviton.loadEditor(
                  {
                    type: "text",
                    dir: filepath,
                    data: data,
                    screen: current_screen.id
                  },
                  function() {
                    document.dispatchEvent(graviton.events.tabCreated(textTab.node)); //Throw tab created event
                    if (document.getElementById(current_screen.id).children[0].children.length === 1) {
                      document.dispatchEvent(graviton.events.screenLoaded(current_screen.id))
                    }
                  }
                );
              editor.refresh();
            })();
          }
          return;
        }
      }
      break;
    case "custom":
    case "free":
      hideScreenDefaults(current_screen.id)
      const retrieveTab = require("../components/global/tab")
      const customTab = retrieveTab({
        id: id,
        name: name,
        data: data,
        screen: current_screen.id,
        type:"free"
      });
      tabs.filter(loopedTab => {
          if( loopedTab.getAttribute("screen") == current_screen.id && loopedTab.classList.contains("selected")){
            loopedTab.classList.remove("selected")
          }
      });
      tabs.push(customTab.node);
      puffin.render(customTab,document.getElementById(current_screen.id).children[0])
      editingTab = customTab.node.id;
      graviton.loadEditor(
        {
          type: "free",
          dir: id,
          data: data,
          screen: current_screen.id
        },
        function() {
          filepath = null;
          document.dispatchEvent(graviton.events.tabCreated(customTab.node)); //Throw tab created event
          if ( document.getElementById(current_screen.id).children[0].children .length === 1 ) {
            document.dispatchEvent(graviton.events.screenLoaded(current_screen.id))
          }
        }
      );
      break;
  }
  this.setData = function(data) {
    if (this.type == "free") {
      document.getElementById(this.id + "_editor").innerHTML = data;
    }
  };
}
function closeTab(tab_id, fromWarn) {
  const working_tab = document.getElementById(tab_id);
  const tab_screen = working_tab.getAttribute("screen");
  if (working_tab.getAttribute("file_status") == "saved" || fromWarn) {
    for (i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      let new_selected_tab;
      if (tab.id == tab_id && tab.getAttribute("screen") == working_tab.getAttribute("screen")) {
        tabs.splice(i, 1);
        document.getElementById(working_tab.getAttribute("longPath").replace(/\\/g, "") +"_editor").remove();
        editors.splice(i, 1);
        let filtered_tabs = tabs.filter(c_tab => {
          return (
            c_tab.getAttribute("screen") == working_tab.getAttribute("screen")
          );
        });
        if (filtered_tabs.length == 0) {
          // Any tab opened
          filepath = null;
          plang = "";
          editor = null;
          showScreenDefaults(working_tab.getAttribute("screen"))
          const opened_tabs = Array.prototype.slice
            .call(document.getElementsByClassName("selected"))
            .filter(tab => tab.getAttribute("elementType") == "tab");
          const screen_index = editor_screens.filter(screen => {
            screen.id == tab_screen;
          })[0];
          if (screen_index == editor_screens.length) {
            new_selected_tab = opened_tabs.filter(tab => {
              tab.getAttribute("screen") == editor_screens[screen_index - 1];
            });
          } else if (editor_screens.length < screen_index) {
            new_selected_tab = opened_tabs.filter(tab => {
              tab.getAttribute("screen") == editor_screens[screen_index + 1];
            });
          }
        } else if (i === filtered_tabs.length) {
          if (
            filtered_tabs
              .filter(
                tab => filtered_tabs[Number(filtered_tabs.length) - 1]
              )[0]
              .getAttribute("screen") == working_tab.getAttribute("screen")
          ) {
            new_selected_tab =
              filtered_tabs[Number(filtered_tabs.length) - 1];
          }
        } else {
          new_selected_tab = filtered_tabs.filter(function(tab) {
            return (
              tab.getAttribute("screen") == working_tab.getAttribute("screen")
            );
          })[Number(filtered_tabs.length) - 1];
        }
        if (new_selected_tab != undefined) {
          tabs.filter(loopedTab => {
            if( loopedTab.getAttribute("screen") == current_screen.id && loopedTab.classList.contains("selected")){
              loopedTab.classList.remove("selected")
            }
          });
          editingTab = new_selected_tab.id;
          new_selected_tab.classList.add("selected");
          filepath = new_selected_tab.getAttribute("longpath");
          graviton.loadEditor({
            type: new_selected_tab.getAttribute("typeeditor"),
            dir: filepath,
            data: new_selected_tab.getAttribute("data"),
            screen: new_selected_tab.getAttribute("screen")
          });
        }
        document.dispatchEvent(graviton.events.tabClosed(working_tab))
        working_tab.remove();
      }
    }
  } else {
    graviton.closingFileWarn(working_tab.children[1]);
  }
}
function loadTab(incomingTab) {
  const tabsScreen = incomingTab.getAttribute("screen");
  if (incomingTab.id != editingTab && incomingTab.children[1].getAttribute("hovering") == "false") {
    tabs.filter(loopedTab => {
      if( loopedTab.getAttribute("screen") == incomingTab.getAttribute("screen") && loopedTab.classList.contains("selected")){
        loopedTab.classList.remove("selected")
      }
    });
    incomingTab.classList.add("selected");
    filepath = incomingTab.getAttribute("longpath");
    graviton.loadEditor({
      type: incomingTab.getAttribute("typeeditor"),
      dir: filepath,
      data: incomingTab.getAttribute("data"),
      screen: incomingTab.getAttribute("screen")
    });
    editingTab = incomingTab.id;
    document.dispatchEvent(graviton.events.tabLoaded(incomingTab))
  }
}

document.ondrag = function(event) {
  event.preventDefault();
};

document.ondrop = function(event) {
  event.preventDefault();
  if (event.target.classList.contains("tab_part")) {
    const id = event.dataTransfer.getData("id");
    const todrag = document.getElementById(event.target.getAttribute("TabID"));
    const dragging = document.getElementById(id);
    if (todrag.getAttribute("screen") != dragging.getAttribute("screen")) {
      /* Prevent dropping on different screens */
      return;
    }
    const from = (function() {
      for (i = 0; i < todrag.parentElement.children.length; i++) {
        if (todrag.parentElement.children[i].id == dragging.id) {
          return i;
        }
      }
    })();
    const to = (function() {
      for (i = 0; i < todrag.parentElement.children.length; i++) {
        if (todrag.parentElement.children[i].id == todrag.id) {
          return i;
        }
      }
    })();
    if (from > to) {
      document
        .getElementById(event.target.getAttribute("TabID"))
        .parentElement.insertBefore(
          document.getElementById(id),
          document.getElementById(event.target.getAttribute("TabID"))
        );
    } else {
      if (to + 1 == dragging.parentElement.children.length) {
        dragging.parentElement.appendChild(document.getElementById(id));
      } else {
        dragging.parentElement.insertBefore(
          document.getElementById(id),
          dragging.parentElement.children[to + 1]
        );
      }
    }
    document.dispatchEvent(graviton.events.tabReorganized({
      screen: todrag.getAttribute("screen"),
      from_tab: dragging,
      to_tab: todrag
    }));
  }
};

document.ondragover = function(event) {
  event.preventDefault();
};

function hideScreenDefaults(screenId){
  document.getElementById(screenId).children[1].children[0].style = "visibility:hidden; display:none;"; //Hide default text
}

function showScreenDefaults(screenId){
  document.getElementById(screenId).children[1].children[0].style ="visibility:visible; display:block;"; //Make visible default text
  document.getElementById(screenId).children[2].innerHTML = ""; //Hide status bar content
}

module.exports = { Tab, loadTab, closeTab }
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

module.exports = {
  /**
   * Tab constructor
   * @param {string} id    unique ID for the tab
   * @param {string} type  type of the tab (free,image,file)
   * @param {string} name  the tab's title
   * @param {string} data  the tab's content
   */
  Tab: function({ id = Math.random().toString(), type, name, path, data }) {
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
            // Tab is created because it doesn't exist
            document.getElementById(
              current_screen.id
            ).children[1].children[0].style =
              "visibility:hidden; display:none;";
            const { puffin } = require("@mkenzo_8/puffin")
            const retrieveTab = require("../../components/tab")
            const tab = retrieveTab({
              id: id,
              name: name,
              data: data,
              screen: current_screen.id,
              type:"free",
              longpath:path
            });
            puffin.render(tab,document
              .getElementById(current_screen.id)
              .children[0])
            tabs.push(tab.node)
            filepath = path;
            editingTab = tab.node.id;
            switch (filepath.split(".").pop()) {
              case "woff2":
              case "ttf":
                for (i = 0; i < tabs.length; i++) {
                  if (
                    tabs[i].getAttribute("screen") == current_screen.id &&
                    tabs[i].classList.contains("selected")
                  ) {
                    tabs[i].classList.remove("selected");
                  }
                }
                tab.node.classList.add("selected");
                tab.node.setAttribute("typeEditor", "font");
                editingTab = tab.node.id;
                graviton.loadEditor(
                  {
                    type: "font",
                    dir: filepath,
                    data: null,
                    screen: current_screen.id
                  },
                  function() {
                    const tab_created_event = new CustomEvent("tab_created", {
                      detail: {
                        tab: tab.node
                      }
                    });
                    document.dispatchEvent(tab_created_event);
                    if (
                      document.getElementById(current_screen.id).children[0]
                        .children.length === 1
                    ) {
                      const screen_loaded_event = new CustomEvent(
                        "screen_loaded",
                        {
                          detail: {
                            tab: tab.node,
                            screen: current_screen.id
                          }
                        }
                      );
                      document.dispatchEvent(screen_loaded_event);
                    }
                  }
                );
                break;
              case "svg":
              case "png":
              case "ico":
              case "jpg":
                for (i = 0; i < tabs.length; i++) {
                  if (
                    tabs[i].getAttribute("screen") == current_screen.id &&
                    tabs[i].classList.contains("selected")
                  ) {
                    tabs[i].classList.remove("selected");
                  }
                }
                tab.node.classList.add("selected");
                editingTab = tab.node.id;
                tab.node.setAttribute("typeEditor", "image");
                graviton.loadEditor(
                  {
                    type: "image",
                    dir: filepath,
                    data: null,
                    screen: current_screen.id
                  },
                  function() {
                    const tab_created_event = new CustomEvent("tab_created", {
                      detail: {
                        tab: tab.node
                      }
                    });
                    document.dispatchEvent(tab_created_event);
                    if (
                      document.getElementById(current_screen.id).children[0]
                        .children.length === 1
                    ) {
                      const screen_loaded_event = new CustomEvent(
                        "screen_loaded",
                        {
                          detail: {
                            tab: tab.node,
                            screen: current_screen.id
                          }
                        }
                      );
                      document.dispatchEvent(screen_loaded_event);
                    }
                  }
                );
                break;
              default:
                (async () => {
                  const data = await fs.readFile(tab.node.getAttribute("longpath"), "utf-8");
                  tab.node.setAttribute("data", data);
                  tabs.forEach(tab => {
                    if (
                      tab.getAttribute("screen") == current_screen.id &&
                      tab.classList.contains("selected")
                    ) {
                      tab.classList.remove("selected");
                    }
                  });
                  tab.node.classList.add("selected");
                  editingTab = tab.node.id;
                  tab.node.setAttribute("typeEditor", "text");
                  graviton.loadEditor(
                    {
                      type: "text",
                      dir: filepath,
                      data: data,
                      screen: current_screen.id
                    },
                    function() {
                      const tab_created_event = new CustomEvent("tab_created", {
                        detail: {
                          tab: tab.node
                        }
                      });
                      document.dispatchEvent(tab_created_event);
                      if (
                        document.getElementById(current_screen.id).children[0]
                          .children.length === 1
                      ) {
                        const screen_loaded_event = new CustomEvent(
                          "screen_loaded",
                          {
                            detail: {
                              tab: tab.node,
                              screen: current_screen.id
                            }
                          }
                        );
                        document.dispatchEvent(screen_loaded_event);
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
        for (i = 0; i < tabs.length; i++) {
          if (
            tabs[i].getAttribute("screen") == current_screen.id &&
            tabs[i].classList.contains("selected")
          ) {
            tabs[i].classList.remove("selected");
          }
        }
        document.getElementById(
          current_screen.id
        ).children[1].children[0].style = "visibility:hidden; display:none;";
        const { puffin } = require("@mkenzo_8/puffin")
        const retrieveTab = require("../../components/tab")
        const tab = retrieveTab({
          id: id,
          name: name,
          data: data,
          screen: current_screen.id,
          type:"free"
        });
        puffin.render(tab,document.getElementById(current_screen.id).children[0])
        tabs.push(tab.node);
        graviton.loadEditor(
          {
            type: "free",
            dir: id,
            data: data,
            screen: current_screen.id
          },
          function() {
            filepath = null;
            editingTab = tab.node.id;
            const tab_created_event = new CustomEvent("tab_created", {
              detail: {
                tab: tab.node
              }
            });
            document.dispatchEvent(tab_created_event);
            if (
              document.getElementById(current_screen.id).children[0].children
                .length === 1
            ) {
              const screen_loaded_event = new CustomEvent("screen_loaded", {
                detail: {
                  tab: tab.node,
                  screen: current_screen.id
                }
              });
              document.dispatchEvent(screen_loaded_event);
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
  },
  closeTab: function(tab_id, fromWarn) {
    const working_tab = document.getElementById(tab_id);
    const tab_screen = working_tab.getAttribute("screen");
    if (working_tab.getAttribute("file_status") == "saved" || fromWarn) {
      for (i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        let new_selected_tab;
        if (
          tab.id == tab_id &&
          tab.getAttribute("screen") == working_tab.getAttribute("screen")
        ) {
          tabs.splice(i, 1);
          document
            .getElementById(
              working_tab.getAttribute("longPath").replace(/\\/g, "") +
                "_editor"
            )
            .remove();
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
            document.getElementById(
              working_tab.getAttribute("screen")
            ).children[1].children[0].style =
              "visibility:visible; display:block;";
            document.getElementById(
              working_tab.getAttribute("screen")
            ).children[2].innerHTML = "";
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
            for (i = 0; i < tabs.length; i++) {
              if (
                tabs[i].classList.contains("selected") &&
                tabs[i].getAttribute("screen") ==
                  working_tab.getAttribute("screen")
              ) {
                tabs[i].classList.remove("selected");
              }
            }
            editingTab = new_selected_tab.id;
            new_selected_tab.classList.add("selected");
            const newTabPath = new_selected_tab.getAttribute("longpath");
            filepath = newTabPath;
            graviton.loadEditor({
              type: new_selected_tab.getAttribute("typeeditor"),
              dir: newTabPath,
              data: new_selected_tab.getAttribute("data"),
              screen: new_selected_tab.getAttribute("screen")
            });
          }
          const tab_closed_event = new CustomEvent("tab_closed", {
            detail: {
              tab: working_tab,
              screen: working_tab.getAttribute("screen")
            }
          });
          document.dispatchEvent(tab_closed_event);
          working_tab.remove();
        }
      }
    } else {
      graviton.closingFileWarn(working_tab.children[1]);
    }
  },
  loadTab: function(object) {
    const object_screen = object.getAttribute("screen");
    if (
      object.id != editingTab &&
      object.children[1].getAttribute("hovering") == "false"
    ) {
      tabs.forEach(tab => {
        if (
          tab.classList.contains("selected") &&
          tab.getAttribute("screen") == object_screen
        ) {
          tab.classList.remove("selected");
        }
      })
      object.classList.add("selected");
      const newTabPath = object.getAttribute("longpath");
      filepath = newTabPath;
      graviton.loadEditor({
        type: object.getAttribute("typeeditor"),
        dir: newTabPath,
        data: object.getAttribute("data"),
        screen: object.getAttribute("screen")
      });
      editingTab = object.id;
      const tab_loaded_event = new CustomEvent("tab_loaded", {
        detail: {
          tab: object,
          screen: object.getAttribute("screen")
        }
      });
      document.dispatchEvent(tab_loaded_event);
    }
  }
};

document.ondrag = function(event) {
  event.preventDefault();
};

document.ondrop = function(event) {
  event.preventDefault();
  mouseClicked = false;
  if (event.target.classList.contains("tab_part")) {
    const id = event.dataTransfer.getData("id");
    const todrag = document.getElementById(event.target.getAttribute("TabID"));
    const dragging = document.getElementById(id);
    if (todrag.getAttribute("screen") != dragging.getAttribute("screen")) {
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
    const tab_reorganized_event = new CustomEvent("tab_reorganized", {
      data: {
        screen: todrag.getAttribute("screen"),
        from_tab: dragging,
        to_tab: todrag
      }
    });
    document.dispatchEvent(tab_reorganized_event);
  }
};
document.ondragover = function(event) {
  event.preventDefault();
};

module.exports = {
  loadEditor: ({ dir, type, data, screen },callback) => {
    if (
      document.getElementById(dir.replace(/\\/g, "") + "_editor") == undefined
    ) {
      switch (type) {
        case "text":
          const text_container = document.createElement("div");
          text_container.classList = "code-space";
          text_container.setAttribute("id", dir.replace(/\\/g, "") + "_editor");
          text_container.setAttribute("path", dir);
          document
            .getElementById(screen)
            .children[1].appendChild(text_container);
          let codemirror = CodeMirror(
            document.getElementById(text_container.id),
            {
              value: data,
              mode: "text/plain",
              htmlMode: false,
              theme:
                themeObject["highlight"] != undefined
                  ? themeObject["highlight"]
                  : "default",
              lineNumbers: true,
              autoCloseTags: true,
              indentUnit: 2,
              id: dir,
              screen: screen,
              styleActiveLine: { nonEmpty: true },
              gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
              lineWrapping:
                current_config["lineWrappingPreferences"] == "activated",
              autoCloseBrackets: true,
              matchBrackets: true,
              matchTags: { bothTags: true },
              styleActiveLine: { nonEmpty: true },
              styleActiveSelected: true
            }
          );
          codemirror.focus();
          const new_editor_text = {
            object: text_container,
            id: text_container.id,
            editor: codemirror,
            path: dir,
            screen: screen,
            type: type
          };
          text_container.focus();
          elasticContainer.append(
            text_container.children[0].children[
              Number(text_container.children[0].children.length - 1)
            ]
          );
          editors.push(new_editor_text);
          if (g_highlighting == "activated") updateCodeMode(codemirror, dir);
          for (i = 0; i < editors.length; i++) {
            if (
              editors[i].screen == screen &&
              document.getElementById(editors[i].id) != null
            ) {
              document.getElementById(editors[i].id).style.display = "none";
            }
          }
          text_container.addEventListener("wheel", function(e) {
            if (e.ctrlKey) {
              if (e.deltaY < 0) {
                graviton.setEditorFontSize(
                  `${Number(current_config.fontSizeEditor) + 1}`
                );
              } else if (e.deltaY > 0) {
                graviton.setEditorFontSize(
                  `${Number(current_config.fontSizeEditor) - 1}`
                );
              }
            }
          });
          editorID = new_editor_text.id;
          editor = new_editor_text.editor;
          text_container.style.display = "block";
          codemirror.on("cursorActivity", function(a) {
            for (i = 0; i < editors.length; i++) {
              if (
                editors[i].id ===
                a.options.id.replace(/[\\\s]/g, "") + "_editor"
              ) {
                editor = editors[i].editor;
                editorID = editors[i].id;
                for (let b = 0; b < tabs.length; b++) {
                  if (
                    tabs[b].getAttribute("screen") == editors[i].screen &&
                    tabs[b].classList.contains("selected")
                  ) {
                    editingTab = tabs[b].id;
                    filepath = tabs[b].getAttribute("longpath");
                  }
                }
              }
            }
            graviton.closeDropmenus();
            graviton.focusScreen(a.options.screen);
          });
          graviton.focusScreen(screen);
          break;
        case "font":
          editor = undefined;
          const font_container = document.createElement("div");
          font_container.classList = "code-space";
          font_container.setAttribute("id", `${dir.replace(/\\/g, "")}_editor`);
          const random_id = Math.random();
          font_container.innerHTML = graviton.getTemplate(
            "editor_font_previewer",
            `
               const info = ${JSON.stringify({ dir, type, data, screen })};
            `
          );
          document
            .getElementById(screen)
            .children[1].appendChild(font_container);
          const new_editor_font = {
            object: font_container,
            id: dir.replace(/\\/g, "") + "_editor",
            editor: undefined,
            path: dir,
            screen: screen,
            type: "font"
          };
          for (i = 0; i < editors.length; i++) {
            if (
              editors[i].screen == screen &&
              document.getElementById(editors[i].id) != null
            ) {
              document.getElementById(editors[i].id).style.display = "none";
            }
          }
          editors.push(new_editor_font);
          document.getElementById(
            dir.replace(/\\/g, "") + "_editor"
          ).style.display = "block";
          editorID = new_editor_font.id;
          graviton.focusScreen(screen);
          break;
        case "image":
          editor = undefined;
          const image_container = document.createElement("div");
          image_container.classList = "code-space";
          image_container.setAttribute(
            "id",
            `${dir.replace(/\\/g, "")}_editor`
          );
          image_container.innerHTML = `<img src="${dir}">`;
          document
            .getElementById(screen)
            .children[1].appendChild(image_container);
          const new_editor_image = {
            object: image_container,
            id: dir.replace(/\\/g, "") + "_editor",
            editor: undefined,
            path: dir,
            screen: screen,
            type: "image"
          };
          for (i = 0; i < editors.length; i++) {
            if (
              editors[i].screen == screen &&
              document.getElementById(editors[i].id) != null
            ) {
              document.getElementById(editors[i].id).style.display = "none";
            }
          }
          editors.push(new_editor_image);
          document.getElementById(
            dir.replace(/\\/g, "") + "_editor"
          ).style.display = "block";
          editorID = new_editor_image.id;
          graviton.focusScreen(screen);
          break;
        case "free":
          editor = undefined;
          const free_id = "free_tab" + Math.random();
          const free_container = document.createElement("div");
          free_container.classList = "code-space";
          free_container.setAttribute("id", `${dir.replace(/\\/g, "")}_editor`);
          free_container.innerHTML = data != undefined ? data : "";
          document
            .getElementById(screen)
            .children[1].appendChild(free_container);
          const new_editor_free = {
            object: free_container,
            id: dir.replace(/\\/g, "") + "_editor",
            editor: null,
            path: null,
            screen: screen,
            type: "free"
          };
          for (i = 0; i < editors.length; i++) {
            if (
              editors[i].screen == screen &&
              document.getElementById(editors[i].id) != null
            ) {
              document.getElementById(editors[i].id).style.display = "none";
            }
          }
          editors.push(new_editor_free);
          document.getElementById(
            dir.replace(/\\/g, "") + "_editor"
          ).style.display = "block";
          editorID = new_editor_free.id;
          graviton.focusScreen(screen);
          break;
      }
      if(callback!=undefined) callback();
    } else {
      for (i = 0; i < editors.length; i++) {
        if (
          editors[i].screen == screen &&
          document.getElementById(editors[i].id) != null
        ) {
          document.getElementById(editors[i].id).style.display = "none";
        }
        if (editors[i].id == dir.replace(/\\/g, "") + "_editor") {
          if (editors[i].editor != undefined) {
            // Editors
            editor = editors[i].editor;
          } else {
            editor = undefined;
            
          }
          editorID = editors[i].id;
          document.getElementById(editorID).style.display = "block";
          if (editor != undefined) editor.refresh();
        }
        if(callback!=undefined) callback(editor);
      }
    }

    function filterIt(arr, searchKey, cb) {
      var list = [];
      for (var i = 0; i < arr.length; i++) {
        var curr = arr[i];
        Object.keys(curr).some(function(key) {
          if (typeof curr[key] === "string" && curr[key].includes(searchKey)) {
            list.push(curr);
          }
        });
      }
      return cb(list);
    }
    if (editor != undefined) {
      editor.on("change", function() {
        const close_icon = document.getElementById(editingTab);
        close_icon.setAttribute("file_status", "unsaved");
        close_icon.children[1].innerHTML = icons["unsaved"];
        document
          .getElementById(editingTab)
          .setAttribute("data", editor.getValue());
        if (current_config["autoCompletionPreferences"] == "activated") {
          elasticContainer.append(document.getElementById("context"));
          const cursorPos = editor.cursorCoords();
          const A1 = editor.getCursor().line;
          const A2 = editor.getCursor().ch;
          const B1 = editor.findWordAt({
            line: A1,
            ch: A2
          }).anchor.ch;
          const B2 = editor.findWordAt({
            line: A1,
            ch: A2
          }).head.ch;
          const lastWord = editor.getRange(
            {
              line: A1,
              ch: B1
            },
            {
              line: A1,
              ch: B2
            }
          );
          const context = document.getElementById("context");
          if (context.style.display == "block") return;
          const selectedLangNum = (function() {
            for (i = 0; i < dictionary.length; i++) {
              if (
                dictionary[i].name ==
                path
                  .basename(graviton.getCurrentFile().path)
                  .split(".")
                  .pop()
              ) {
                return i;
              }
            }
          })();
          if (selectedLangNum == undefined) return;
          let dic = dictionary[selectedLangNum].list;
          const vars = checkVariables(
            editor
              .getValue()
              .replace(/(\r\n|\n|\r)/gm, " ")
              .split(
                /\s|(\()([\w\s!?="`[<>,\/*':&.;_-{}]+)(\))|\s|(\<)([\w\s!?="`[,\/*()':&.;_-{}]+)(\>)|\s|(\()([\w\s!?="<>`[,'+:&.;_-{}]+)(\))\s|(\B\$)(\w+)|\s(\/\*)([\w\s!?()="<>`[':.;_-{}]+)(\*\/)|("[\w\s!?():=`.;_-{}]+")\s|(%%)([\w\s!?()="+<>`[\/'*,.;_-{}]+)(%%)|("[\w\s!?()='.`;_-{}]+")/g
              )
              .filter(Boolean)
          );
          dic = dic.concat(vars);
          filterIt(dic, lastWord, function(filterResult) {
            if (filterResult.length > 0 && lastWord.length >= 3) {
              let contextOptions;
              for (var i = 0; i < filterResult.length; i++) {
                const id = Math.random();
                contextOptions += `<button id=${id} class=option >
                      ${filterResult[i]._name}
                      </button>`;
                contextOptions = contextOptions.replace("undefined", "");
                context.innerHTML = contextOptions;
                sleeping(1).then(() => {
                  if (document.getElementById(id) == null) return;
                  document.getElementById(id).onclick = function() {
                    const A1 = editor.getCursor().line;
                    const A2 = editor.getCursor().ch;
                    const B1 = editor.findWordAt({
                      line: A1,
                      ch: A2
                    }).anchor.ch;
                    const B2 = editor.findWordAt({
                      line: A1,
                      ch: A2
                    }).head.ch;
                    const selected = this.innerText;
                    editor.replaceRange(
                      selected,
                      {
                        line: A1,
                        ch: B1
                      },
                      {
                        line: A1,
                        ch: B2
                      }
                    );
                    context.parentElement.style.display = "none";
                    context.innerHTML = "";
                  };
                });
              }
              context.parentElement.style = `top:${cursorPos.top +
                30}px; left:${cursorPos.left}px; display:block;`;
              if (cursorPos.top < window.innerHeight / 2) {
              } //Cursor is above the mid height
              context.children[0].classList.add("hover");
            } else if (filterResult.length === 0 || lastWord.length < 3) {
              context.parentElement.style.display = "none";
              context.innerHTML = "";
            }
          });
        }
      });
      editor.on("keydown", function(editor, e) {
        if (
          document.getElementById("context").parentElement.style.display !=
          "none"
        ) {
          editor.setOption("extraKeys", {
            Up: function() {
              return CodeMirror.PASS;
            },
            Down: function() {
              return CodeMirror.PASS;
            },
            Enter: function() {
              return CodeMirror.PASS;
            },
            Tab: function() {
              return CodeMirror.PASS;
            }
          });
        } else {
          editor.setOption("extraKeys", {
            Up: "goLineUp",
            Down: "goLineDown"
          });
        }
        const context = document.getElementById("context");
        const childs = context.querySelectorAll(".option");
        for (i = 0; i < childs.length; i++) {
          if (childs[i].classList.contains("hover")) {
            if (
              e.keyCode === 40 &&
              i != childs.length - 1 &&
              context.style.display != "none"
            ) {
              //DOWN
              childs[i].classList.remove("hover");
              childs[i + 1].classList.add("hover");
              context.scrollBy(0, 30);
              return false;
            } else if (
              e.keyCode === 38 &&
              i != 0 &&
              context.style.display != "none"
            ) {
              //UP
              childs[i].classList.remove("hover");
              childs[i - 1].classList.add("hover");
              context.scrollBy(0, -30);
              return false;
            }
            if (e.keyCode === 9 || e.keyCode === 13) {
              //9 = Tab & 13 = Enter
              const A1 = editor.getCursor().line;
              const A2 = editor.getCursor().ch;
              const B1 = editor.findWordAt({
                line: A1,
                ch: A2
              }).anchor.ch;
              const B2 = editor.findWordAt({
                line: A1,
                ch: A2
              }).head.ch;
              const selected = (function() {
                for (i = 0; i < childs.length; i++) {
                  if (childs[i].classList.contains("hover")) {
                    return childs[i].innerText;
                  }
                }
              })();
              editor.replaceRange(
                selected,
                {
                  line: A1,
                  ch: B1
                },
                {
                  line: A1,
                  ch: B2
                }
              );
              context.innerHTML = "";
              setTimeout(function() {
                context.parentElement.style.display = "none";
                context.innerHTML = "";
              }, 1);
            }
          }
        }
      });
      editor.addKeyMap({
        "Ctrl-S": function(cm) {
          saveFile();
        },
        "Ctrl-N": function(cm) {
          screens.add();
        },
        "Ctrl-L": function(cm) {
          screens.remove(current_screen.id);
        },
        "Ctrl-E": function(cm) {
          graviton.toggleZenMode();
        },
        "Ctrl-T": function(cm) {
          if (terminal != null) {
            commanders.show(terminal.id);
            return;
          }
          commanders.terminal();
        },
        "Ctrl-U": function(cm) {
          commanders.closeTerminal();
        },
        "Ctrl-H": function(cm) {
          if (terminal != null) {
            commanders.hide(terminal.id);
          }
        },
        'F11': function(cm) {
          !g_window.isFullScreen()
            ? g_window.setFullScreen(true)
            : g_window.setFullScreen(false);
        },
        "Ctrl-Tab": function(cm) {
          graviton.toggleMenus();
        },
        "Ctrl-Up": function(cm) {
          graviton.setEditorFontSize(
            `${Number(current_config.fontSizeEditor) + 2}`
          );
        },
        "Ctrl-Down": function(cm) {
          graviton.setEditorFontSize(
            `${Number(current_config.fontSizeEditor) - 2}`
          );
        }
      });
    }
  }
};

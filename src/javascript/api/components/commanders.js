
module.exports = {
    commander : class  {
    constructor(object, callback) {
      if (document.getElementById(current_screen.id).children[3] != undefined) {
        return callback(true);
      }
      this.id = object.id + "_commander";
      this.content = object.content;
      const commanderObj = document.createElement("div");
      commanderObj.id = this.id;
      commanderObj.classList = "commander";
      commanderObj.innerHTML = object.content;
      document.getElementById(current_screen.id).appendChild(commanderObj);
      return callback(false);
    }
    close() {
      document.getElementById(this.id).remove();
    }
    hide() {
      document.getElementById(this.id).style.display = "none";
    }
    show() {
      document.getElementById(this.id).style = "";
    }
  },
  commanders:  {
    terminal: function (object) {
      if (graviton.getCurrentDirectory() == null && object == undefined) {
        graviton.throwError(
          getTranslation("CannotRunTerminalCauseDirectory")
        );
        return;
      }
      if (current_screen.terminal != undefined) {
        if (document.getElementById(current_screen.terminal.id + '_commander').style.display == "none") {
          commanders.show(current_screen.terminal.id);
        }
        return;
      }
      const randomID = Math.random();
      new commander({
          id: "xterm" + randomID,
          content: ""
        },
        function (err) {
          if (!err) {
            const shell =
              process.env[_os.platform() === "win32" ? "COMSPEC" : "SHELL"];
            const ptyProcess = pty.spawn(shell, [], {
              cwd: object == undefined ?
                graviton.getCurrentDirectory() :
                object.path,
              env: process.env
            });
            const xterm = new Terminal({
              rows: "10",
              theme: {
                background: themeObject.colors[
                  "editor-background-color"
                ],
                foreground: themeObject.colors["white-black"]
              }
            });
            xterm.open(
              document.getElementById("xterm" + randomID + "_commander")
            );
            xterm.on("data", data => {
              ptyProcess.write(data);
            });
            ptyProcess.on("data", function (data) {
              xterm.write(data);
            });
            graviton.resizeTerminals();
            for (i = 0; i < editor_screens.length; i++) {
              if (editor_screens[i].id == current_screen.id) {
                editor_screens[i].terminal = {
                  id: "xterm" + randomID,
                  xterm: xterm
                };
                current_screen.terminal = editor_screens[i].terminal;
                const new_terminal_event = new CustomEvent("new_terminal", {
                  detail: {
                    terminal: current_screen.terminal
                  }
                });
                document.dispatchEvent(new_terminal_event);
                graviton.resizeTerminals();
                return;
              }
            }
          }
        }
      );
    },
    hide: function (id) {
      document.getElementById(id + "_commander").style.display = "none";
    },
    show: function (id) {
      document.getElementById(id + "_commander").style = "";
    },
    close: function (id) {
      document.getElementById(id + "_commander").remove();
    },
    closeTerminal: function () {
      for (i = 0; i < editor_screens.length; i++) {
        if (editor_screens[i].id == current_screen.id) {
          const closed_terminal_event = new CustomEvent("closed_terminal", {
            detail: {
              terminal: editor_screens[i].terminal
            }
          });
          document.dispatchEvent(closed_terminal_event);
          if (editor_screens[i].terminal != undefined) {
            editor_screens[i].terminal.xterm.destroy();
            commanders.close(current_screen.terminal.id);
          }
          editor_screens[i].terminal = undefined;
          current_screen.terminal = undefined;
          graviton.resizeTerminals();
        }
      }
    }
  }
}
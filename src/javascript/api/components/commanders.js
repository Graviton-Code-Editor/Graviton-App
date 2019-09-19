/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
module.exports = {
   commander: class {
      constructor(object, callback) {
         if (document.getElementById('editors').children[1] != undefined) {
            return callback(true)
         }
         this.id = object.id + '_commander'
         this.content = object.content
         const commanderObj = document.createElement('div')
         commanderObj.id = this.id
         commanderObj.classList = 'commander'
         commanderObj.innerHTML = object.content
         document.getElementById('editors').appendChild(commanderObj)
         return callback(false)
      }
      close() {
         document.getElementById(this.id).remove()
      }
      hide() {
         document.getElementById(this.id).style.display = 'none'
      }
      show() {
         document.getElementById(this.id).style = ''
      }
   },
   commanders: {
      terminal: function(object) {
         if (graviton.getCurrentDirectory() == null && object == undefined) {
            graviton.throwError(
               getTranslation('CannotRunTerminalCauseDirectory')
            )
            return
         }
         if (terminal != null) {
            if (document.getElementById(current_screen.terminal.id + '_commander').style.display == 'none') {
               commanders.show(terminal.id)
            }
            return
         }
         const randomID = Math.random()
         new commander({
               id: 'xterm' + randomID,
               content: `
               <navbar class='terminal_navbar' >
                  <span class="icon unselectable" onclick=commanders.closeTerminal()>${icons.close}</span>
               </navbar>
               <div class="terminal_container" id='container${randomID}'></div>
               `
            },
            function(err) {
               if (!err) {
                  const shell = process.env[_os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
                  const ptyProcess = pty.spawn(shell, [], {
                     cwd: object == undefined ?
                        graviton.getCurrentDirectory() : object.path,
                     env: process.env
                  })
                  const config = {
                     rows: '10',
                     theme: {
                        background: themeObject.colors[
                           'editor-background-color'
                        ],
                        foreground: themeObject.colors['white-black'],
                        cursor:themeObject.colors['white-black'],
                        selection: themeObject.colors['scroll-color']
                     },
                     cursorStyle: 'underline',
                     cursorBlink: true,
                     fontFamily : 'terminal'
                     
                  }
                  const xterm = new Terminal(config)
                  xterm.open(
                     document.getElementById(`container${randomID}`)
                  )
                  xterm.on('data', data => {
                     ptyProcess.write(data)
                  })
                  ptyProcess.on('data', function(data) {
                     xterm.write(data)
                  })
                  terminal = {
                     id: 'xterm' + randomID,
                     xterm: xterm
                  }
                  current_screen.terminal  = editor_screens.filter((screen) => screen.id == current_screen.id)[0]
                  const new_terminal_event = new CustomEvent('new_terminal', {
                     detail: {
                        id: 'xterm' + randomID,
                        xterm: xterm
                     }
                  })
                  document.dispatchEvent(new_terminal_event)
                  graviton.resizeTerminals()
                  xterm.refresh()
               }
            })
      },
      hide: function() {
         if (terminal != null) document.getElementById(terminal.id + '_commander').style.display = 'none'
      },
      show: function() {
         if (terminal != null) document.getElementById(terminal.id + '_commander').style = ''
      },
      close: function() {
         if (terminal != null) document.getElementById(terminal.id + '_commander').remove()
      },
      closeTerminal: function() {
         const closed_terminal_event = new CustomEvent('closed_terminal', {
            detail: terminal
         })
         document.dispatchEvent(closed_terminal_event)
         terminal.xterm.destroy()
         commanders.close(terminal.id)
         terminal = null
         graviton.resizeTerminals()
      }
   }
}

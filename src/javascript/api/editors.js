function createInstance(clientName = "codemirror", clientConf){

  const resultInstance = graviton.editorClients.filter(function(instance){
    return instance.name == clientName
  })[0]
  return {
    instance:resultInstance,
    editor:resultInstance.onLoadTab(clientConf)
  }

}

function hideEditors(){
  for (i = 0; i < editors.length; i++) {
    if (
      editors[i].screen == screen &&
      document.getElementById(editors[i].id) != null
    ) {
      document.getElementById(editors[i].id).style.display = 'none'
    }
  }
}


function editorClient(conf){
  graviton.editorClients.push(conf)
}

module.exports = {
  editorClient:editorClient,
  loadEditor({ dir, type, data, screen }, callback){
    if (
      document.getElementById(dir.replace(/\\/g, '') + '_editor') == undefined
    ) {
      switch (type) {
        case 'text':
          hideEditors()
          const textContainer = document.createElement('div')
          textContainer.classList = 'code-space'
          textContainer.id = `${dir.replace(/\\/g, '')}_editor`
          textContainer.setAttribute('path', dir)
          document
            .getElementById(screen)
            .children[1].appendChild(textContainer)
          const {instance , editor} = createInstance(graviton.getEditorClient(),{
            dir:dir,
            type:type,
            data:data,
            screen:screen,
            textContainer:textContainer
          })
          editors.push({
            id:textContainer.id,
            screen:screen,
            editor:editor,
            instance:instance,
            execute(name,data){
              if(instance[name] != undefined){
                return instance[name](data)
              }
              return false
            }
          })
          break
        case 'font':
          graviton.setCurrentEditor(null)
          const font_container = document.createElement('div')
          font_container.classList = 'code-space'
          font_container.setAttribute('id', `${dir.replace(/\\/g, '')}_editor`)
          const returnPreview = require(path.join("..","components","global","font_previewer"));
          puffin.render(returnPreview(dir),font_container)
          document
            .getElementById(screen)
            .children[1].appendChild(font_container)
          const new_editor_font = {
            object: font_container,
            id: dir.replace(/\\/g, '') + '_editor',
            editor: undefined,
            path: dir,
            screen: screen,
            type: 'font'
          }
          hideEditors()
          editors.push(new_editor_font)
          document.getElementById(
            dir.replace(/\\/g, '') + '_editor'
          ).style.display = 'block'
          editorID = new_editor_font.id
          graviton.focusScreen(screen)
          break
        case 'image':
          graviton.setCurrentEditor(null)
          const image_container = document.createElement('div')
          image_container.classList = 'code-space'
          image_container.setAttribute(
            'id',
            `${dir.replace(/\\/g, '')}_editor`
          )
          image_container.innerHTML = `<img src="${dir}">`
          document
            .getElementById(screen)
            .children[1].appendChild(image_container)
          const new_editor_image = {
            object: image_container,
            id: dir.replace(/\\/g, '') + '_editor',
            editor: null,
            path: dir,
            screen: screen,
            type: 'image'
          }
          hideEditors()
          editors.push(new_editor_image)
          document.getElementById(
            dir.replace(/\\/g, '') + '_editor'
          ).style.display = 'block'
          editorID = new_editor_image.id
          graviton.focusScreen(screen)
          break
        case 'free':
          graviton.setCurrentEditor(null)
          const free_id = 'free_tab' + Math.random()
          const free_container = document.createElement('div')
          free_container.classList = 'code-space'
          free_container.setAttribute('id', `${dir.replace(/\\/g, '')}_editor`)
          free_container.innerHTML = data != undefined ? data : ''
          document
            .getElementById(screen)
            .children[1].appendChild(free_container)
          const new_editor_free = {
            object: free_container,
            id: dir.replace(/\\/g, '') + '_editor',
            editor: null,
            path: null,
            screen: screen,
            type: 'free'
          }
          hideEditors()
          editors.push(new_editor_free)
          document.getElementById(
            dir.replace(/\\/g, '') + '_editor'
          ).style.display = 'block'
          editorID = new_editor_free.id
          graviton.focusScreen(screen)
          break
      }
      if (callback != undefined) callback()
    } else {
      for (i = 0; i < editors.length; i++) {
        hideEditors()
        if (editors[i].id == dir.replace(/\\/g, '') + '_editor') {
          if (editors[i].editor != undefined) {
            // Editors
            editor = editors[i].editor
          } else {
            editor = undefined
          }
          editorID = editors[i].id
          document.getElementById(editorID).style.display = 'block'
          if (editor != undefined) editor.refresh()
        }
        if (callback != undefined) callback(editor)
      }
    }

    function filterIt (arr, searchKey, cb) {
      let list = []
      for (i = 0; i < arr.length; i++) {
        const curr = arr[i]
        Object.keys(curr).some(function (key) {
          if (typeof curr[key] === 'string' && curr[key].includes(searchKey)) {
            list.push(curr)
          }
        })
      }
      return cb(list)
    }
    if (editor != undefined) {
      editor.on('change', function () {
        const close_icon = document.getElementById(editingTab)
        close_icon.setAttribute('file_status', 'unsaved')
        close_icon.children[1].innerHTML = icons['unsaved']
        document
          .getElementById(editingTab)
          .setAttribute('data', editor.getValue())
        if (current_config['autoCompletionPreferences'] == 'activated') {
          function checkVariables(text) {
            let _variables = []
            for (i = 0; i < text.length; i++) {
              switch (editor.getMode().name) {
                case "javascript":
                  switch (text[i]) {
                    case "let":
                    case "var":
                    case "const":
                      _variables.push({
                        _name: text[i + 1]
                      })
                      break
                    case "{":
                      _variables.push({
                        _name: text[i + 1]
                      })
                      break
                  }
                  break
                case "java":
                  switch (text[i]) {
                    case "int":
                    case "char":
                    case "float":
                      _variables.push({
                        _name: text[i + 1]
                      })
                      break
                  }
                  break
              }
            }
            return _variables
          }
          elasticContainer.append(document.getElementById('context'))
          const cursorPos = editor.cursorCoords()
          const A1 = editor.getCursor().line
          const A2 = editor.getCursor().ch
          const B1 = editor.findWordAt({
            line: A1,
            ch: A2
          }).anchor.ch
          const B2 = editor.findWordAt({
            line: A1,
            ch: A2
          }).head.ch
          const lastWord = editor.getRange(
            {
              line: A1,
              ch: B1
            },
            {
              line: A1,
              ch: B2
            }
          )
          const context = document.getElementById('context')
          if (context.style.display == 'block') return
          const selectedLangNum = (function () {
            for (i = 0; i < dictionary.length; i++) {
              if (
                dictionary[i].name ==
                path
                  .basename(graviton.getCurrentFile().path)
                  .split('.')
                  .pop()
              ) {
                return i
              }
            }
          })()
          if (selectedLangNum == undefined) return
          let dic = dictionary[selectedLangNum].list
          const vars = checkVariables(
            editor
              .getValue()
              .replace(/(\r\n|\n|\r)/gm, ' ')
              .split (
                /\s|(\()([\w\s+!?="`[<>,\/*':&.`$;_-{}]+)(\))|\s|(\<)([\w\s!?="`[,\/*()':&.;_-{}]+)(\>)|\s|(\()([\w\s!?="<>`[,'+:&.;_-{}]+)(\))\s|(\B\$)(\w+)|\s(\/\*)([\w\s!?()="<>`[':.;_-{}]+)(\*\/)|("[\w\s!?():=`.;_-{}]+")\s|(%%)([\w\s!?()="+<>`[\/'*,$.;_-{}]+)(%%)|("[\w\s!?()='.`;_-{}]+")/g
              )
              .filter(Boolean)
          )
          dic = dic.concat(vars)
          filterIt(dic, lastWord, function (filterResult) {
            if (filterResult.length > 0 && lastWord.length >= 3) {
              let contextOptions
              for ( i = 0; i < filterResult.length; i++) {
                const id = Math.random()
                contextOptions += `
                <div class=option>
                  <button id=${id}  >
                    ${filterResult[i]._name}
                  </button>
                  <p></p>
                </div>`
                contextOptions = contextOptions.replace('undefined', '')
                context.innerHTML = contextOptions
                sleeping(1).then(() => {
                  if (document.getElementById(id) == null) return
                  document.getElementById(id).onclick = function () {
                    const A1 = editor.getCursor().line
                    const A2 = editor.getCursor().ch
                    const B1 = editor.findWordAt({
                      line: A1,
                      ch: A2
                    }).anchor.ch
                    const B2 = editor.findWordAt({
                      line: A1,
                      ch: A2
                    }).head.ch
                    const selected = this.innerText
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
                    )
                    context.parentElement.style.display = 'none'
                    context.innerHTML = ''
                  }
                })
              }
              context.parentElement.style = `top:${cursorPos.top +
                30}px; left:${cursorPos.left}px; display:block;`
              if (cursorPos.top < window.innerHeight / 2) {
              } // Cursor is above the mid height
              context.children[0].classList.add('hover')
            } else if (filterResult.length === 0 || lastWord.length < 3) {
              context.parentElement.style.display = 'none'
              context.innerHTML = ''
            }
          })
        }
      })
      editor.on('keydown', function (editor, e) {
        if (
          document.getElementById('context').parentElement.style.display !=
          'none'
        ) {
          editor.setOption('extraKeys', {
            Up: function () {
              return CodeMirror.PASS
            },
            Down: function () {
              return CodeMirror.PASS
            },
            Enter: function () {
              return CodeMirror.PASS
            },
            Tab: function () {
              return CodeMirror.PASS
            }
          })
        } else {
          editor.setOption('extraKeys', {
            Up: 'goLineUp',
            Down: 'goLineDown'
          })
        }
        const context = document.getElementById('context')
        const childs = context.querySelectorAll('.option')
        for (i = 0; i < childs.length; i++) {
          if (childs[i].classList.contains('hover')) {
            if (
              e.keyCode === 40 &&
              i != childs.length - 1 &&
              context.style.display != 'none'
            ) {
              // DOWN
              childs[i].classList.remove('hover')
              childs[i + 1].classList.add('hover')
              context.scrollBy(0, 30)
              return false
            } else if (
              e.keyCode === 38 &&
              i != 0 &&
              context.style.display != 'none'
            ) {
              // UP
              childs[i].classList.remove('hover')
              childs[i - 1].classList.add('hover')
              context.scrollBy(0, -30)
              return false
            }
            if (e.keyCode === 9 || e.keyCode === 13) {
              // 9 = Tab & 13 = Enter
              const A1 = editor.getCursor().line
              const A2 = editor.getCursor().ch
              const B1 = editor.findWordAt({
                line: A1,
                ch: A2
              }).anchor.ch
              const B2 = editor.findWordAt({
                line: A1,
                ch: A2
              }).head.ch
              const selected = (function () {
                for (i = 0; i < childs.length; i++) {
                  if (childs[i].classList.contains('hover')) {
                    return `${childs[i].innerText}`
                  }
                }
              })()
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
              )
              context.innerHTML = ''
              setTimeout(function () {
                context.parentElement.style.display = 'none'
                context.innerHTML = ''
              }, 1)
            }
          }
        }
      })
      editor.addKeyMap({
        'Ctrl-Up': function (cm) {
          graviton.setEditorFontSize(
            `${Number(current_config.fontSizeEditor) + 2}`
          )
        },
        'Ctrl-Down': function (cm) {
          graviton.setEditorFontSize(
            `${Number(current_config.fontSizeEditor) - 2}`
          )
        }
      })
    }
  }
}

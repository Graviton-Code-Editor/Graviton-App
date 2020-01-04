/**
 * @desc CodeMirror client instance
*/

document.addEventListener("graviton_loaded",function(){
  new graviton.editorClient({
    name: "codemirror",
    onKeyDown(instance,func){
      instance.on('keydown',func)
    },
    onChange(instance,func){
      instance.on('change',func)
    },
    onCursorActivity(instance,func){
      instance.on('cursorActivity',func)
    },
    getCursor(instance){
      const value = instance.getCursor()
      return {line:value.line,column:value.ch}
    },
    getValue(instance){
      return instance.getValue()
    },
    openFind(instance){
      CodeMirror.commands.find(instance);
    },
    openReplace(instance){
      CodeMirror.commands.replace(instance);
    },
    openJumpToLine(instance){
      CodeMirror.commands.jumpToLine(instance);
    },
    setLanguage(instance,language){
      switch(language){
        case "json":
          instance.setOption('mode', 'application/json')
          instance.setOption('htmlMode', false)
          break;
        case "html":
          instance.setOption('mode', 'htmlmixed')
          instance.setOption('htmlMode', false)
          break;
        case "cpp":
          instance.setOption('htmlMode', false)
          instance.setOption('mode', 'text/x-c++src')
          break;
        case "cs":
          instance.setOption('htmlMode', false)
          instance.setOption('mode', 'text/x-csharp')
          break;
        case "java":
          instance.setOption('htmlMode', false)
          instance.setOption('mode', 'text/x-java')
          break;
        case "objectivec":
          instance.setOption('htmlMode', false)
          instance.setOption('mode', 'text/x-objectivec') 
          break;
        case "kotlin":
          instance.setOption('htmlMode', false)
          instance.setOption('mode', 'text/x-kotlin')
          break;
        case "typescript":
          instance.setOption('htmlMode', false)
          instance.setOption('mode', 'application/typescript')
          break;
        default:
          instance.setOption('mode', language)
          instance.setOption('htmlMode', true)
      }     
    },
    doBlur(instance){
      //instance.blur()
    },
    getLineCount(instance){
      return instance.lineCount()
    },
    onContentChanged(instance,func){
      instance.on('change',func)
    },
    forceRefresh(instance){
      instance.refresh()
    },
    getValue(instance){
      return instance.getValue()
    },
    goToLine(instance,{line,char}){
      instance.setCursor(line, char)
      instance.scrollIntoView({line:line, char:char}, 300)
    },
    onLoadTab(clientConf){
      let codemirror = CodeMirror(
        document.getElementById(clientConf.textContainer.id),
        {
          value: clientConf.data,
          mode: 'text/plain',
          htmlMode: false,
          theme:
            themeObject['highlight'] != undefined
              ? themeObject['highlight']
              : 'default',
          lineNumbers: true,
          autoCloseTags: true,
          indentWithTabs: true,
          indentUnit: 2,
          tabSize: 2,
          id: clientConf.dir.replace(/\\/g, '') + '_editor',
          screen: clientConf.screen,
          styleActiveLine: { nonEmpty: true },
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          lineWrapping:
            current_config['lineWrappingPreferences'] == 'activated',
          autoCloseBrackets: true,
          matchBrackets: true,
          matchTags: { bothTags: true },
          styleActiveLine: { nonEmpty: true },
          styleActiveSelected: true,
          foldGutter:true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        }
      )
      codemirror.focus()
      const new_editor_text = {
        object: clientConf.textContainer,
        id: clientConf.textContainer.id,
        editor: codemirror,
        path: clientConf.dir,
        screen: clientConf.screen,
        type: clientConf.type
      }
      clientConf.textContainer.focus()
      elasticContainer.append(
        clientConf.textContainer.children[0].children[
          Number(clientConf.textContainer.children[0].children.length - 1)
        ]
      )
      clientConf.textContainer.addEventListener('wheel', function (e) {
        if (e.ctrlKey) {
          if (e.deltaY < 0) {
            graviton.setEditorFontSize(
              `${Number(current_config.fontSizeEditor) + 1}`
            )
          } else if (e.deltaY > 0) {
            graviton.setEditorFontSize(
              `${Number(current_config.fontSizeEditor) - 1}`
            )
          }
        }
      })
      editorID = new_editor_text.id
      editor = new_editor_text.editor
      clientConf.textContainer.style.display = 'block'
      codemirror.on('cursorActivity', function (cm) {
        editor = cm
        editorID = cm.options.id
        for (let b = 0; b < tabs.length; b++) {
          if (
            tabs[b].getAttribute('screen') == cm.options.screen &&
            tabs[b].classList.contains('selected')
          ) {
            editingTab = tabs[b].id
            filepath = tabs[b].getAttribute('longpath')
          }
        }
        graviton.closeDropmenus()
        graviton.focusScreen(cm.options.screen)
      })
      graviton.focusScreen(screen)

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
      if (codemirror != undefined) {
        codemirror.on("change", function () {
          if (current_config['autoCompletionPreferences'] == 'activated') {
            function checkVariables(text) {
              let _variables = []
              for (i = 0; i < text.length; i++) {
                switch (codemirror.getMode().name) {
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
            const cursorPos = codemirror.cursorCoords()
            const A1 = codemirror.getCursor().line
            const A2 = codemirror.getCursor().ch
            const B1 = codemirror.findWordAt({
              line: A1,
              ch: A2
            }).anchor.ch
            const B2 = edicodemirroror.findWordAt({
              line: A1,
              ch: A2
            }).head.ch
            const lastWord = codemirror.getRange(
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
              codemirror
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
                      const A1 = codemirror.getCursor().line
                      const A2 = codemirror.getCursor().ch
                      const B1 = codemirror.findWordAt({
                        line: A1,
                        ch: A2
                      }).anchor.ch
                      const B2 = codemirror.findWordAt({
                        line: A1,
                        ch: A2
                      }).head.ch
                      const selected = this.innerText
                      codemirror.replaceRange(
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
        codemirror.on('keydown', function (editor, e) {
          if (
            document.getElementById('context').parentElement.style.display !=
            'none'
          ) {
            codemirror.setOption('extraKeys', {
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
            codemirror.setOption('extraKeys', {
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
                const A1 = codemirror.getCursor().line
                const A2 = codemirror.getCursor().ch
                const B1 = codemirror.findWordAt({
                  line: A1,
                  ch: A2
                }).anchor.ch
                const B2 = codemirror.findWordAt({
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
                codemirror.replaceRange(
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
        codemirror.addKeyMap({
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
      return codemirror
    }
  })
})
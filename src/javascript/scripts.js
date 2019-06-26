/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const g_version = {
  date: '190627',
  version: '1.0.2',
  state: 'Beta'
}
const os = require('os'),
      { shell } = require('electron'),
      fs = require('fs-extra'),
      path = require('path'),
      { dialog } = require('electron').remote,
      remote = require('electron').remote,
      BrowserWindow = require('electron').BrowserWindow,
      app = require('electron').remote,
      getAppDataPath = require('appdata-path'),
      $ = require('jquery'),
      { webFrame } = require('electron'),
      g_window = require('electron').remote.getCurrentWindow(),
      { systemPreferences } = require('electron').remote,
      url = require('url'),
      marked = require('marked'),
      updater = require("./src/javascript/updater"); /*Import the update module*/

let current_screen,
    dir_path,
    i,
    DataFolderDir = path.join(path.join(__dirname, '..'), '.graviton'),   
    tabs = [],
    FirstFolder = 'not_selected',
    editingTab,
    ids = 0,
    plang = ' ',
    _notifications = [],
    filepath = ' ',
    editors = [],
    editor,
    editorID,
    editor_mode = 'normal',
    g_highlighting = 'activated',
    _previewer,
    log = [],
    themes = [],
    themeObject,
    new_update = false,
    mouseClicked = false,
    touchingResizerValue = false,
    editor_screens = [],
    dictionary = autocomplete.javascript

if (path.basename(__dirname) !== 'Graviton-Editor') DataFolderDir = path.join(getAppDataPath(), '.graviton')
if (!fs.existsSync(DataFolderDir)) fs.mkdirSync(DataFolderDir) // Create .graviton if it doesn't exist

/* Set path for graviton's files and dirs */
let logDir = path.join(DataFolderDir, 'log.json'),
    configDir = path.join(DataFolderDir, 'config.json'),
    timeSpentDir = path.join(DataFolderDir, '_time_spent.json'),
    themes_folder = path.join(DataFolderDir, 'themes'),
    highlights_folder = path.join(DataFolderDir, 'highlights'),
    plugins_folder = path.join(DataFolderDir, 'plugins'),
    plugins_db = path.join(DataFolderDir, 'plugins_db')

document.addEventListener('mousedown', function (event) {
  if (event.which) mouseClicked = true
}, true)

document.addEventListener('mouseup', function (event) {
  if (event.which) mouseClicked = false
}, true)
document.addEventListener('mousemove', function (event) {
  if (mouseClicked && touchingResizerValue) {
    const explorer = document.getElementById('g_explorer')
    explorer.style = `width: ${event.clientX - 3}px`
  }
}, true)

const loadEditor = (info) => {
  if (document.getElementById(info.dir.replace(/\\/g, "") + '_editor') == undefined) {
    switch (info.type) {
      case 'text':
        let text_container = document.createElement('div')
        text_container.classList = 'code-space'
        text_container.setAttribute('id', info.dir.replace(/\\/g, "") + '_editor')
        text_container.setAttribute('path', info.dir)
        document.getElementById(current_screen.id).children[1].appendChild(text_container)
        let codemirror = CodeMirror(document.getElementById(text_container.id), {
          value: info.data,
          mode: 'text/plain',
          htmlMode: false,
          theme: themeObject['Highlight'],
          lineNumbers: true,
          autoCloseTags: true,
          indentUnit: 2,
          id: info.dir,
          styleActiveLine: true,
          lineWrapping: current_config['lineWrappingPreferences'] == 'activated'
        })
        document.getElementById(current_screen.id).children[2].children[0].innerText = getLanguageName(getFormat(path.basename(info.dir)) != 'unknown' ? getFormat(path.basename(info.dir)) : path.basename(info.dir).split('.').pop())
        const new_editor_text = {
          object:text_container,
          id: text_container.id,
          editor: codemirror,
          path: info.dir,
          screen: info.screen
        }
        editors.push(new_editor_text)
        if (g_highlighting == 'activated') updateCodeMode(codemirror, info.dir)
        for (i = 0; i < editors.length; i++) {
          if (editors[i].screen == info.screen && document.getElementById(editors[i].id) != null) {
            document.getElementById(editors[i].id).style.display = 'none'
          }
        }
        editorID = new_editor_text.id
        editor = new_editor_text.editor
        document.getElementById(new_editor_text.id).style.display = 'block'
        codemirror.on('focus', function (a) {
          for (i = 0; i < editors.length; i++) {
            if (editors[i].id == a.options.id + '_editor') {
              editor = editors[i].editor
              editorID = editors[i].id
              for (let b = 0; b < tabs.length; b++) {
                if (tabs[b].getAttribute('screen') == editors[i].screen && tabs[b].classList.contains('selected')) {
                  editingTab = tabs[b].id
                  filepath = tabs[b].getAttribute('longpath')
                }
              }
            }
          }
        })
        break
      case 'image':
        const image_container = document.createElement('div')
        image_container.classList = 'code-space'
        image_container.setAttribute('id', `${info.dir.replace(/\\/g, "")}_editor`)
        image_container.innerHTML = `<img src="${info.dir}">`
        document.getElementById(current_screen.id).children[1].appendChild(image_container)
        const new_editor_image = {
          id: info.dir.replace(/\\/g, "") + '_editor',
          editor: undefined,
          path: info.dir,
          screen: info.screen
        }
        for (i = 0; i < editors.length; i++) {
          if (editors[i].screen == info.screen && document.getElementById(editors[i].id) != null) {
            document.getElementById(editors[i].id).style.display = 'none'
          }
        }
        editors.push(new_editor_image)
        console.log(info.dir);
        document.getElementById(info.dir.replace(/\\/g, "") + '_editor').style.display = 'block'
        editorID = new_editor_image.id
        document.getElementById(current_screen.id).children[2].children[0].innerText = 'Image'
        break
      case 'free':
        const free_id = Math.random()
        const free_container = document.createElement('div')
        free_container.classList = 'code-space'
        free_container.setAttribute('id', `${info.dir.replace(/\\/g, "")}_editor`)
        free_container.innerHTML = info.data!=undefined?info.data:"";
        document.getElementById(current_screen.id).children[1].appendChild(free_container)
        const new_editor_free = {
          id: info.dir.replace(/\\/g, "") + '_editor',
          editor: undefined,
          path: undefined,
          screen: info.screen,
          type: 'free'
        }
        for (i = 0; i < editors.length; i++) {
          if (editors[i].screen == info.screen && document.getElementById(editors[i].id) != null) {
            document.getElementById(editors[i].id).style.display = 'none'
          }
        }
        editors.push(new_editor_free)
        document.getElementById(info.dir.replace(/\\/g, "") + '_editor').style.display = 'block'
        editorID = new_editor_free.id
        document.getElementById(current_screen.id).children[2].children[0].innerText = ' '
        break
    }
  } else { // Editor exists
    for (i = 0; i < editors.length; i++) {
      if (editors[i].screen == info.screen && document.getElementById(editors[i].id) != null) {
        document.getElementById(editors[i].id).style.display = 'none'
      }
      if (editors[i].id == info.dir.replace(/\\/g, "") + '_editor') {
        if (editors[i].editor != undefined) { // Editors
          editor = editors[i].editor
          document.getElementById(info.screen).children[2].children[0].innerText = getLanguageName(getFormat(path.basename(info.dir)) != 'unknown' ? getFormat(path.basename(info.dir)) : path.basename(info.dir).split('.').pop())
        } else if (info.type != 'free') { // Images
          document.getElementById(info.screen).children[2].children[0].innerText = 'Image'
        } else {
          document.getElementById(info.screen).children[2].children[0].innerText = ''
        }
        editorID = editors[i].id
        document.getElementById(editorID).style.display = 'block'
        if (editor != undefined) editor.refresh()
      }
    }
  }

  function filterIt (arr, searchKey, cb) {
    var list = []
    for (var i = 0; i < arr.length; i++) {
      var curr = arr[i]
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
      close_icon.children[1].innerHTML = icons["unsaved"]
      document.getElementById(editingTab).setAttribute('data', editor.getValue())
      if (current_config['autoCompletionPreferences'] == 'activated' && plang == 'JavaScript') {
        // Getting Cursor Position
        const cursorPos = editor.cursorCoords()
        // Getting Last Word
        const A1 = editor.getCursor().line
        const A2 = editor.getCursor().ch
        const B1 = editor.findWordAt({ line: A1, ch: A2 }).anchor.ch
        const B2 = editor.findWordAt({ line: A1, ch: A2 }).head.ch
        const lastWord = editor.getRange({ line: A1, ch: B1 }, { line: A1, ch: B2 })
        // Context Menu
        filterIt(dictionary, lastWord, function (filterResult) {
          if (filterResult.length > 0 && lastWord.length >= 3) {
            let contextOptions
            for (var i = 0; i < filterResult.length; i++) {
              contextOptions += "<button class='option'>" + filterResult[i]._name + '</button>'
              contextOptions = contextOptions.replace('undefined', '')
              $('context .menuWrapper').html(contextOptions)
            }
            $('context').fadeIn()
            $('context').css({ 'top': (cursorPos.top + 30) + 'px', 'left': cursorPos.left + 'px' })
            $('context .menuWrapper .option').first().addClass('hover')
          } else if (filterResult.length === 0 || lastWord.length < 3) {
            $('context').fadeOut()
            $('context .menuWrapper').html('')
          }
        })
      }
    })
    editor.on('keydown', function (editor, e) {
      if ($('context').css('display') != 'none') {
        // Ignore keys actions on context options displayed.
        editor.setOption('extraKeys', {
          'Up': function () {
            if (true) {
              return CodeMirror.PASS
            }
          },
          'Down': function () {
            if (true) {
              return CodeMirror.PASS
            }
          },
          'Enter': function () {
            if (true) {
              return CodeMirror.PASS
            }
          }
        })
      } else { // Reset keys actions.
        editor.setOption('extraKeys', {
          'Up': 'goLineUp'
        })
      }
      // Context Options keys handler
      $('context .menuWrapper .option.hover').filter(function () {
        if (e.keyCode === 40 && !$('context .menuWrapper .option').last().hasClass('hover') && $('context').css('display') != 'none') {
          $('context .menuWrapper .option').removeClass('hover')
          $(this).next().addClass('hover')
          document.getElementById('context').scrollBy(0, 30)
          return false
        } else if (e.keyCode === 38 && !$('context .menuWrapper .option').first().hasClass('hover') && $('context').css('display') != 'none') {
          $('context .menuWrapper .option').removeClass('hover')
          $(this).prev().addClass('hover')
          document.getElementById('context').scrollBy(0, -30)
          return false
        }
        // Selection key Triggers
        if (e.keyCode === 13) {
          const A1 = editor.getCursor().line
          const A2 = editor.getCursor().ch
          const B1 = editor.findWordAt({ line: A1, ch: A2 }).anchor.ch
          const B2 = editor.findWordAt({ line: A1, ch: A2 }).head.ch
          const selected = $(this).text()
          editor.replaceRange(selected, { line: A1, ch: B1 }, { line: A1, ch: B2 })
          setTimeout(function () {
            $('context').fadeOut()
            $('context .menuWrapper').html('')
          }, 100)
        }
      })
    })
    $('context .menuWrapper').on('mouseenter', 'div.option', function () {
      $('context .menuWrapper .option').not(this).removeClass('hover')
      $(this).addClass('hover')
    })
    $('context .menuWrapper').on('mousedown', 'div.option', function (e) {
      const A1 = editor.getCursor().line
      const A2 = editor.getCursor().ch
      const B1 = editor.findWordAt({ line: A1, ch: A2 }).anchor.ch
      const B2 = editor.findWordAt({ line: A1, ch: A2 }).head.ch
      const selected = $(this).text()
      editor.replaceRange(selected, { line: A1, ch: B1 }, { line: A1, ch: B2 })
      $('context').fadeOut()
      $('context .menuWrapper').html('')
      e.preventDefault()
    })
    editor.addKeyMap({
      'Ctrl-S': function (cm) { saveFile() },
      'Ctrl-N': function (cm) { screens.add() },
      'Ctrl-L': function (cm) { screens.remove(current_screen.id) },
      'Ctrl-E': function (cm) { graviton.toggleZenMode() },
      'Ctrl-T': function (cm) { commanders.terminal() },
      'Ctrl-Y': function (cm) { commanders.closeTerminal() }
    })
  }
}
const appendBinds = () => {
  Mousetrap.bind('mod+s', function () {
    saveFile()
  })
  Mousetrap.bind('mod+n', function () {
    screens.add()
  })
  Mousetrap.bind('mod+l', function () {
    screens.remove(current_screen.id)
  })
  Mousetrap.bind('mod+e', function () {
    graviton.toggleZenMode()
  })
  Mousetrap.bind('mod+t', function () {
    commanders.terminal()
  })
  Mousetrap.bind('mod+y', function () {
    commanders.closeTerminal()
  })
}

function restartApp () {
  remote.app.relaunch()
  remote.app.exit(0)
}

function save_file_warn (ele) {
  new g_dialog({
    id: 'saving_file_warn',
    title: current_config.language['Warn'],
    content: current_config.language['FileExit-dialog-message'],
    buttons: {
      [current_config.language['FileExit-dialog-button-accept']]: `closeDialog(this); ${ele.getAttribute('onclose')}`,
      [current_config.language['Cancel']]: `closeDialog(this);`,
      [current_config.language['FileExit-dialog-button-deny']]: 'saveFile(); closeDialog(this);'
    }
  })
}

function saveFileAs () {
  dialog.showSaveDialog(fileName => {
    fs.writeFile(fileName, editor.getValue(), err => {
      if (err) {
        alert(`An error ocurred creating the file ${err.message}`)
        return
      }
      filepath = fileName
      new Notification('Graviton', `The file has been succesfully saved in ${fileName}`)
    })
  })
}

function openFile () {
  dialog.showOpenDialog(fileNames => {
    // fileNames is an array that contains all the selected files
    if (fileNames === undefined) {
      return
    }
    new Tab({
      id: Math.random() + fileNames[0].replace(/\\/g, '') + 'B',
      path: fileNames[0],
      name: fileNames[0],
      type: 'file'
    })
  })
}

function openFolder () {
  dialog.showOpenDialog({ properties: ['openDirectory'] },
    selectedFiles => {
      if (selectedFiles === undefined) return
      loadDirs(selectedFiles[0], 'g_directories', true)
    }
  )
}

function saveFile () {
  if(graviton.getCurrentEditor().editor!=undefined){
    fs.writeFile(filepath, editor.getValue(), err => {
      if (err) return err
      document.getElementById(editingTab).setAttribute('file_status', 'saved')
      document
        .getElementById(editingTab)
        .children[1].setAttribute('onclick', document.getElementById(editingTab).children[1].getAttribute('onclose'))
      document.getElementById(editingTab).children[1].innerHTML = icons["close"]
      const file_saved_event = new CustomEvent("file_saved",{
        data:{
          object : graviton.getCurrentEditor().object
        }
      })
      document.dispatchEvent(file_saved_event);
    })
  }
}


function loadDirs (dir, app_id, first_time) {
  if (!fs.existsSync(dir)) {
    graviton.throwError(current_config.language['DirectoryDoesntExist'])
    return
  }
  const appender_id = app_id.replace(/\\/g, '')
  if (appender_id == 'g_directories') {
    document.getElementById('g_explorer').innerHTML = `<div id="g_directories"></div>`
    dir_path = dir
  }
  let working_folder
  FirstFolder = dir
  const appender = document.getElementById(appender_id)
  if (appender.getAttribute('opened') == 'true') {
    appender.setAttribute('opened', 'false')
    const dir_length = appender.children.length
    appender.children[0].children[0].setAttribute('src', directories.getCustomIcon(path.basename(FirstFolder), 'close'))
    appender.children[1].innerHTML = ''
    return
  } else {
    document.getElementById(appender_id).setAttribute('opened', 'true')
    if (first_time === false) {
      const click = document.getElementById(appender_id).children[0]
      click.children[0].setAttribute('src', directories.getCustomIcon(path.basename(FirstFolder), 'open'))
    }
  }
  if (first_time) {
    if (document.getElementById('openFolder') != null) document.getElementById('openFolder').remove()
    registerNewProject(dir)
    working_folder = document.createElement('div')
    for (i = 0; i < document.getElementById(appender_id).children.length; i++) {
      document.getElementById(appender_id).children[i].remove()
    }
    document.getElementById(appender_id).setAttribute('opened', 'false')
    working_folder.setAttribute('id', 'g_directory')
    working_folder.setAttribute('myPadding', '50')
    working_folder.innerHTML = `<p>${path.basename(dir)}</p>`
    document.getElementById(appender_id).appendChild(working_folder)
  } else {
    working_folder = document.getElementById(appender_id).children[1]
  }
  const paddingListDir = Number(document.getElementById(appender_id).getAttribute('myPadding')) + 7 // Add padding
  fs.readdir(dir, (err, paths) => {
    ids = 0
    if (paths == undefined) {
      graviton.throwError('Cannot read files on the directory :' + FirstFolder + '. Check the permissions.')
      return
    }
    for (i = 0; i < paths.length; i++) {
      let _long_path = path.join(dir, paths[i])
      if (graviton.currentOS().codename == 'win32') {
        _long_path = _long_path.replace(/\\/g, '\\\\')
      }
      ids++
      const stats = fs.statSync(_long_path)
      if (stats.isDirectory()) {
        // If is folder
        const directory_temp = document.createElement('div')
        directory_temp.innerHTML += `
        <div opened="false" ID="${ids + dir.replace(/\\/g, '')}" name="${paths[i]}" style="padding-left:${paddingListDir}px; vertical-align:middle;">
          <div  class="directory" onclick="loadDirs('${_long_path}','${ids + dir.replace(/\\/g, '')}',false)">
            <img style="float:left; padding-right:3px; height:24px; width:24px; " src="${directories.getCustomIcon(paths[i], 'close')}">
           <p >
          ${paths[i]}
          </p> 
          </div>
          <div myPadding="${paddingListDir}" longpath="${_long_path}"></div>
        </div>`
        working_folder.appendChild(directory_temp)
      }
    }
    for (i = 0; i < paths.length; i++) {
      let _long_path = path.join(dir, paths[i])
      if (graviton.currentOS().codename == 'win32') {
        _long_path = _long_path.replace(/\\/g, '\\\\') // Delete
      }
      ids++
      const stats = fs.statSync(_long_path)
      if (stats.isFile()) {
        const file_temp = document.createElement('div')
        file_temp.innerHTML += `
        <div parent_ID="${ids + dir + '_div'}" elementType="directorie" onclick="new Tab({
          id:'${ids + dir.replace(/\\/g, '') + 'B'}',
          path:'${_long_path}',
          name:'${paths[i]}',
          type:'file'
        })" myPadding="${paddingListDir}" longPath="${_long_path}" class="directory" ID="${ids + dir + '_div'}" name="${paths[i]}" style=" margin-left:${paddingListDir}px; vertical-align:middle;">
          <img parent_ID="${ids + dir + '_div'}" ID="${ids + dir + '_img'}" longPath="${_long_path}" elementType="directorie" style="float:left; padding-right:3px; height:24px; width:24px;" src="src/icons/files/${getFormat(paths[i])}.svg">
          <p parent_ID="${ids + dir + '_div'}" ID="${ids + dir + '_p'}" longPath="${_long_path}" elementType="directorie">
          ${paths[i]}
          </p>
        </div>`
        working_folder.appendChild(file_temp)
      }
    }
  })
}
const directories = {
  removeDialog: function (object) {
    new g_dialog({
      id: 'remove_directorie',
      title: current_config.language['Dialog.AreYouSure'],
      content: '',
      buttons: {
        [current_config.language['Cancel']]: `closeDialog(this); `,
        [current_config.language['Accept']]: `closeDialog(this); directories.remove('${object.id.replace(/\\/g, '\\\\')}'); `
      }
    })
  },
  remove: function (id) {
    const object = document.getElementById(id)
    fs.unlink(object.getAttribute('longpath'), function (err) {
      if (err) console.error(err)
      object.remove()
    })
  },
  getCustomIcon: function (path, state) {
    switch (path) {
      case 'node_modules':
        return 'src/icons/custom_icons/node_modules.svg'
        break
      case '.git':
        return 'src/icons/custom_icons/git.svg'
        break
      default:
        if (state == 'close') {
          return 'src/icons/folder_closed.svg'
        } else {
          return 'src/icons/folder_opened.svg'
        }
    }
  }
}

function getFormat (text) {
  switch (text.split('.').pop()) {
    case 'html':
      return 'html'
    case 'js':
      return 'js'
    case 'css':
      return 'css'
    case 'json':
      return 'json'
    case 'md':
      return 'unknown'
    case 'ts':
      return 'ts'
    case 'jpg':
    case 'png':
    case 'ico':
    case 'svg':
      return 'image'
    default:
      return 'unknown'
  }
}

function getLanguageName (format) {
  switch (format) {
    case 'html':
      return 'HTML'
    case 'css':
      return 'CSS'
    case 'js':
      return 'JavaScript'
    case 'jsx':
      return 'React JavaScript'
    case 'json':
      return 'JSON '
    case 'go':
      return 'Go'
    case 'sql':
      return 'SQL'
    case 'ruby':
      return 'Ruby'
    case 'php':
      return 'PHP'
    case 'sass':
      return 'Sass'
    case 'dart':
      return 'Dart'
    case 'pascal':
      return 'Pascal'
    case 'md':
      return 'Markdown'
    case 'py':
      return 'Python'
    case 'sh':
      return 'Shell'
    case 'c':
      return 'C'
    case 'ino':
      return 'C'
    case 'h':
      return 'C'
    case 'cpp':
      return 'C++'
    case 'c++':
      return 'C++'
    case 'cc':
      return 'C++'
    case 'cxx':
      return 'C++'
    case 'hpp':
      return 'C++'
    case 'h++':
      return 'C++'
    case 'hh':
      return 'C++'
    case 'hxx':
      return 'C++'
    case 'csharp':
      return 'C#'
    case 'cs':
      return 'C#'
    case 'java':
      return 'Java'
    case 'm':
      return 'Objective-C'
    case 'mm':
      return 'Objective-C'
    case 'kt':
      return 'Kotlin'
    case 'ts':
      return 'TypeScript'
    default:
      return format
  }
}

function updateCodeMode (instance, path) {
  if (g_highlighting == 'activated') {
    switch (path.split('.').pop()) {
      case 'html':
        instance.setOption('mode', 'htmlmixed')
        instance.setOption('htmlMode', true)
        plang = 'HTML'
        instance.refresh()
        break
      case 'css':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'css')
        plang = 'CSS'
        instance.refresh()
        break
      case 'js':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'javascript')
        plang = 'JavaScript'
        instance.refresh()
        break
      case 'jsx':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'jsx')
        plang = 'React JavaScript'
        instance.refresh()
        break
      case 'json':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'application/json')
        plang = 'JSON / JavaScript'
        instance.refresh()
        break
      case 'go':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'go')
        plang = 'Go'
        instance.refresh()
        break
      case 'sql':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'sql')
        plang = 'SQL'
        instance.refresh()
        break
      case 'ruby':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'ruby')
        plang = 'Ruby'
        instance.refresh()
        break
      case 'php':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'php')
        plang = 'PHP'
        instance.refresh()
        break
      case 'sass':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'sass')
        plang = 'Sass'
        instance.refresh()
        break
      case 'dart':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'dart')
        plang = 'Dart'
        instance.refresh()
        break
      case 'pascal':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'pascal')
        plang = 'Pascal'
        instance.refresh()
        break
      case 'md':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'text/x-markdown')
        plang = 'Markdown'
        instance.refresh()
        break
      case 'py':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'python')
        plang = 'Python'
        instance.refresh()
        break
      case 'sh':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'shell')
        plang = 'Shell'
        instance.refresh()
        break
      case 'c':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'text/x-csrc')
        plang = 'C'
        instance.refresh()
        break
      case 'cpp':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'text/x-c++src')
        plang = 'C++'
        instance.refresh()
        break
      case 'cs':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'text/x-csharp')
        plang = 'C#'
        instance.refresh()
        break
      case 'java':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'text/x-java')
        plang = 'Java'
        instance.refresh()
        break
      case 'h':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'text/x-objectivec')
        plang = 'Objective-C'
        instance.refresh()
        break
      case 'kt':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'text/x-kotlin')
        plang = 'Kotlin'
        instance.refresh()
        break
      case 'ts':
        instance.setOption('htmlMode', false)
        instance.setOption('mode', 'application/typescript')
        plang = 'TypeScript'
        instance.refresh()
        break
      default:
        instance.refresh()
    }
  }
}

const registerNewProject = function (dir) { // Add a new directory to the history if it is the first time it has been opened in the editor
  fs.readFile(logDir, 'utf8', function (err, data) {
    if (err) return
    log = JSON.parse(data)
    for (i = 0; i < log.length + 1; i++) {
      if (i != log.length) {
        if (log[i].Path == dir) {
          return
        }
      } else if (i == log.length) {
        log.unshift({
          Name: path.basename(dir),
          Path: dir
        })
        fs.writeFile(logDir, JSON.stringify(log))
        return
      }
    }
  })
}

const HTML_template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>New Project</title>
    <meta name="description" content="Graviton Project">
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
`
const g_newProject = function (template) {
  dialog.showOpenDialog({ properties: ['openDirectory'] },
    selectedFiles => {
      if (selectedFiles !== undefined) {
        switch (template) {
          case 'html':
            const g_project_dir = path.join(selectedFiles[0], '.GravitonProject ' + Date.now())
            fs.mkdirSync(g_project_dir)
            fs.writeFile(path.join(g_project_dir, 'index.html'), HTML_template, err => {
              if (err) {
                return err
              }
              loadDirs(g_project_dir, 'g_directories', true)
            })
            break
        }
      }
    }
  )
}
const g_NewProjects = () => {
  const new_projects_window = new Window({
    id: 'new_projects_window',
    content: `
      <h2 class="window_title">${current_config.language['Templates']}</h2> 
      <div onclick="g_newProject('html'); closeWindow('new_projects_window');" class="section2">
        <p>HTML</p>
      </div>`
  })
  new_projects_window.launch()
}
const preload = (array) => { // Preload images when booting
  for (i = 0; i < array.length; i++) {
    document.body.innerHTML += `
    <img id="${array[i]}"src="${array[i]}" style="visibility:hidden;"></img>`
    document.getElementById(array[i]).remove()
  }
}
const touchingResizer = type => {
  if (type == false) {
    if (!mouseClicked) {
      touchingResizerValue = false
    }
  } else {
    touchingResizerValue = true
  }
}

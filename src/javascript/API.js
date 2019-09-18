/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
'use strict'

const _os = require('os')
const pty = require('node-pty')
const path = require('path')
let graviton = {}
const {
  Dialog,
  closeDialog
} = require(path.join(
  __dirname,
  'src',
  'javascript',
  'api',
  'components',
  'dialogs.js'
)); const {
  Window,
  closeWindow
} = require(path.join(
  __dirname,
  'src',
  'javascript',
  'api',
  'components',
  'windows.js'
)); const {
  Notification,
  closeNotification
} = require(path.join(
  __dirname,
  'src',
  'javascript',
  'api',
  'components',
  'notifications.js'
)); const {
  Tab,
  closeTab,
  loadTab
} = require(path.join(
  __dirname,
  'src',
  'javascript',
  'api',
  'components',
  'tabs.js'
))

const dropMenu = require(path.join(
  __dirname,
  'src',
  'javascript',
  'api',
  'components',
  'dropmenus.js'
)).Dropmenu
let {
  icons
} = require(path.join(
  __dirname,
  'src',
  'javascript',
  'api',
  'components',
  'icons.js'
))

const { commander, commanders } = require(path.join(
  __dirname,
  'src',
  'javascript',
  'api',
  'components',
  'commanders.js'
))

let menus_showing = true
let context_menu_list_text = {
  // Initial value
  Copy: () => {
    document.execCommand('copy')
  },
  Paste: () => {
    document.execCommand('paste')
  }
}

const context_menu_list_tabs = {
  Close: function () {
    closeTab(
      document.getElementById(this.getAttribute('target')).getAttribute('TabID')
    )
  }
}
const context_menu_list_file = {
  Remove: function () {
    directories.removeFileDialog(
      document.getElementById(
        document
          .getElementById(this.getAttribute('target'))
          .getAttribute('parent')
      )
    )
  },
  'a1': '*line',
  CopyPath: function () {
    graviton.copyText(document.getElementById(this.getAttribute('target')).getAttribute('dir').replace(/\\\\/g, '\\'))
  }

}
const context_menu_directory_options = {
  Reload: function () {
    Explorer.load(
      document.getElementById(this.getAttribute('target')).getAttribute('dir'),
      document
        .getElementById(this.getAttribute('target'))
        .getAttribute('parent'),
      document
        .getElementById(this.getAttribute('target'))
        .getAttribute('global')
    )
  },
  OpenInExplorer: function () {
    shell.openItem(document.getElementById(document.getElementById(this.getAttribute('target')).getAttribute('parent')).getAttribute('dir'))
  },
  OpenAsGlobal: function () {
    Explorer.load(
      document.getElementById(this.getAttribute('target')).getAttribute('dir').replace(/\\\\/g, '\\'),
      'g_directories',
      true
    )
  },
  'a1': '*line',
  NewFolder: function () {
    directories.newFolder(document.getElementById(this.getAttribute('target')).getAttribute('parent'))
  },
  NewFile: function () {
    directories.newFile(document.getElementById(this.getAttribute('target')).getAttribute('parent'))
  },
  'a2': '*line',
  CopyPath: function () {
    graviton.copyText(document.getElementById(this.getAttribute('target')).getAttribute('dir').replace(/\\\\/g, '\\'))
  },
  'a3': '*line',
  Remove: function () {
    directories.removeFolderDialog(
      document.getElementById(
        document
          .getElementById(this.getAttribute('target'))
          .getAttribute('parent')
      )
    )
  }
}
class Plugin {
  constructor (object) {
    for (i = 0; i < plugins_list.length; i++) {
      if (plugins_list[i].name == object.name) {
        // List package information
        this.name = plugins_list[i].name
        this.author = plugins_list[i].author
        this.version = plugins_list[i].version
        this.description = plugins_list[i].description
      }
    }
    if (this.name == undefined) {
      console.warn(` Plugin by name > ${object.name} < doesn't exist `)
    }
  }
  saveData (data, callback) {
    plugins_dbs[this.index].db = data
    fs.writeFileSync(
      path.join(plugins_db, this.name) + '.json',
      JSON.stringify(data),
      function (err) {}
    )
    if (!callback == undefined) return callback
  }
  setData (key, data) {
    const name = this.name
    if (fs.existsSync(path.join(plugins_db, name) + '.json')) {
      this.getData(function (object) {
        object[key] = data
        fs.writeFileSync(
          path.join(plugins_db, name) + '.json',
          JSON.stringify(object),
          function (err) {
            plugins_dbs[this.index].db = object
          }
        )
      })
    }
  }
  createData (data) {
    if (!fs.existsSync(path.join(plugins_db, this.name) + '.json')) {
      const db = {
        plugin_name: this.name,
        db: data
      }
      plugins_dbs.push(db)
      this.index = plugins_dbs.length - 1
      fs.writeFileSync(
        path.join(plugins_db, this.name) + '.json',
        JSON.stringify(data),
        function (err) {}
      )
      return 'created'
    } else {
      return 'already_exists'
    }
  }
  getData (callback) {
    const me = this
    if (plugins_dbs[this.index] == undefined) {
      const name = this.name
      fs.readFile(path.join(plugins_db, name + '.json'), 'utf8', function (
        err,
        data
      ) {
        const object = {
          plugin_name: path.basename(name, '.json'),
          db: JSON.parse(data)
        }
        plugins_dbs.push(object)
        for (i = 0; i < plugins_dbs.length; i++) {
          if (plugins_dbs[i].plugin_name == name) {
            // List package information
            me.index = i
          }
        }
        return typeof callback === 'function' ? callback(plugins_dbs[me.index].db) : plugins_dbs[me.index].db
      })
    } else {
      return typeof callback === 'function' ? callback(plugins_dbs[me.index].db) : plugins_dbs[this.index].db
    }
  }
  deleteData (data) {
    if (data == undefined) {
      plugins_dbs[this.index].db = {}
      fs.writeFileSync(
        path.join(plugins_db, this.name) + '.json',
        '{}',
        function (err) {}
      )
    } else {
      const object = this.getData()
      delete object[data]
      fs.writeFileSync(
        path.join(plugins_db, this.name) + '.json',
        JSON.stringify(object),
        function (err) {}
      )
      plugins_dbs[this.index].db = object
    }
  }
}

function sleeping (milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}

graviton = {
  getCurrentTheme: function () {
    // Get the theme name of the applied theme
    return themeObject.name
  },
  getSelectedText: function () {
    // Get te text you have selected
    const selected_text = window.getSelection().toString()
    if (selected_text !== '') {
      return selected_text
    } else return null // Returns null if there is not text selected
  },
  getCurrentFile: function () {
    return {
      path: filepath
    }
  },
  getCurrentEditor: function () {
    if (editors.length == 0) return null
    return editors.find((item) => item.id === editorID)
  },
  getCurrentDirectory: function () {
    if (dir_path == undefined) return null
    return dir_path
  },
  currentOS: function () {
    switch (process.platform) {
      case 'win32':
        return {
          codename: process.platform,
          name: 'Windows'
        }
        break
      case 'darwin':
        return {
          codename: process.platform,
          name: 'MacOS'
        }
        break
      case 'linux':
        return {
          codename: process.platform,
          name: 'Linux'
        }
        break
      default:
        return {
          codename: process.platform,
          name: process.platform
        }
    }
  },
  openDevTools: function () {
    remote.getCurrentWindow().toggleDevTools()
  },
  editorMode: function () {
    return editor_mode
  },
  throwError: function (message) {
    console.log('%c Graviton ERROR :: ', ' color: red', message)
    new Notification({
      title: 'Error ',
      content: message
    })
  },
  dialogAbout: function () {
    new Dialog({
      id: 'about',
      title: getTranslation('About') + ' Graviton',
      content: `
	      ${getTranslation('Version')}: ${GravitonInfo.version} (${
  GravitonInfo.date
}) - ${GravitonInfo.state}
	      <br> ${getTranslation('OS')}: ${graviton.currentOS().name}`,
      buttons: {
        [getTranslation('More')]: {
          click: () => {
            Settings.open()
            Settings.navigate('about')
          },
          important: true
        },
        [getTranslation('Close')]: {}
      }
    })
  },
  dialogChangelog: function () {
    fs.readFile(path.join(__dirname, 'RELEASE_CHANGELOG.md'), 'utf8', function (
      err,
      data
    ) {
      new Dialog({
        id: 'changelog',
        title: `${getTranslation('Changelog')} - v${GravitonInfo.version}`,
        content: `<div style="padding:2px;">${marked(data)}</div>`,
        buttons: {
          [getTranslation('Close')]: {}
        }
      })
    })
  },
  factoryResetDialog: function () {
    new Dialog({
      id: 'factory_reset',
      title: getTranslation('FactoryReset'),
      content: getTranslation('FactoryReset-dialog-message'),
      buttons: {
        [getTranslation('Decline')]: {},
        [`${getTranslation('Yes')} , ${
          getTranslation('Continue')
        }`]: {
          click: () => {
            FactoryReset()
          },
          important: true
        }
      }
    })
  },
  removeScreen: function () {
    let content_editors = ''
    for (i = 0; i < editor_screens.length; i++) {
      content_editors += `
 			<div onclick="if(screens.remove('${
  editor_screens[i].id
}')){this.remove();}  " class="section-3" style="width:60px; height:100px; background:var(--accentColor);"></div>
 			`
    }
    new Dialog({
      id: 'remove_screen',
      title: getTranslation('Dialog.RemoveScreen.title'),
      content: `<div style="overflow: auto;min-width: 100%;height: auto;overflow: auto;white-space: nowrap; display:flex;" >${content_editors}</div>`,
      buttons: {
        [getTranslation('Accept')]: {}
      }
    })
  },
  closingFileWarn: function (ele) {
    new Dialog({
      id: 'saving_file_warn',
      title: getTranslation('Warn'),
      content: getTranslation('FileExit-dialog-message'),
      buttons: {
        [getTranslation(
          'FileExit-dialog-button-accept'
        )]: {
          click: () => {
            closeTab(ele.getAttribute('tabid'), true)
          }
        },
        [getTranslation('Cancel')]: {},
        [getTranslation('FileExit-dialog-button-deny')]: {
          click: () => {
            saveFile()
          },
          important: true
        }
      }
    })
  },
  addContextMenu: function (panel) {
    Object.keys(panel).forEach(function (key) {
      context_menu_list_text[key] = panel[key]
    })
  },
  toggleFullScreen: function (status) {
    g_window.setFullScreen(status)
  },
  toggleZenMode: function () {
    if (editor_mode == 'zen') {
      editor_mode = 'normal'
      document.getElementById('explorer_app').style =
            'visibility: visible; width:210px; display:block;'
      document.getElementById('editor_resizer').style = ' display:block;'
    } else {
      editor_mode = 'zen'
      document.getElementById('explorer_app').style =
            'visibility: hidden; width:0px; display:none;'
      document.getElementById('editor_resizer').style = ' width:0; display:none;'
    }
  },
  deleteLog: function () {
    fs.writeFile(logDir, '[]', err => {})
  },
  toggleAutoCompletation: function () {
    current_config['autoCompletionPreferences'] =
         current_config['autoCompletionPreferences'] == 'activated'
           ? 'desactivated'
           : 'activated'
  },
  toggleLineWrapping: function () {
    if (current_config['lineWrappingPreferences'] == 'activated') {
      for (i = 0; i < editors.length; i++) {
        if (editors[i].editor != undefined) {
          editors[i].editor.setOption('lineWrapping', false)
          editors[i].editor.refresh()
        }
      }
      current_config['lineWrappingPreferences'] = 'desactivated'
    } else {
      for (i = 0; i < editors.length; i++) {
        if (editors[i].editor != undefined) {
          editors[i].editor.setOption('lineWrapping', true)
          editors[i].editor.refresh()
        }
      }
      current_config['lineWrappingPreferences'] = 'activated'
    }
  },
  toggleHighlighting: function () {
    if (g_highlighting == 'activated') {
      for (i = 0; i < editors.length; i++) {
        if (editors[i].editor != undefined) {
          editors[i].editor.setOption('mode', 'text/plain')
          editors[i].editor.refresh()
        }
      }
      g_highlighting = 'desactivated'
    } else {
      for (i = 0; i < editors.length; i++) {
        if (editors[i].editor != undefined) {
          updateCodeMode(editors[i].editor, path)
        }
      }
      g_highlighting = 'activated'
    }
  },
  useSystemAccent: function () {
    const tinycolor = require('tinycolor2')
    if (current_config.accentColorPreferences == 'manual') {
      current_config['accentColorPreferences'] = 'system'
      try {
        document.documentElement.style.setProperty(
          '--accentColor',
          '#' + systemPreferences.getAccentColor()
        )
        document.documentElement.style.setProperty(
          '--accentDarkColor',
          tinycolor(systemPreferences.getAccentColor())
            .darken()
            .toString()
        )
        document.documentElement.style.setProperty(
          '--accentLightColor',
          tinycolor(systemPreferences.getAccentColor())
            .brighten()
            .toString()
        )
      } catch (err) {
        // Returns an error = system is not compatible, Linux-based will probably throw that error
        new Notification({
          title: 'Warn',
          content: getTranslation('SystemAccentColor.Error1')
        })
        return
      }
      if (themeObject.type == 'custom_theme') {
        new Notification({
          title: 'Warn',
          content: getTranslation('SystemAccentColor.Error2')
        })
      }
    } else {
      document.documentElement.style.setProperty(
        '--accentColor',
        themeObject.colors.accentColor
      )
      document.documentElement.style.setProperty(
        '--accentDarkColor',
        themeObject.colors.accentDarkColor
      )
      document.documentElement.style.setProperty(
        '--accentLightColor',
        themeObject.colors.accentLightColor
      )
      current_config['accentColorPreferences'] = 'manual'
    }
  },
  toggleAnimations () {
    if (current_config.animationsPreferences == 'activated') {
      const style = document.createElement('style')
      style.innerText = `*{-webkit-transition: none !important;
          -moz-transition: none !important;
          -o-transition: none !important;
          transition: none !important;
          animation:0;}`
      style.id = '_ANIMATIONS'
      document.documentElement.style.setProperty('--scalation', '1')
      document.documentElement.appendChild(style)
      current_config.animationsPreferences = 'desactivated'
    } else {
      document.getElementById('_ANIMATIONS').remove()
      document.documentElement.style.setProperty('--scalation', '0.98')
      current_config.animationsPreferences = 'activated'
    }
  },
  setZoom (_value) {
    if (_value >= 0 && _value <= 50) {
      current_config.appZoom = _value
      webFrame.setZoomFactor(current_config.appZoom / 25)
      saveConfig()
    }
  },
  editorSearch () {
    if (editor != undefined) {
      CodeMirror.commands.find(editor)
    }
  },
  editorReplace () {
    if (editor != undefined) {
      CodeMirror.commands.replace(editor)
    }
  },
  editorJumpToLine () {
    if (editor != undefined) {
      CodeMirror.commands.jumpToLine(editor)
    }
  },
  restartApp () {
    remote.app.relaunch()
    remote.app.exit(0)
  },
  isProduction () {
    return (path.basename(__dirname) !== 'Graviton-Editor' && path.basename(__dirname) !== 'Graviton-App')
  },
  resizeTerminals () {
    if (terminal != (null||undefined)) fit.fit(terminal.xterm)
  },
  toggleFullScreen () {
    if (graviton.isProduction()) {
      if (g_window.isFullScreen() === false) {
        g_window.setFullScreen(true)
      } else {
        g_window.setFullScreen(false)
      }
    }
  },
  toggleMenus () {
    if (menus_showing === true) {
      document.getElementById('dropmenus_app').style = 'visibility:hidden; width:0;'
      menus_showing = false
    } else {
      document.getElementById('dropmenus_app').style = ''
      menus_showing = true
    }
  },
  getPlugin: function (plugin_name) {
    for (i = 0; i < full_plugins.length; i++) {
      if (full_plugins[i].package.name == plugin_name) {
        return {
          repo: full_plugins[i],
          local: (function () {
            for (let a = 0; a < plugins_list.length; a++) {
              if (plugins_list[a].name == plugin_name) {
                return plugins_list[a]
              }
            }
            return undefined
          })(),
          database: (function () {
            for (let a = 0; a < plugins_dbs.length; a++) {
              if (plugins_dbs[a].plugin_name == plugin_name) {
                return plugins_dbs[a].db
              }
            }
            return undefined
          })()
        }
      }
    }
    for (let a = 0; a < plugins_list.length; a++) {
      if (plugins_list[a].name == plugin_name) {
        return {
          local: plugins_list[a],
          repo: undefined
        }
      }
    }
  },
  getTypePlugin(config){
      if (config.icons!=undefined) {
        return "custom_theme"
      }
      if (config.css!=undefined) {
        return "custom_theme"
      }
      if (config.colors!=undefined) {
        return "theme"
      }
      if (config.main!=undefined) {
        return "plugin"
      }

  },
  windowContent (id, content) {
    document.getElementById(`${id}_body`).innerHTML = content
  },
  toggleBounceEffect () {
    if (current_config.bouncePreferences == 'activated') {
      current_config.bouncePreferences = 'desactivated'
    } else {
      current_config.bouncePreferences = 'activated'
    }
  },
  setTitle (title) {
    if (graviton.currentOS().codename == 'win32') {
      document.getElementById('title_directory').children[0].innerText =
            title + ' · Graviton'
    } else {
      g_window.setTitle(title + ' · Graviton')
    }
  },
  consoleInfo (message) {
    console.log('%c INFO::', 'color:#0066FF;', message)
  },
  consoleWarn (message) {
    console.log('%c WARN::', 'color:#F6B149;', message)
  },
  getTemplate (name, code) {
    const result = `${code != undefined ? code : ''} ${templates[name]}`
    try {
      eval(result)
    } catch (error) {
      graviton.throwError('Cannot load the current template: ' + error);
      if(!graviton.isProduction()){
        console.log(result)
      }
      return ''
    }
    return eval(result)
  },
  focusScreen (screen_id) {
    for (i = 0; i < editor_screens.length; i++) {
      if (editor_screens[i].id == screen_id) {
        current_screen.id = screen_id
      }
    }
  },
  getTerminal(){
    /*
      This is to avoid API issues whern there are breaking changes.
    */
    return terminal;
  },
  getLanguage(){
    return getLanguageName(
      getFormat(path.basename(graviton.getCurrentFile().path)).lang != "unknown"
        ? getFormat(path.basename(graviton.getCurrentFile().path)).lang
        : path
            .basename(graviton.getCurrentFile().path)
            .split(".")
            .pop()
    )
  }
}

function floatingWindow ([xSize, ySize], content) {
  // Method to create flaoting windows
  const floating_window = document.createElement('div')
  floating_window.style.height = ySize + 'px'
  floating_window.style.width = xSize + 'px'
  floating_window.classList = 'floating_window'
  floating_window.innerHTML = content
  document.body.appendChild(floating_window)
}
document.addEventListener('mousedown', function (event) {
  if (editor_booted === true) {
    if (event.button === 2) {
      graviton.closeDropmenus() // Close opened dropmenu
      if (document.getElementById('context_menu') !== null) {
        document.getElementById('context_menu').remove()
      }
      const context_menu = document.createElement('div')
      const line_space = document.createElement('span')
      line_space.classList = 'line_space_menus'
      context_menu.setAttribute('id', 'context_menu')
      context_menu.style = `left:${event.pageX + 1}px; top:${event.pageY +
        1}px`
      switch (event.target.getAttribute('elementType')) {
        case 'file':
          Object.keys(context_menu_list_file).forEach(function (
            key,
            index
          ) {
            if (context_menu_list_file[key] != '*line') {
              const button = document.createElement('button')
              button.classList.add('part_of_context_menu')
              button.innerText = getTranslation(key)
              button.setAttribute('target', event.target.id)
              context_menu.appendChild(button)
              sleeping(1).then(() => {
                button.onclick = context_menu_list_file[key]
              })
            } else {
              const span = document.createElement('span')
              span.classList = 'line_space_menus'
              context_menu.appendChild(span)
            }
          })
          break
        case 'tab':
          Object.keys(context_menu_list_tabs).forEach(function (key, index) {
            if (context_menu_list_tabs[key] != '*line') {
              const button = document.createElement('button')
              button.classList.add('part_of_context_menu')
              button.innerText = getTranslation(key)
              button.setAttribute('target', event.target.id)
              context_menu.appendChild(button)
              sleeping(1).then(() => {
                button.onclick = context_menu_list_tabs[key]
              })
            } else {
              const span = document.createElement('span')
              span.classList = 'line_space_menus'
              context_menu.appendChild(span)
            }
          })
          break
        case 'directory':
          Object.keys(context_menu_directory_options).forEach(function (
            key,
            index
          ) {
            if (context_menu_directory_options[key] != '*line') {
              const button = document.createElement('button')
              button.classList.add('part_of_context_menu')
              button.innerText = getTranslation(key)
              button.setAttribute('target', event.target.id)

              sleeping(1).then(() => {
                button.addEventListener('click', context_menu_directory_options[key])
              })
              context_menu.appendChild(button)
            } else {
              const span = document.createElement('span')
              span.classList = 'line_space_menus'
              context_menu.appendChild(span)
            }
          })
          break
        default:
          Object.keys(context_menu_list_text).forEach(function (key, index) {
            if (context_menu_list_text[key] != '*line') {
              const button = document.createElement('button')
              button.classList.add('part_of_context_menu')
              if (index < 2) {
                button.innerText = getTranslation(key)
                context_menu.appendChild(button)
              } else {
                if (index == 2) {
                  context_menu.appendChild(line_space)
                }
                button.innerText = key
                context_menu.appendChild(button)
              }
              sleeping(1).then(() => {
                button.onclick = context_menu_list_text[key]
              })
            } else {
              const span = document.createElement('span')
              span.classList = 'line_space_menus'
              context_menu.appendChild(span)
            }
          })
      }
      document.body.appendChild(context_menu)
    } else if (
      event.button === 0 &&
         !(
           event.target.matches('#context_menu') ||
            event.target.matches('.part_of_context_menu')
         ) &&
         document.getElementById('context_menu') !== null
    ) {
      document.getElementById('context_menu').remove()
    }
    if (!event.target.matches('.floating_window')) {
      if (document.getElementsByClassName('floating_window').length != 0) {
        for (
          i = 0; i < document.getElementsByClassName('floating_window').length; i++
        ) {
          document.getElementsByClassName('floating_window')[i].remove()
        }
      }
    }
  }
})

window.onresize = function () {
  graviton.resizeTerminals()
}

graviton.copyText = (content) => {
  const text = document.createElement('textarea')
  text.style = 'height:0.1px; width:0.1px; opacitiy:0; padding:0; border:0; margin:0; outline:0;'
  text.innerText = content
  document.body.appendChild(text)
  text.focus()
  text.select()
  document.execCommand('copy')
  text.remove()
}

const preload = array => {
  // Preload images when booting
  for (i = 0; i < array.length; i++) {
    document.body.innerHTML += `
     <img id="${array[i]}"src="${array[i]}" style="visibility:hidden;"></img>`
    document.getElementById(array[i]).remove()
  }
}

graviton.changeExplorerPosition = (position) => {
  const content_app = document.getElementById('content_app')
  if (position === 'right') {
    content_app.setAttribute('explorerPosition', 'right')
    content_app.insertBefore(document.getElementById('editors'), content_app.children[0])
    content_app.insertBefore(document.getElementById('explorer_app'), content_app.children[3])
  } else {
    content_app.setAttribute('explorerPosition', 'left')
    content_app.insertBefore(document.getElementById('explorer_app'), content_app.children[0])
    content_app.insertBefore(document.getElementById('editors'), content_app.children[3])
  }
  current_config.explorerPosition = position
}

graviton.setEditorFontSize = function (new_size) {
  current_config.fontSizeEditor = `${new_size}`
  if (Number(current_config.fontSizeEditor) < 5) {
    current_config.fontSizeEditor = '5'
  }
  document.documentElement.style.setProperty(
    '--editor-font-size',
    `${current_config.fontSizeEditor}px`
  ) // Update settings from window
  for (i = 0; i < editors.length; i++) {
    if (editors[i].editor != undefined) editors[i].editor.refresh()
  }
  saveConfig()
}

graviton.loadControlButtons = () => {
  if (graviton.currentOS().codename == 'win32') {
    document.getElementById('controls').innerHTML = graviton.getTemplate('control_buttons')
    g_window.on('maximize', (e, cmd) => {
      const button = document.getElementById('maximize')
      button.setAttribute('onclick', 'g_window.unmaximize();')
    })
    g_window.on('unmaximize', (e, cmd) => {
      const button = document.getElementById('maximize')
      button.setAttribute('onclick', 'g_window.maximize();')
    })
  } else {
    document.getElementById('controls').innerHTML = ' '
    document.getElementById('controls').setAttribute('os', 'not_windows')
  }
}

graviton.closeDropmenus = function () {
  const dropdowns = document.getElementsByClassName('dropdown-content')
  for (i = 0; i < dropdowns.length; i++) {
    const openDropdown = dropdowns[i]
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.replace('show', 'hide')
      anyDropON = null
    }
  }
}

function Control({text,hint}){
  this.text = text;
  const controlSpan = document.createElement("span");
  controlSpan.innerText = text;
  if(hint!=undefined) controlSpan.title = hint;
  document.getElementById(current_screen.id).children[2].appendChild(controlSpan);
  this.setText = (newText)=>{
    controlSpan.innerText = newText;
  }
  this.setHint = (newHint)=>{
    controlSpan.title = newHint;
  }
  this.hide = ()=>{
    controlSpan.style.display = "none";
  }
  this.show = ()=>{
    controlSpan.style.display = "block";
  }
}
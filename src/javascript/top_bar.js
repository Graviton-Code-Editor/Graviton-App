/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

'use strict'

/* <-- Default NavBar >-- */
let full_plugins = []
let anyDropON = null
const File = new dropMenu({
  id: 'file',
  translation: true
})
const Tools = new dropMenu({
  id: 'tools',
  translation: true
})
const Edit = new dropMenu({
  id: 'edit',
  translation: true
})
const Editor = new dropMenu({
  id: 'editor',
  translation: true
})
const WindowDM = new dropMenu({
  id: 'window',
  translation: true
})
const Help = new dropMenu({
  id: 'help',
  translation: true
})

File.setList({
  button: 'File',
  list: {
    'Open Folder': () => openFolder(),
    'Open File': () => openFile(),
    'Save As': () => saveFileAs(),
    Save: {
      click: () => saveFile(),
      hint: 'Ctrl+S'
    },
    '*line': '',
    'New Project': () => NewProject(),
    space1: '*line',
    Exit: {
      click: () => remote.app.exit(0),
      icon: 'exit'
    }
  }
})
Edit.setList({
  button: 'Edit',
  list: {
    Undo: {
      click: () => {
        if (editor != undefined)editor.execCommand('undo')
      },
      hint: 'Ctrl+Z'
    },
    Redo: {
      click: () => {
        if (editor != undefined)editor.execCommand('redo')
      },
      hint: 'Ctrl+Y'
    },
    '1a': '*line',
    Search: {
      click: () => graviton.editorSearch(),
      hint: 'Ctrl+F'
    },
    Replace: {
      click: () => graviton.editorReplace(),
      hint: 'Ctrl+Shit+R'
    },
    JumpToLine: {
      click: () => graviton.editorJumpToLine(),
      hint: 'Alt+G'
    }
  }
})
Tools.setList({
  button: 'Tools',
  list: {
    Market: () => {
      extensions.openStore(function (err) {
        extensions.navigate('all', err)
      })
    },
    ShowWelcome: () => openWelcome(),
    'Zen Mode': {
      click: () => graviton.toggleZenMode(),
      hint: 'Ctrl+E'
    },
    '2a': '*line',
    Settings: {
      click: () => {
        Settings.open()
        Settings.navigate('customization')
      },
      icon: 'settings'
    }

  }
})

Editor.setList({
  button: 'Editor',
  list: {
    DefaultView: () => screens.default(),
    SplitScreen: {
      click: () => screens.add(),
      icon: 'split_screen',
      hint: 'Ctrl+N'
    },
    RemoveScreen: {
      click: () => graviton.removeScreen(),
      icon: 'remove_screen',
      hint: 'Ctrl+L'
    },
    a2: '*line',
    openTerminal: {
      click: () => commanders.terminal(),
      icon: 'new_terminal',
      hint: 'Ctrl+T'
    },
    hideTerminal: {
      click: () => commanders.hide(terminal.id),
      hint: 'Ctrl+H'
    },
    closeTerminal: {
      click: () => commanders.closeTerminal(),
      icon: 'close_terminal',
      hint: 'Ctrl+U'
    }
  }
})
WindowDM.setList({
  button: 'Window',
  list: {
    'Developer Tools': () => graviton.openDevTools(),
    '1a': '*line',
    HideMenus: {
      click: () => {
        graviton.toggleMenus()
        new Notification({
          title: getTranslation('Tip'),
          content: getTranslation('ToggleMenuTipMessage')
        })
      },
      hint: 'Ctrl+Tab'
    },
    '2a': '*line',
    IncreaseZoom: {
      click: () => graviton.setZoom(parseInt(current_config.appZoom) + 3),
      icon: 'plus'
    },
    DicreaseZoom: {
      click: () => graviton.setZoom(parseInt(current_config.appZoom) + -3),
      icon: 'minus'
    },
    DefaultZoom: {
      click: () => graviton.setZoom(25),
      icon: 'default_zoom'
    },
    Fullscreen: {
      click: () => graviton.toggleFullScreen(),
      hint: 'F11'
    }
  }
})
Help.setList({
  button: 'Help',
  list: {
    Issues: () =>
      shell.openExternal(
        'https://github.com/Graviton-Code-Editor/Graviton-App/issues'
      ),
    'Source Code': () =>
      shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App'),
    'TelegramChannel': () => shell.openExternal('https://t.me/gravitoneditor'),
    'a1': '*line',
    Donate: () => shell.openExternal('https://www.paypal.me/mkenzo8'),
    Twitter: () => shell.openExternal('https://twitter.com/gravitoneditor'),
    FAQs: () => shell.openExternal('https://www.graviton.ml/faqs'),
    Website: () => shell.openExternal('https://www.graviton.ml'),
    'a2': '*line',
    Changelog: () => graviton.dialogChangelog(),
    About: {
      click: () => graviton.dialogAbout(),
      icon: 'info'
    }
  }
})

function interact_dropmenu (id) {
  const dropdowns = document.getElementsByClassName('dropdown-content')
  for (i = 0; i < dropdowns.length; i++) {
    if (dropdowns[i].id != id) {
      dropdowns[i].classList.replace('show', 'hide') // Close the other menus
    } else {
      if (dropdowns[i].classList.contains('show')) {
        dropdowns[i].classList.replace('show', 'hide') // Hide the clicked menu
        anyDropON = null
      } else {
        dropdowns[i].classList.replace('hide', 'show') // Show the clicked menu
        anyDropON = id
      }
    }
  }
}

window.onclick = function (event) {
  if (
    !(event.target.matches('.dropbtn') || event.target.matches('.icon_border'))
  ) {
    graviton.closeDropmenus()
  }
  if (!event.target.matches('.option')) {
    document.getElementById('context').parentElement.style = 'display:none'
  }
  if (!event.target.matches('#context_menu')) {
    if (document.getElementById('context_menu') != undefined) { document.getElementById('context_menu').remove() }
  }
}

/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanztor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

'use strict'

let welcome_window

function openWelcome() {
  if (graviton.isProduction() == true) {
    if (remote.process.argv[1] != undefined) {
      const dir = path.resolve(remote.process.argv[1])
      loadDirs(dir, 'g_directories', true)
      if (error_showed == false) DeleteBoot()
      return
    }
  }
  welcome_window = new Window({
    id: 'welcome_window',
    content: graviton.getTemplate('welcome')
  })
  welcome_window.launch()
  if (document.getElementById('recent_projects') != null) {
    for (i = 0; i < log.length; i++) {
      const project = document.createElement('div')
      project.setAttribute('class', 'section-2')
      project.setAttribute(
        'onclick',
        `loadDirs('${log[i].Path.replace(
          /\\/g,
          '\\\\'
        )}','g_directories','yes'); welcome_window.close();`
      )
      project.innerText = log[i].Name
      const description = document.createElement('p')
      description.innerText = log[i].Path
      description.setAttribute('style', 'font-size:12px;')
      project.appendChild(description)
      if (document.getElementById('recent_projects') == undefined) return
      document.getElementById('recent_projects').appendChild(project)
      document.getElementById('clear_log').style = ''
    }
  }
  if (error_showed == false) DeleteBoot()
}
const Setup = {
  open: function () {
    for (i = 0; i < languages.length + 1; i++) {
      if (i == languages.length) {
        loadLanguage(languages[0]) // Load english in case Graviton doesn't support the system's language
      } else if (navigator.language.includes(languages[i].locale)) {
        loadLanguage(languages[i].g_l) // Load system language
      }
    }
    const all = document.createElement('div')
    all.id = 'graviton_setup'
    all.innerHTML = `
  	<div class="body_window_full">
  		<div id="body_window_full">
  		</div>
  	</div>`
    document.body.appendChild(all)
    Setup.navigate('languages')
    graviton.deleteLog()
    if (error_showed == false) DeleteBoot()
  },
  close: function () {
    document.getElementById('graviton_setup').remove()
    current_config.justInstalled = false
    saveConfig()
  },
  navigate: function (number) {
    switch (number) {
      case 'languages':
        document.getElementById('body_window_full').innerHTML = graviton.getTemplate('setup_languages')
        for (i = 0; i < languages.length; i++) {
          const languageDiv = document.createElement('div')
          languageDiv.setAttribute('class', 'language_div')
          languageDiv.setAttribute(
            'onclick',
            "loadLanguage('" + languages[i].name + "'); selectLang(this);"
          )
          languageDiv.innerText = languages[i].name
          if (languages[i].name === current_config.language.name) {
            selectLang(languageDiv)
          }
          document.getElementById('language_list').appendChild(languageDiv)
        }
        break
      case 'themes':
        document.getElementById('body_window_full').innerHTML = graviton.getTemplate('setup_themes')
        break
      case 'additional_settings':
        document.getElementById('body_window_full').innerHTML = graviton.getTemplate('setup_additional_settings')
        break
      case 'welcome':
        if (!graviton.isProduction()) {
          new Notification({
            title: 'Graviton',
            content: 'You are being on dev mode. The .graviton folder is created in the parent folder of the source. Press Ctrl+shift+i or click the button to open dev tools.',
            delay: '10000',
            buttons: {
              'Dev tools': {
                click: function () {
                  graviton.openDevTools()
                }
              },
              'Close': {}
            }
          })
        }
        document.getElementById('body_window_full').innerHTML = graviton.getTemplate('setup_welcome')
        break
    }
  }
}
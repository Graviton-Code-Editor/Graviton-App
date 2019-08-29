/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
'use strict'

const Settings = {
  open: function () {
    const settings_window = new Window({
      id: 'settings_window',
      content: `
      <div class="g_lateral_panel">
        <h2 class="window_title window_title2 translate_word"  idT="Settings">${
  getTranslation('Settings')
}</h2> 
        <div id="navbar1" class="navbar">
          <button id="navB1" onclick="Settings.navigate('customization')" class="translate_word" idT="Customization">${getTranslation(
    'Customization'
  )}</button>
          <button id="navB2" onclick="Settings.navigate('languages')" class="translate_word" idT="Languages">${getTranslation(
    'Languages'
  )}</button>
          <button id="navB3" onclick="Settings.navigate('editors')" class="translate_word" idT="Editor">${getTranslation(
    'Editor'
  )}</button>
          <button id="navB4" onclick="Settings.navigate('advanced')" class="translate_word" idT="Advanced">${getTranslation(
    'Advanced'
  )}</button>
          <button id="navB5" onclick="Settings.navigate('about')" class="translate_word" idT="About">${getTranslation(
    'About'
  )}</button>
        </div>
      </div>
      <div id="_content1" class="window_content"></div>`,
      onClose: 'saveConfig();'
    })
    settings_window.launch()
  },
  navigate: function (num) {
    for (i = 0; i < document.getElementById('navbar1').children.length; i++) {
      document.getElementById('navbar1').children[i].classList.remove('active')
    }
    switch (num) {
      case 'customization':
        document.getElementById('_content1').innerHTML = graviton.getTemplate('settings_customization')
        if (document.getElementById('theme_list') != null) {
          themes.forEach((theme) => {
            const themeDiv = document.createElement('div')
            themeDiv.setAttribute('class', 'theme_div')
            themeDiv.setAttribute(
              'onclick',
              `graviton.setTheme('${theme.name}'); selectTheme('1',this); saveConfig();`
            )
            themeDiv.innerHTML = `
              <p style="margin:11px 0; font-size:17px; line-height:2px;">${
                  theme.name
                }</p>
                              <p style="font-size:14px;">${getTranslation('MadeBy') +
                              theme.author}</p>
                              <p style="font-size:13px; line-height:2px;">${
                  theme.description
                }</p>
                              <div class="accent" style="background:${
                  theme.colors['accentColor']
                };"></div>
            `
            if (theme.name === current_config.theme) {
              selectTheme('1', themeDiv)
            }
            document.getElementById('theme_list').appendChild(themeDiv)
          })
          if (themes.length == 0) {
            document.getElementById('theme_list').innerHTML = `
            <span>No themes are installed. Go <span class="link" onclick="closeWindow('settings_window');extensions.openStore(function(){extensions.navigate('all')})" >Market</span> and explore ! <img draggable="false" class="emoji-medium" src="src/openemoji/1F9D0.svg"> </span>
            `
          }
        }
        document.getElementById('navB1').classList.add('active')
        break
      case 'languages':
        document.getElementById('_content1').innerHTML = graviton.getTemplate('settings_languages')
        if (document.getElementById('language_list') != null) {
          languages.forEach((lang) => {
            const languageDiv = document.createElement('div')
            languageDiv.setAttribute('class', 'language_div')
            languageDiv.setAttribute(
              'onclick',
              `loadLanguage('${lang.name}'); selectLang(this); saveConfig();`
            )
            languageDiv.innerText = lang.name
            if (lang.name === current_config.language.name) {
              selectLang(languageDiv)
            }
            document.getElementById('language_list').appendChild(languageDiv)
          })
        }
        document.getElementById('navB2').classList.add('active')
        break
      case 'editors':
        document.getElementById('_content1').innerHTML = graviton.getTemplate('settings_editor')
        document.getElementById('navB3').classList.add('active')
        break
      case 'advanced':
        document.getElementById('_content1').innerHTML = graviton.getTemplate('settings_advanced')
        document.getElementById('navB4').classList.add('active')
        break
      case 'about':
        document.getElementById('_content1').innerHTML = graviton.getTemplate('settings_about')
        if (new_update != false) {
          if (document.getElementById('about_section') != null) {
            document.getElementById('about_section').innerHTML += `
            <p style="color:var(--accentColor);">New update is live! - ${
              new_update[GravitonInfo.state]['version']
            }</p>
            `
          }
        }
        document.getElementById('navB5').classList.add('active')
        break
    }
  }
}

function updateCustomization () {
  current_config.appZoom = document.getElementById('slider_zoom').value
  webFrame.setZoomFactor(current_config.appZoom / 25)
  current_config.blurPreferences = document.getElementById('slider_blur').value
  if (current_config.blurPreferences != 0) {
    document.documentElement.style.setProperty(
      '--blur',
      `${current_config.blurPreferences}px`
    )
  } else {
    document.documentElement.style.setProperty('--blur', `none`)
  }
  saveConfig()
}

function updateSettings () {
  document.documentElement.style.setProperty(
    '--editor-font-size',
    `${current_config.fontSizeEditor}px`
  ) // Update settings from start
  webFrame.setZoomFactor(current_config.appZoom / 25)
  if (current_config.blurPreferences != 0) {
    document.documentElement.style.setProperty(
      '--blur',
      `${current_config.blurPreferences}px`
    )
  } else {
    document.documentElement.style.setProperty('--blur', `none`)
  }
}

function factory_reset_dialog () {
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
}

function selectLang (lang) {
  const languages_divs = document.getElementsByClassName('language_div')
  for (i = 0; i < languages_divs.length; i++) {
    languages_divs[i].classList.remove('active')
  }
  lang.classList.add('active')
}

function selectTheme (from, theme) {
  let themes_divs
  switch (from) {
    case '1':
      themes_divs = document.getElementsByClassName('theme_div')
      break
    case '2':
      themes_divs = document.getElementsByClassName('theme_div2')
      break
  }
  for (i = 0; i < themes_divs.length; i++) {
    themes_divs[i].classList.remove('active')
  }
  theme.classList.add('active')
}

class Switch extends HTMLElement {
  constructor () {
    super()
  }
  connectedCallback () {
    this.innerHTML = `
      <div class="${this.getAttribute('class')} switch">
      	<div></div>
      </div>`
    this.addEventListener('click', function () {
      const dot = this.children[0]
      if (this.classList.contains('disabled') === false) {
        if (this.getState(this)) {
          this.classList.replace('activated', 'desactivated')
          dot.classList.replace('activated', 'desactivated')
        } else {
          this.classList.replace('desactivated', 'activated')
          dot.classList.replace('desactivated', 'activated')
        }
      }
    })
  }
  getState (element) {
    if (element.classList.contains('disabled')) {
      return 'disabled'
    } else {
      return element.classList.contains('activated')
    }
  }
}
window.customElements.define('gv-switch', Switch)

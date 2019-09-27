/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanztor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

'use strict'

module.exports = {
  Settings: {
    open: function () {
      /*
      const settings_window = new Window({
        id: 'settings_window',
        content: `
        <div class="g_lateral_panel">
          <h2 class="window_title window_title2 translate_word"  idT="Settings">${getTranslation(
    'Settings'
  )}</h2> 
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
      })*/
      
      const settings_window = new Window({
        id: 'settings_window',
        content: `
        <gv-sidemenu>
          <side-menu>
            <side-title class="translate_word" idT="Settings">${getTranslation("Settings")}</side-title>
            <menu-button href=Customization onclick="Settings.navigate('customization')" class="translate_word" idT="Customization" default >${getTranslation("Customization")}</menu-button>
            <menu-button href=Languages onclick="Settings.navigate('languages');" class="translate_word" idT="Languages">${getTranslation("Languages")}</menu-button>
            <menu-button href=Editor onclick="Settings.navigate('editor');" class="translate_word" idT="Editor">${getTranslation("Editor")}</menu-button>
            <menu-button href=Advanced onclick="Settings.navigate('advanced');" class="translate_word" idT="Editor">${getTranslation("Advanced")}</menu-button>
            <menu-button href=About onclick="Settings.navigate('about');" class="translate_word" idT="About">${getTranslation("About")}</menu-button>
          </side-menu>
          <side-content id=settings_content>
            <side-page id=settings.customization href=Customization default></side-page>
            <side-page id=settings.languages href=Languages></side-page>
            <side-page id=settings.editor href=Editor></side-page>
            <side-page id=settings.advanced href=Advanced></side-page>
            <side-page id=settings.about href=About></side-page>
          </side-content>
        </gv-sidemenu>`,
        onClose: 'saveConfig();'
      })
      settings_window.launch()
      elasticContainer.append(document.getElementById("settings_content"))
    },
    navigate: function (num) {
      switch (num) {
        case 'customization':
          document.getElementById('settings.customization').innerHTML = graviton.getTemplate(
            'settings_customization'
          )
          if (document.getElementById('theme_list') != null) {
            themes.forEach(theme => {
              const themeDiv = document.createElement('div')
              themeDiv.setAttribute('class', 'theme_div')
              themeDiv.setAttribute(
                'onclick',
                `graviton.setTheme('${theme.name}'); selectTheme('1',this); saveConfig();`
              )
              themeDiv.innerHTML = `
                <p style="margin:0px 0; font-size:17px;">${
                  theme.name
                }</p>
                                <p style="font-size:14px; margin:12px 0px;">${getTranslation(
                    'MadeBy'
                  ) + theme.author}</p>
                                <p style="font-size:13px; margin:12px 0px;">${
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
              elasticContainer.append(document.getElementById('theme_list'), 'horizontal')
            })
            if (themes.length == 0) {
              document.getElementById('theme_list').innerHTML = `
              <span style="font-size:14px">No themes are installed. Go <span class="link" onclick="closeWindow('settings_window');Market.open(function(){Market.navigate('all')})" >Market</span> and explore ! <img draggable="false" class="emoji-medium" src="src/openemoji/1F9D0.svg"> </span>
              `
            }
          }
          break
        case 'languages':
          document.getElementById('settings.languages').innerHTML = graviton.getTemplate(
            'settings_languages'
          )
          if (document.getElementById('language_list') != null) {
            languages.forEach(lang => {
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
          break
        case 'editor':
          document.getElementById('settings.editor').innerHTML = graviton.getTemplate(
            'settings_editor'
          )
          break
        case 'advanced':
          document.getElementById('settings.advanced').innerHTML = graviton.getTemplate(
            'settings_advanced'
          )
          break
        case 'about':
          document.getElementById('settings.about').innerHTML = graviton.getTemplate(
            'settings_about'
          )
          if (new_update != false) {
            if (document.getElementById('about_section') != null) {
              document.getElementById('about_section').innerHTML += `
              <p style="color:var(--accentColor);">New update is live! - ${
  new_update[GravitonInfo.state]['version']
}</p>
              `
            }
          }
          break
      }
    },
    refresh: () => {
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
  }
}

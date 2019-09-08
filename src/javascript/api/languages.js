/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
'use strict'
/**
 *
 * @desc Load the languages JSON files and push it to an array
 *
 */

module.exports = {
  loadLanguage: language => {
    languages.map((item, index) => {
      if (item['name'] === language) {
        current_config.language = item
        const toTranslate = document.getElementsByClassName('translate_word')
        for (i = 0; i < toTranslate.length; i++) {
          toTranslate[i].innerText = getTranslation(toTranslate[i].getAttribute('idT'))
        }
      }
    })
  },
  getTranslation: text => {
    if (current_config.language.strings[text] === undefined) {
      let output = text
      languages.forEach((lang) => {
        if (lang.name === 'english') {
          output = lang.strings[text] !== undefined ? lang.strings[text] : text
        }
      })
      return output
    } else {
      return current_config.language.strings[text]
    }
  }
}

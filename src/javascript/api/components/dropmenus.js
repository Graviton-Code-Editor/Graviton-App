/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
'use strict'

module.exports = {
  Dropmenu: function ({id,translation = false}) {
    if (typeof [...arguments] !== 'object') {
      graviton.throwError('Parsed argument is not object.')
      return
    }
    this.id = id
    this.translation = translation // Detect if translation is enabled on the plugin's dropmenu
    this.setList = function (panel) {
      /*
        * Dropmenu constructor
        * @param {string} button  Dropmenu's button name
        * @param {object} list    (optional) Dropmenu's buttons list
        * @param {string} custom  (optional) Dropmenu's HTML content
        */
      if (document.getElementById(this.id + '_dropbtn') != undefined) {
        const droplist = document.getElementById(this.id + '_dropbtn')
        droplist.innerHTML = '' // Remove current code and then add the updated one
        droplist.parentElement.children[0].innerText = panel.button
        droplist.parentElement.children[0].addEventListener(
          'mouseover',
          function () {
            if (anyDropON != null &&
              anyDropON != this.getAttribute('g_id') + '_dropbtn') {
              console.log(`${this.getAttribute('g_id')}_dropbtn`)
              interact_dropmenu(`${this.getAttribute('g_id')}_dropbtn`)
              this.focus()
            }
          },
          false
        )
        let last
        let toTransx = this.translation
        Object.keys(panel).forEach(function (attr) {
          if (
            panel[attr] == panel['list'] &&
            panel['list'] != undefined &&
            last != 'list'
          ) {
            // List
            last = 'list'
            Object.keys(panel['list']).forEach(function (key) {
              if (key == '*line') {
                droplist.innerHTML += `<span class="line_space_menus"></span>`
              } else {
                const icon =
                  typeof panel['list'][key] === 'string'
                    ? icons.empty
                    : panel['list'][key].icon != undefined
                      ? icons[panel['list'][key].icon]
                      : icons.empty
                const click =
                  typeof panel['list'][key] === 'string'
                    ? panel['list'][key]
                    : panel['list'][key].click
                const hint =
                  typeof panel['list'][key] === 'string'
                    ? ''
                    : panel['list'][key].hint
                const button = document.createElement('button')
                button.setAttribute('title', hint)
                button.id = Math.random()
                sleeping(1).then(() => {
                  if (document.getElementById(button.id) == null) return
                  document.getElementById(button.id).onclick = click
                })
                if (toTransx != true) {
                  button.innerHTML += `
                    <div>
                    ${icon}
                    </div>
                    <div>${key}</div>`
                } else {
                  button.innerHTML += `
                    <div>
                    ${icon}
                    </div>
                    <div class="translate_word" idT="${key.replace(/ +/g, '')}">
                        ${key}
                    </div>`
                }
                droplist.appendChild(button)
              }
            })
          }
          if (
            panel[attr] == panel['custom'] &&
            panel['custom'] != undefined &&
            last != 'custom'
          ) {
            // Custom
            droplist.innerHTML += panel['custom']
            last = 'custom'
          }
        })
      } else {
        const bar = document.getElementById('dropmenus_app')
        const newTab = document.createElement('div')
        const droplist = document.createElement('div')
        droplist.classList = 'dropdown-content hide'
        droplist.setAttribute('id', this.id + '_dropbtn')
        newTab.classList.add('dropdown')
        if (this.translation != true) {
          newTab.innerHTML = `
              <button g_id="${this.id}" onclick="interact_dropmenu('${
  this.id
}_dropbtn')" class="dropbtn" >${panel['button']}</button>`
        } else {
          newTab.innerHTML = `
                  <button g_id="${this.id}" class=" translate_word dropbtn " idT="${panel[
  'button'
].replace(/ +/g, '')}" onclick="interact_dropmenu('${
  this.id
}_dropbtn')"  >${panel['button']}</button>`
        }
        let last
        let toTransx = this.translation
        Object.keys(panel).forEach(function (attr) {
          if (
            panel[attr] == panel['list'] &&
            panel['list'] != undefined &&
            last != 'list'
          ) {
            // List
            last = 'list'
            Object.keys(panel['list']).forEach(function (key) {
              if (panel['list'][key] == '*line' || key == '*line') {
                droplist.innerHTML += `<span class="line_space_menus"></span>`
              } else {
                const icon =
                  typeof panel['list'][key] === 'string'
                    ? icons.empty
                    : panel['list'][key].icon != undefined
                      ? icons[panel['list'][key].icon]
                      : icons.empty
                const click =
                  typeof panel['list'][key] === 'function'
                    ? panel['list'][key]
                    : panel['list'][key].click
                const hint =
                  typeof panel['list'][key] === 'string'
                    ? ''
                    : panel['list'][key].hint == undefined
                      ? ''
                      : panel['list'][key].hint
                const button = document.createElement('button')
                button.setAttribute('title', hint)
                button.id = Math.random()
                sleeping(1).then(() => {
                  document.getElementById(button.id).onclick = click
                })
                if (toTransx != true) {
                  button.innerHTML += `
                    <div>
                    ${icon}
                    </div>
                    <div>${key}</div>
                    `
                } else {
                  button.innerHTML += `
                    <div>
                    ${icon}
                    </div>
                    <div class="translate_word" idT="${key.replace(/ +/g, '')}">
                      ${key}
                    </div>
                    `
                }
                droplist.appendChild(button)
              }
            })
          }
          if (
            panel[attr] == panel['custom'] &&
            panel['custom'] != undefined &&
            last != 'custom'
          ) {
            // Custom
            droplist.innerHTML += panel['custom']
            last = 'custom'
          }
        })
        newTab.appendChild(droplist)
        bar.appendChild(newTab)
        newTab.children[0].addEventListener(
          'mouseover',
          function () {
            if (
              anyDropON != null &&
              anyDropON != this.getAttribute('g_id') + '_dropbtn'
            ) {
              interact_dropmenu(`${this.getAttribute('g_id')}_dropbtn`)
              this.focus()
            }
          },
          false
        )
      }
    }
  }
}

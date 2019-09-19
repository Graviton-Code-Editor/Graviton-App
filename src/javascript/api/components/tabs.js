/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

// Creating a tab, example:

/*

const my_tab = new Tab({
    id:'my_tab1',
    type:'free',
    name:'Hello World',
    data:'Initial content'
})

my_tab.setData('A new content') //Setting a new content

closeTab('my_tab1_freeTab') //Closing the tab by passing it's ID + '_freeTab'

loadTab(document.getElementById('my_tab1_freeTab')) //Load the tab by passing it's HTML element

*/

'use strict'

module.exports = {
  /**
   * Tab constructor
   * @param {string} id    unique ID for the tab
   * @param {string} type  type of the tab (free,image,file)
   * @param {string} name  the tab's title
   * @param {string} data  the tab's content
   */
  Tab: function ({id,type,name,path,data}) {
    this.type = type
    this.id = id
    switch (type) {
      case 'file':
        for (i = 0; i < tabs.length + 1; i++) {
          if (
            i != tabs.length &&
            tabs[i].getAttribute('longPath') === path
          ) {
            loadTab(tabs[i])
            return
          } else if (i == tabs.length) {
            // Tab is created because it doesn't exist
            document.getElementById(
              current_screen.id
            ).children[1].children[0].style =
              'visibility:hidden; display:none;'
            const tab = document.createElement('div')
            tab.setAttribute('draggable', 'true')
            tab.setAttribute('id', id + 'Tab')
            tab.setAttribute('TabID', id + 'Tab')
            tab.setAttribute('longPath', path)
            tab.setAttribute('screen', current_screen.id)
            tab.setAttribute('class', 'tabs tab_part')
            tab.setAttribute('elementType', 'tab')
            tab.style = `min-width: ${name.length * 4 + 115}px; 
              max-width: ${name.length * 5 + 100}px`
            tab.setAttribute('onclick', 'loadTab(this)')
            tab.setAttribute('file_status', 'saved')
            tab.innerHTML += `<p id="${id + 'TextTab'}" TabID="${
              id
            }Tab" class="tab_part" elementType="tab">${name}</p>`
            const tab_x = document.createElement('button')
            tab_x.setAttribute('onclose', `closeTab("${id}Tab",true);`)
            tab_x.setAttribute('onclick', `closeTab("${id}Tab",false);`)
            tab_x.setAttribute('class', 'close_tab tab_part')
            tab_x.setAttribute('hovering', 'false')
            tab_x.setAttribute('elementType', 'tab')
            tab_x.setAttribute('TabID', id + 'Tab')
            tab_x.setAttribute('id', id + 'CloseButton')
            tab_x.innerHTML = icons['close']
            tab_x.addEventListener('mouseover', function (e) {
              this.setAttribute('hovering', true)
            })
            tab_x.addEventListener('mouseout', function (e) {
              this.setAttribute('hovering', false)
            })
            tab.ondragstart = function (event) {
              event.dataTransfer.setData('id', tab.id)
            }
            tab.appendChild(tab_x)
            document
              .getElementById(current_screen.id)
              .children[0].appendChild(tab)
            tabs.push(tab)
            const g_newPath = path
            filepath = g_newPath
            
            switch (filepath.split('.').pop()) {
              case 'woff2':
              case 'ttf':
                for (i = 0; i < tabs.length; i++) {
                  if (
                    tabs[i].getAttribute('screen') == current_screen.id &&
                      tabs[i].classList.contains('selected')
                  ) {
                    tabs[i].classList.remove('selected')
                  }
                }
                tab.classList.add('selected')
                tab.setAttribute('typeEditor', 'font')
                editingTab = tab.id
                graviton.loadEditor({
                  type: 'font',
                  dir: filepath,
                  data: null,
                  screen: current_screen.id
                },function(){
                    editingTab = id
                    const tab_created_event = new CustomEvent('tab_created', {
                      detail: {
                        tab: tab
                      }
                    })
                    document.dispatchEvent(tab_created_event)
                    if(document.getElementById(current_screen.id).children[0].children.length === 1){
                      const screen_loaded_event = new CustomEvent('screen_loaded', {
                        detail: {
                          tab: tab,
                          screen:current_screen.id
                        }
                      })
                      document.dispatchEvent(screen_loaded_event)
                    }
                  })
                break
              case 'svg':
              case 'png':
              case 'ico':
              case 'jpg':
                for (i = 0; i < tabs.length; i++) {
                  if (
                    tabs[i].getAttribute('screen') == current_screen.id &&
                    tabs[i].classList.contains('selected')
                  ) {
                    tabs[i].classList.remove('selected')
                  }
                }
                tab.classList.add('selected')
                editingTab = tab.id
                tab.setAttribute('typeEditor', 'image')
                graviton.loadEditor({
                  type: 'image',
                  dir: filepath,
                  data: null,
                  screen: current_screen.id
                },function(){
                    editingTab = id
                    const tab_created_event = new CustomEvent('tab_created', {
                      detail: {
                        tab: tab
                      }
                    })
                    document.dispatchEvent(tab_created_event)
                    if(document.getElementById(current_screen.id).children[0].children.length === 1){
                      const screen_loaded_event = new CustomEvent('screen_loaded', {
                        detail: {
                          tab: tab,
                          screen:current_screen.id
                        }
                      })
                      document.dispatchEvent(screen_loaded_event)
                    }
                  })
                break
              default:
                fs.readFile(g_newPath, 'utf8', function (err, data) {
                  if (err) return console.error(err)
                  tab.setAttribute('data', data)
                  for (i = 0; i < tabs.length; i++) {
                    if (
                      tabs[i].getAttribute('screen') == current_screen.id &&
                      tabs[i].classList.contains('selected')
                    ) {
                      tabs[i].classList.remove('selected')
                    }
                  }
                  tab.classList.add('selected')
                  editingTab = tab.id
                  tab.setAttribute('typeEditor', 'text')
                  graviton.loadEditor({
                    type: 'text',
                    dir: g_newPath,
                    data: data,
                    screen: current_screen.id
                  },function(){
                    const tab_created_event = new CustomEvent('tab_created', {
                      detail: {
                        tab: tab
                      }
                    })
                    document.dispatchEvent(tab_created_event)
                    if(document.getElementById(current_screen.id).children[0].children.length === 1){
                      const screen_loaded_event = new CustomEvent('screen_loaded', {
                        detail: {
                          tab: tab,
                          screen:current_screen.id
                        }
                      })
                      document.dispatchEvent(screen_loaded_event)
                    }
                    })

                  editor.refresh()
                })
            }
            return
          }
        }
        break

      case 'free':
        for (i = 0; i < tabs.length; i++) {
          if (
            tabs[i].getAttribute('screen') == current_screen.id &&
            tabs[i].classList.contains('selected')
          ) {
            tabs[i].classList.remove('selected')
          }
        }
        document.getElementById(
          current_screen.id
        ).children[1].children[0].style = 'visibility:hidden; display:none;'
        const tab = document.createElement('div')
        tab.setAttribute('data', data)
        tab.setAttribute('id', id + '_freeTab')
        tab.setAttribute('TabID', id + '_freeTab')
        tab.setAttribute('screen', current_screen.id)
        tab.setAttribute('class', 'tabs selected')
        tab.setAttribute('longPath', id)
        tab.setAttribute('elementType', 'tab')
        tab.style = `min-width: ${name.length * 4 + 115}px; 
          max-width: ${name.length * 5 + 100}px`
        tab.setAttribute('onclick', 'loadTab(this)')
        tab.setAttribute('file_status', 'saved')
        tab.innerHTML += `<p id="${id + 'TextTab'}" TabID="${
          id
        }_freeTab" elementType="tab">${name}</p>`
        const tab_x = document.createElement('button')
        tab_x.setAttribute('onclick', `closeTab("${id}_freeTab");`)
        tab_x.setAttribute('class', 'close_tab')
        tab_x.setAttribute('hovering', 'false')
        tab_x.setAttribute('elementType', 'tab')
        tab_x.setAttribute('TabID', id + '_freeTab')
        tab_x.setAttribute('id', id + 'CloseButton')
        tab.setAttribute('typeEditor', 'free')
        tab_x.innerHTML = icons['close']
        tab_x.addEventListener('mouseover', function (e) {
          this.setAttribute('hovering', true)
        })
        tab_x.addEventListener('mouseout', function (e) {
          this.setAttribute('hovering', false)
        })
        tab.appendChild(tab_x)
        document.getElementById(current_screen.id).children[0].appendChild(tab)
        tabs.push(tab)
        graviton.loadEditor({
          type: 'free',
          dir: id,
          data: data,
          screen: current_screen.id
        },function(){
          filepath = null
          editingTab = id
          const tab_created_event = new CustomEvent('tab_created', {
            detail: {
              tab: tab
            }
          })
          document.dispatchEvent(tab_created_event)
          if(document.getElementById(current_screen.id).children[0].children.length === 1){
            const screen_loaded_event = new CustomEvent('screen_loaded', {
              detail: {
                tab: tab,
                screen:current_screen.id
              }
            })
            document.dispatchEvent(screen_loaded_event)
          }
          })
        
        break
    }
    this.setData = function (data) {
      if (this.type == 'free') {
        document.getElementById(this.id + '_editor').innerHTML = data
      }
    }
  },
  closeTab: function (tab_id, fromWarn) {
    const working_tab = document.getElementById(tab_id);
    const tab_screen = working_tab.getAttribute("screen");
    if (working_tab.getAttribute('file_status') == 'saved' || fromWarn) {
      for (i = 0; i < tabs.length; i++) {
        const tab = tabs[i]
        let new_selected_tab
        if (
          tab.id == tab_id &&
          tab.getAttribute('screen') == working_tab.getAttribute('screen')
        ) {
          tabs.splice(i, 1)
          document
            .getElementById(
              working_tab.getAttribute('longPath').replace(/\\/g, '') + '_editor'
            )
            .remove()
          editors.splice(i, 1)
          const tab_closed_event = new CustomEvent('tab_closed', {
            detail: {
              tab: working_tab
            }
          })
          document.dispatchEvent(tab_closed_event)
          let filtered_tabs = tabs.filter((tab) => {
            return tab.getAttribute('screen') == working_tab.getAttribute('screen')
          })
          if (filtered_tabs.length == 0) {
            // Any tab opened
            filepath = null
            plang = ''
            editor = null
            document.getElementById(working_tab.getAttribute('screen')).children[1].children[0].style = 'visibility:visible; display:block;'
            document
              .getElementById(working_tab.getAttribute('screen'))
              .children[2].innerHTML = ''
              const opened_tabs = Array.prototype.slice.call(document.getElementsByClassName("selected")).filter((tab) => tab.getAttribute("elementType")=="tab")
              const screen_index = editor_screens.filter((screen)=>{
                screen.id == tab_screen;
              })[0]
              if(screen_index==editor_screens.length){
                new_selected_tab = opened_tabs.filter((tab)=>{
                  tab.getAttribute("screen")== editor_screens[screen_index-1]
                })
              }else if(editor_screens.length < screen_index){
                new_selected_tab = opened_tabs.filter((tab)=>{
                  tab.getAttribute("screen")== editor_screens[screen_index+1]
                })
              }
          } else if (i === filtered_tabs.length) {
            if (filtered_tabs.filter((tab) => filtered_tabs[Number(filtered_tabs.length) - 1])[0].getAttribute('screen') == working_tab.getAttribute('screen')) {
              new_selected_tab = filtered_tabs[Number(filtered_tabs.length) - 1]
            }
          } else {
            new_selected_tab = filtered_tabs.filter(function (tab) {
              return tab.getAttribute('screen') == working_tab.getAttribute('screen')
            })[Number(filtered_tabs.length) - 1]
          }
          if (new_selected_tab != undefined) {
            for (i = 0; i < tabs.length; i++) {
              if (
                tabs[i].classList.contains('selected') &&
                tabs[i].getAttribute('screen') ==
                working_tab.getAttribute('screen')
              ) {
                tabs[i].classList.remove('selected')
              }
            }
            editingTab = new_selected_tab.id
            new_selected_tab.classList.add('selected')
            const g_newPath = new_selected_tab.getAttribute('longpath')
            filepath = g_newPath
            graviton.loadEditor({
              type: new_selected_tab.getAttribute('typeeditor'),
              dir: g_newPath,
              data: new_selected_tab.getAttribute('data'),
              screen: new_selected_tab.getAttribute('screen')
            })
          }
          working_tab.remove()
        }
      }
    } else {
      graviton.closingFileWarn(working_tab.children[1])
    }
  },
  loadTab: function (object) {
    const object_screen = object.getAttribute('screen')
    if (
      object.id != editingTab &&
      object.children[1].getAttribute('hovering') == 'false'
    ) {
      for (i = 0; i < tabs.length; i++) {
        if (
          tabs[i].classList.contains('selected') &&
          tabs[i].getAttribute('screen') == object_screen
        ) {
          tabs[i].classList.remove('selected')
        }
      }
      
      object.classList.add('selected')
      const g_newPath = object.getAttribute('longpath')
      filepath = g_newPath
      graviton.loadEditor({
        type: object.getAttribute('typeeditor'),
        dir: g_newPath,
        data: object.getAttribute('data'),
        screen: object.getAttribute('screen')
      })
      editingTab = object.id
      const tab_loaded_event = new CustomEvent('tab_loaded', {
        detail: {
          tab: object,
          screen: object.getAttribute('screen')
        }
      })
      document.dispatchEvent(tab_loaded_event)
    }
  }
}

document.ondrag = function (event) {
  event.preventDefault()
}

document.ondrop = function (event) {
  event.preventDefault()
  mouseClicked = false
  if (event.target.classList.contains('tab_part')) {
    const id = event.dataTransfer.getData('id')
    const todrag = document.getElementById(event.target.getAttribute('TabID'))
    const dragging = document.getElementById(id)
    if (todrag.getAttribute('screen') != dragging.getAttribute('screen')) {
      return
    }
    const from = (function () {
      for (i = 0; i < todrag.parentElement.children.length; i++) {
        if (todrag.parentElement.children[i].id == dragging.id) {
          return i
        }
      }
    })()
    const to = (function () {
      for (i = 0; i < todrag.parentElement.children.length; i++) {
        if (todrag.parentElement.children[i].id == todrag.id) {
          return i
        }
      }
    })()
    if (from > to) {
      document.getElementById(event.target.getAttribute('TabID')).parentElement.insertBefore(document.getElementById(id), document.getElementById(event.target.getAttribute('TabID')))
    } else {
      if (to + 1 == dragging.parentElement.children.length) {
        dragging.parentElement.appendChild(document.getElementById(id))
      } else {
        dragging.parentElement.insertBefore(document.getElementById(id), dragging.parentElement.children[to + 1])
      }
    }
    const tab_reorganized_event = new CustomEvent('tab_reorganized', {
      data: {
        screen: todrag.getAttribute('screen'),
        from_tab: dragging,
        to_tab: todrag
      }
    })
    document.dispatchEvent(tab_reorganized_event)
  }
}
document.ondragover = function (event) {
  event.preventDefault()
}

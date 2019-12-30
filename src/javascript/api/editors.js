function createInstance(clientName = "codemirror", clientConf){

  const resultInstance = graviton.editorClients.filter(function(instance){
    return instance.name == clientName
  })[0]
  return {
    instance:resultInstance,
    editor:resultInstance.onLoadTab(clientConf)
  }

}

function hideEditors(screen){
  for (i = 0; i < editors.length; i++) {
    if (
      editors[i].screen == screen &&
      document.getElementById(editors[i].id) != null
    ) {
      document.getElementById(editors[i].id).style.display = 'none'
    }
  }
}


function editorClient(conf){
  graviton.editorClients.push(conf)
}

module.exports = {
  editorClient:editorClient,
  loadEditor({ dir, type, data, screen }, callback){
    if (
      document.getElementById(dir.replace(/\\/g, '') + '_editor') == undefined
    ) {
      switch (type) {
        case 'text':
          hideEditors(screen)
          const textContainer = document.createElement('div')
          textContainer.classList = 'code-space'
          textContainer.id = `${dir.replace(/\\/g, '')}_editor`
          textContainer.setAttribute('path', dir)
          document
            .getElementById(screen)
            .children[1].appendChild(textContainer)
          const {instance , editor} = createInstance(graviton.getEditorClient(),{
            dir:dir,
            type:type,
            data:data,
            screen:screen,
            textContainer:textContainer
          })
          editors.push({
            id:textContainer.id,
            screen:screen,
            editor:editor,
            instance:instance,
            execute(name,data){
              if(instance[name] != undefined){
                return instance[name](data)
              }
              return false
            }
          })
          break
        case 'font':
          graviton.setCurrentEditor(null)
          const font_container = document.createElement('div')
          font_container.classList = 'code-space'
          font_container.setAttribute('id', `${dir.replace(/\\/g, '')}_editor`)
          const returnPreview = require(path.join("..","components","global","font_previewer"));
          puffin.render(returnPreview(dir),font_container)
          document
            .getElementById(screen)
            .children[1].appendChild(font_container)
          const new_editor_font = {
            object: font_container,
            id: dir.replace(/\\/g, '') + '_editor',
            editor: undefined,
            path: dir,
            screen: screen,
            type: 'font'
          }
          hideEditors(screen)
          editors.push(new_editor_font)
          document.getElementById(
            dir.replace(/\\/g, '') + '_editor'
          ).style.display = 'block'
          editorID = new_editor_font.id
          graviton.focusScreen(screen)
          break
        case 'image':
          graviton.setCurrentEditor(null)
          const image_container = document.createElement('div')
          image_container.classList = 'code-space'
          image_container.setAttribute(
            'id',
            `${dir.replace(/\\/g, '')}_editor`
          )
          image_container.innerHTML = `<img src="${dir}">`
          document
            .getElementById(screen)
            .children[1].appendChild(image_container)
          const new_editor_image = {
            object: image_container,
            id: dir.replace(/\\/g, '') + '_editor',
            editor: null,
            path: dir,
            screen: screen,
            type: 'image'
          }
          hideEditors(screen)
          editors.push(new_editor_image)
          document.getElementById(
            dir.replace(/\\/g, '') + '_editor'
          ).style.display = 'block'
          editorID = new_editor_image.id
          graviton.focusScreen(screen)
          break
        case 'free':
          graviton.setCurrentEditor(null)
          const free_id = 'free_tab' + Math.random()
          const free_container = document.createElement('div')
          free_container.classList = 'code-space'
          free_container.setAttribute('id', `${dir.replace(/\\/g, '')}_editor`)
          free_container.innerHTML = data != undefined ? data : ''
          document
            .getElementById(screen)
            .children[1].appendChild(free_container)
          const new_editor_free = {
            object: free_container,
            id: dir.replace(/\\/g, '') + '_editor',
            editor: null,
            path: null,
            screen: screen,
            type: 'free'
          }
          hideEditors(screen)
          editors.push(new_editor_free)
          document.getElementById(
            dir.replace(/\\/g, '') + '_editor'
          ).style.display = 'block'
          editorID = new_editor_free.id
          graviton.focusScreen(screen)
          break
      }
      if (callback != undefined) callback()
    } else {
      hideEditors(screen)
      editors.map(function(et){
        if (et.id == dir.replace(/\\/g, '') + '_editor') {
          if (et.editor != undefined) {
            editor = et.editor
          } else {
            editor = null
          }
          editorID = et.id
          document.getElementById(editorID).style.display = 'block'
          if (editor != undefined) editor.refresh()
        }
        if (callback != undefined) callback(editor)
      })
    }
  }
}

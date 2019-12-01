/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

// Creating a window, example:

/*

const my_window = new Window({
    id:'my_window1',
    content:'This is a very big window! '
})

my_window.launch(); //Open the window

my_window.close(); //Close the window

closeWindow('my_window1'); //Close the window by passing the id

*/

'use strict'

module.exports = {
  Window: function ({ id = Math.random(), content = "", component = null, onClose = "" , animation="scale_up", height="85%", width="85%" ,closeButton=false,fullScreen=false}) {
    /**
       * @desc Window constructor
       * @param {string} id                   Unique ID for the window
       * @param {string} content                 Window's content
       * @param {function} onClose (optional) When the window is closed the passed function will be executed
       * @param {string} animatiom opening animation
       * @param {string} height custom height for the window
       * @param {string} width custom width for the window
       * @param {boolean} closeButton close button for the window
    */

    if (typeof [...arguments] !== 'object') {
      graviton.throwError('Parsed argument is not object.')
      return
    }
    const openingAnimation = `window_${animation}`
    const {puffin} = require("@mkenzo_8/puffin")

    const buildingCloseButton = puffin.element(
      `
        <button class="Button1 close_exts" click="$closeMe"></button>
      `,
      {
        props:[],
        methods: [
          function closeMe() {
            closeWindow(id)
          }
        ]
      }
    );
    buildingCloseButton.node.innerHTML = icons.close
    if(fullScreen){
      var buildingWindow = puffin.element(
        `
       <div id="${id}_window" class="body_window_full"> 
          <div class="draggable-box" style="min-width:100%; height:35px; padding:0px; margin:0; position:absolute; top:0;left:0;"></div>
          <div id="${id + '_body'}">
              ${(()=>{
                let list = "";
                if(closeButton){
                  list += `<buildingCloseButton/>`
                }
                if(component != null && component !=undefined ){
                  list += "<component/>"
                }else{
                  list += content
                }
                return list
              })()}
          </div>
        </div>`,
        {
          components:{
            buildingCloseButton,
            component
          },
          methods: [
            function closeMe() {
              closeWindow(id)
            }
          ]
        }
      );
    }else{
      var buildingWindow = puffin.element(
        `
       <div id="${id}_window"> 
        <div class="background_window" click="$closeMe" onclick="${onClose}" ></div>
          <div id="${id + '_body'}" style="height:${height}; width:${width}; animation: ${openingAnimation} linear 0.1s;" class="body_window">
              ${(()=>{
                let list = "";
                if(closeButton){
                  list += `<buildingCloseButton/>`
                }
                if(component != null && component !=undefined ){
                  list += "<component/>"
                }else{
                  list += content
                }
                return list
              })()}
          </div>
        </div>`,
        {
          components:{
            buildingCloseButton,
            component
          },
          methods: [
            function closeMe() {
              closeWindow(id)
            }
          ]
        }
      );
    }
    return {
        launch: ()=>{
          document.getElementById('body').setAttribute(
            'windows',
            Number(document.getElementById('body').getAttribute('windows')) + 1
          ) // Plus an opened window
          puffin.render(buildingWindow, document.getElementById("windows"));
        },
        close: ()=>{
          document.getElementById('body').setAttribute(
            'windows',
            Number(document.getElementById('body').getAttribute('windows')) - 1
          ) // Substract an opened window
          document.getElementById(`${id}_window`).remove()
        }
    }
  },
  /**
    * @desc Close a window by it's id
    * @param {string} id  Window's unique window
    */
  closeWindow: id => {
    document.getElementById('body').setAttribute(
        'windows',
        Number(document.getElementById('body').getAttribute('windows')) - 1
      )
    document.getElementById(`${id}_window`).remove()
  }
}

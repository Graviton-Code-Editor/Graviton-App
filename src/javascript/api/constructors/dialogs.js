/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

// Creating a dialog, example:

/*

const my_dialog = new Dialog({
    id:'my_dialog1',
    title:'A title',
    content:'This is an example Dialog.',
    buttons: {
        'Accept':{}
    }
})

closeDialog('my_dialog1'); //Close the dialog by passing the id

*/

'use strict'

module.exports = {
  /**
    * Dialog constructor
    * @param {string} id       Dialog's id
    * @param {string} title    Dialog's title
    * @param {string} content  Dialog's content
    * @param {object} buttons  Dialog's buttons
    */
  Dialog: function ({ id = Math.random(), title, content, buttons }) {
    this.id = id
    if (typeof [...arguments] !== 'object') {
      graviton.throwError('Parsed argument is not object.')
      return
    }
    const openingAnimation = current_config.animationsPreferences=="activated"?`window_slide_up linear 0.1s;`:""

    const buttonComponent = puffin.element(`
      <button myID="{{id}}" click="$onClick">{{value}}</button>
    `,{
      methods:{
        onClick(){
          if(typeof buttons[this.getAttribute("value")].click == "function"){
            buttons[this.getAttribute("value")].click()
          }
          closeDialog(this.id)
        }
      },
      props:["value","id"]
    })

    let buttonsContent = "";

    Object.keys(buttons).forEach(function (key, index) {
      buttonsContent += `
        <buttonComponent class="${buttons[key].important == true ? 'important' : ''}" id="${id}" value="${key}"/>
      `
    })

    const dialogComponent = puffin.element(`
      <div id="${id + '_dialog'}" myID="${id}">
        <div myID="${id}" class="background_window" onclick="closeDialog('${id}')"></div>
        <div style="animation: ${openingAnimation}" class="dialog_body">
            <h3 >${title}</h3>
            <div style="font-size:15px; min-height:15px; position:relative;">
              <elastic-container related="self">
              ${content}
              </elastic-container>
            </div>
            <div class="buttons" style="display:flex;">
              ${buttonsContent}
            </div>
          </div>
      </div>
    `,{
      components:{
        buttonComponent
      }
    })
    
    puffin.render(dialogComponent,document.getElementById("windows"))
    document
      .getElementById('body')
      .setAttribute(
        'windows',
        Number(document.getElementById('body').getAttribute('windows')) + 1
      )
    this.close = function () {
      closeDialog(this.id)
    }
  },
  /**
    * Close a dialog
    * @param {HTML element} ele  DOM element
    */
  closeDialog: id => {
    if(document.getElementById(id + '_dialog') !=null){
      document.getElementById(id + '_dialog').remove()
      document
      .getElementById('body')
      .setAttribute(
        'windows',
        Number(document.getElementById('body').getAttribute('windows')) - 1
      )
    }
  }
}

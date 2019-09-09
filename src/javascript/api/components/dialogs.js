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
   Dialog: function({ id =Math.random(), title, content, buttons }) {
      this.id = id;
      if (typeof [...arguments] !== 'object') {
         graviton.throwError('Parsed argument is not object.')
         return
      }
      const all = document.createElement('div')
      all.id = id + '_dialog';
      all.setAttribute("myID",id);
      all.innerHTML = `
      <div myID="${
            id
      }" class="background_window" onclick="closeDialog('${id}')"></div>`
      const body_dialog = document.createElement('div')
      body_dialog.setAttribute('class', 'dialog_body')
      body_dialog.innerHTML = `
      <h3 >
        ${title}
      </h3>
      <div style="font-size:15px; min-height:15px; position:relative;">
        <elastic-container related=self>
        ${content}
        </elastic-container>
      </div>
      <div class="buttons" style="display:flex;"></div>`
      Object.keys(buttons).forEach(function(key, index) {
         const button = document.createElement('button')
         button.innerText = key
         button.setAttribute('myID', id)
         sleeping(1).then(() => {
            button.addEventListener('click', buttons[key].click)
            button.setAttribute('onclick', `closeDialog('${id}')`)
         })
         button.setAttribute(
            'class',
            buttons[key].important == true ? 'important' : ''
         )
         body_dialog.children[2].appendChild(button)
      })
      all.appendChild(body_dialog)
      document
         .getElementById('body')
         .setAttribute(
            'windows',
            Number(document.getElementById('body').getAttribute('windows')) + 1
         )
      document.body.appendChild(all)
      this.close = function() {
         closeDialog(this.id)
      }
   },
   /**
    * Close a dialog
    * @param {HTML element} ele  DOM element
    */
   closeDialog: id => {
      document
         .getElementById('body')
         .setAttribute(
            'windows',
            Number(document.getElementById('body').getAttribute('windows')) - 1
         )
      document.getElementById(id+'_dialog').remove()
   }
}
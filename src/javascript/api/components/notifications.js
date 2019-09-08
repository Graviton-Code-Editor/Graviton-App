/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

// Creating a notification, example:

/*

const my_noti = new Notification({
  title:"Test",
  content:"This is the content!",
  buttons:{
    "Click":{
      click:function(){
        console.log("Do something")
      }
    },
    "Close":{}
  },
  delay:3000
})

my_noti.close() //Close

*/

'use strict'

module.exports = {
   /**
    * Notification constructor
    * @param {string} title     Notification's title
    * @param {string} content   Notification's content
    * @param {object} buttons   Notification's buttons list
    */
   Notification: function({ title, content, buttons, delay = 7000 }) {
      if (typeof [...arguments] !== 'object') {
         graviton.throwError('Parsed argument is not ')
         return
      }
      if (_notifications.length >= 3) { // Remove one notification in case there are already 3
         _notifications[0].remove()
         _notifications.splice(0, 1)
      }
      const body = document.createElement('div')
      body.classList.add('notificationBody')
      body.setAttribute('id', _notifications.length)
      body.innerHTML = `
      <button class=close onclick="closeNotification(this)">
          ${icons['close']}
      </button>
      <h1>${title}</h1>
      <div>
          <p >${content}</p>
      </div>
      ${buttons != undefined ? '<span class=line_space_menus></span>' : ''}
      <div>
          
      </div> `
      if (buttons != undefined) {
         Object.keys(buttons).map(function(key) {
            const id = Math.random()
            const button = document.createElement('button')
            button.innerText = key
            sleeping(1).then(() => {
               button.addEventListener('click', buttons[key].click)
               button.setAttribute('onClick', 'closeNotification(this.parentElement)')
            })
            body.children[4].appendChild(button)
         })
      }
      document.getElementById('notifications').appendChild(body)
      this.body = body
      _notifications.push(body)
      const wait = setTimeout(() => {
            for (i = 0; i < _notifications.length; i++) {
               if (_notifications[i] === body) {
                  _notifications.splice(i, 1)
                  body.remove()
               }
            }
         }, delay) // Wait 7 seconds until the notification automatically deletes it self
      this.close = function() {
         for (i = 0; i < _notifications.length; i++) {
            if (_notifications[i] === this.body) {
               _notifications.splice(i, 1)
               this.body.remove()
            }
         }
      }
   },
   /**
    * Close a notification
    * @param {HTML element} element   DOM element
    */
   closeNotification: function(element) {
      for (i = 0; i < _notifications.length; i++) {
         if (_notifications[i] === element.parentElement) {
            _notifications.splice(i, 1)
            element.parentElement.remove()
         }
      }
   }
}
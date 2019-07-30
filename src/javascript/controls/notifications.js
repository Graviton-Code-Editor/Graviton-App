/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

//Creating a notification, example:

/*

SIMPLE:

new Notification('Title','This is a content')


WITH BUTTONS:

new Notification("Notification","This notification has buttons",
  {
    "Install":function(){
      console.log("Installing?")
    },
    "Cancel":function(){
      closeNotification(this.parentElement)
    }
  }
)

*/
module.exports = {
  Notification: function(title, message,buttons) {
    if (_notifications.length >= 3) {//Remove one notification in case there are 3
      _notifications[0].remove();
      _notifications.splice(0, 1);
    }
    const body = document.createElement("div");
    body.classList.add("notificationBody");
    body.setAttribute("id", _notifications.length);
    body.innerHTML = `
      <button class=close onclick="closeNotification(this)">
          ${icons["close"]}
      </button>
      <h1>${title}</h1>
      <div>
          <p >${message}</p>
      </div>
      ${buttons!=undefined?"<span class=line_space_menus></span>":""}
      <div>
          
      </div> `;
      if(buttons!=undefined){
        Object.keys(buttons).map(function(key){
          const id = Math.random();
          const button = document.createElement("button");
          button.innerText = key;
          sleeping(1).then(() => {
            button.addEventListener("click",buttons[key]) 
            button.setAttribute("onClick","closeNotification(this.parentElement)")            
          });
          body.children[4].appendChild(button)
        })
      }
    document.getElementById("notifications").appendChild(body);
    _notifications.push(body);
    const wait = setTimeout(() => {
      for (i = 0; i < _notifications.length; i++) {
        if (_notifications[i] === body) {
          _notifications.splice(i, 1);
          body.remove();
        }
      }
    }, 50000); //Wait 7 seconds until the notification automatically deletes it self
  },
  closeNotification: function(element) {
    for (i = 0; i < _notifications.length; i++) {
      if (_notifications[i] === element.parentElement) {
        _notifications.splice(i, 1);
        element.parentElement.remove();
      }
    }
  }
};



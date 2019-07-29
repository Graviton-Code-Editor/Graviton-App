/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

//Creating a notification, example:

/*

new Notification('Title','This is a content')

*/
module.exports = {
  Notification: function(title, message) {
    if (_notifications.length >= 3) {//Remove one notification in case there are 3
      _notifications[0].remove();
      _notifications.splice(0, 1);
    }
    const textID = Math.random();
    const body = document.createElement("div");
    body.classList.add("notificationBody");
    body.setAttribute("id", _notifications.length);
    body.innerHTML = `
      <button  onclick="closeNotification(this)">
          ${icons["close"]}
      </button>
      <h1>${title}</h1>
      <div>
          <p id="notification_message${textID}"></p>
      </div>`;
    document.getElementById("notifications").appendChild(body);
    document.getElementById(
      `notification_message${textID}`
    ).innerText = message;
    _notifications.push(body);
    const wait = setTimeout(() => {
      for (i = 0; i < _notifications.length; i++) {
        if (_notifications[i] === body) {
          _notifications.splice(i, 1);
          body.remove();
        }
      }
    }, 7000); //Wait 7 seconds until the notification automatically deletes it self
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

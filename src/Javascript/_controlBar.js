(function () {

      var remote = require('electron').remote;
      var BrowserWindow = require('electron').BrowserWindow; 

     function init() { 
          document.getElementById("minimize").addEventListener("click", function (e) {
               var window = require('electron').remote.getCurrentWindow();
               window.minimize(); 
          });

          document.getElementById("maximize").addEventListener("click", function (e) {
               var window = require('electron').remote.getCurrentWindow();
               window.maximize(); 
          });

          document.getElementById("close").addEventListener("click", function (e) {
               closeApp();
          }); 
     }; 

     document.onreadystatechange = function () {
          if (document.readyState == "complete") {
               init(); 
          }
     };

})();
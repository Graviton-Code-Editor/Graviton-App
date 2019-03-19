

(function () {
     
     

     function init() { 
          const window = require('electron').remote.getCurrentWindow();
          document.getElementById("minimize").addEventListener("click", function (e) {
               window.minimize(); 
          });

          document.getElementById("maximize").addEventListener("click", function (e) {
               window.maximize(); 
          });

          document.getElementById("close").addEventListener("click", function (e) {
                window.close();
          }); 
     }; 

     document.onreadystatechange = function () {
          if (document.readyState == "complete") {
               init(); 
          }
     };

})();

/*
########################################
              MIT License

Copyright (c) 2019 Graviton Editor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

const windows_buttons = `
     <button id="minimize" style="z-index: 90; height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24"><rect x="7" y="11.5" width="10" height="0.7" transform="matrix(1,0,0,1,0,0)" fill="var(--titleBar-icons-color)"/></svg></button>
     <button id="maximize" style="z-index: 90; height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate;" viewBox="0 0 24 24" width="24" height="24"><rect x="7.5" y="7.5" width="9" height="9" transform="matrix(1,0,0,1,0,0)" fill="transparent" vector-effect="non-scaling-stroke" stroke-width="1" stroke="var(--titleBar-icons-color)" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="2"/></svg></button>
     <button id="close" style="z-index: 90; height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="20" height="24"><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,0.707107,-0.707107,-0.707107,28.970563,12)" fill="var(--titleBar-icons-color)" /><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,-0.707107,0.707107,-0.707107,12,28.970563)" fill="var(--titleBar-icons-color)" /></svg></button>
     `;
if(graviton.currentOS()=="win32"){
     document.getElementById("controls").innerHTML = windows_buttons;
     document.onreadystatechange = function () {
          if (document.readyState == "complete") {
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
          }
     };
}else{
     document.getElementById("controls").innerHTML = " ";
     document.getElementById("controls").setAttribute("os","linux");
}
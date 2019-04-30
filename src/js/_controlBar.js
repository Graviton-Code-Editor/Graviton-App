/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const g_window = require('electron').remote.getCurrentWindow();
const windows_buttons = `
     <button onclick="g_window.minimize(); " id="minimize" style="z-index: 90; height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24"><rect x="7" y="11.5" width="10" height="0.7" transform="matrix(1,0,0,1,0,0)" fill="var(--titleBar-icons-color)"/></svg></button>
     <button onclick="g_window.maximize(); " id="maximize" style="z-index: 90; height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate;" viewBox="0 0 24 24" width="24" height="24"><rect x="7.5" y="7.5" width="9" height="9" transform="matrix(1,0,0,1,0,0)" fill="transparent" vector-effect="non-scaling-stroke" stroke-width="1" stroke="var(--titleBar-icons-color)" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="2"/></svg></button>
     <button onclick="g_window.close();" id="close" style="z-index: 90; height: auto;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="20" height="24"><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,0.707107,-0.707107,-0.707107,28.970563,12)" fill="var(--titleBar-icons-color)" /><rect x="3.68" y="11.406" width="16.64" height="1.189" transform="matrix(-0.707107,-0.707107,0.707107,-0.707107,12,28.970563)" fill="var(--titleBar-icons-color)" /></svg></button>
     `;
if(graviton.currentOS()=="win32"){
     document.getElementById("controls").innerHTML = windows_buttons;
}else{
     document.getElementById("controls").innerHTML = " ";
     document.getElementById("controls").setAttribute("os","unix_based");
}
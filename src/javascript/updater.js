/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
function CHECK_UPDATES(){
  const request = require('request');
  request('https://raw.githubusercontent.com/Graviton-Code-Editor/updates/master/new_update.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if(JSON.parse(body)[g_version.state]["date"] > g_version.date){ //New update detected
        new_update = JSON.parse(body);
        createDialog({
          id:"update",
          title:`<strong>${g_version.state}</strong> Update avaiable !`,
          content:`Do you want to update to version ${JSON.parse(body)[g_version.state]["version"]}?`,
          buttons:{
            [current_config.language['No']]:"closeDialog(this)",
            [current_config.language['Yes']]:"update()"
          }
        })
      }else{
        new Notification("Graviton",'Any update has been found.');
      }      
    }else {
      console.warn(error);
    }
  });
}
function update(){
  shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/releases')
}
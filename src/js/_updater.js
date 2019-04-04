/*
########################################
              MIT License

Copyright (c) 2019 Graviton Code Editor

Full license > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
function CHECK_UPDATES(){
  const request = require('request');
  request('https://raw.githubusercontent.com/Graviton-Code-Editor/updates/master/new_update.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {

      if(JSON.parse(body)["date"] > dateVersion){
      	createDialog('update','Update avaiable!','Wanna update?','No','Yes','closeDialog(this)','update()');
      }else{
        new Notification("Graviton",'Any update has been found! ');
      }
    } else {
      console.warn(error);
    }
  });

  function update(){
    shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/releases')
  }
}

const idea = {
  beta:{
    date:"190401",
    version:"0.7.3"
  },
  stable:{
    date:"181127",
    version:"0.7.0"
  }
}
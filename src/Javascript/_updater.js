


	
var request = require('request');



request('https://raw.githubusercontent.com/Graviton-Code-Editor/updates/master/new_update.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var json = JSON.parse(body);
    if(json["LastUpdate"] > myVersion){
    	/*
    	createDialog('update','Update avaiable!','Wanna update?','No','Yes','closeDialog(this)','update()');
    	*/
    }
  } else {
    console.warn(error);
  }
});

function update(){

}
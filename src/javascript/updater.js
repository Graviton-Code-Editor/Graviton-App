/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const github = require('octonode');
const client = github.client();
const ghrepo  = client.repo('Graviton-Code-Editor/Graviton-App');

function CHECK_UPDATES(){
  ghrepo.releases(function(err,res,body){
    if (!err) {
      for(i=0;i<res.length+1;i++){
        if( i<res.length+1){
          if(res[i].tag_name< g_version.version ){ //New update detected
            new g_dialog({
              id:"update",
              title:`<strong>${g_version.state}</strong> Update avaiable !`,
              content:`Do you want to update to version ${res[i].tag_name}?`,
              buttons:{
                [current_config.language['No']]:"closeDialog(this)",
                [current_config.language['Yes']]:"update()"
              }
            })
            return;
          }
        } 
        new Notification("Graviton",'Any update has been found.');
        return;     
      }
    }
  });       
}
function update(){
  shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/releases')
}
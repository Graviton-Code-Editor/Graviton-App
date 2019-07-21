/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
let plugins_list = [],
    plugins_dbs = [];

const default_plugins = [
  "Graviton-Code-Editor/Dark",
  "Graviton-Code-Editor/Arctic"
]

function detectPlugins(call) {
  if (!fs.existsSync(plugins_db)) { //If the plugins_db folder doesn't exist
    fs.mkdirSync(plugins_db);
  } else { //If the plugins_db folder already exist
    fs.readdir(plugins_db, (err, paths) => {
      for (i = 0; i < paths.length; i++) {
        const dir = paths[i];
        if (dir.indexOf('.') > -1 && getFormat(dir) == "json") {
          try {
            fs.readFile(path.join(plugins_db, dir), 'utf8', function(err, data) {
              plugins_dbs.push({
                plugin_name: path.basename(dir, ".json"),
                db: JSON.parse(data)
              });
            });
          } catch {}
        }
      }
    });
  }
  if (!fs.existsSync(plugins_folder)) { //If the plugins folder doesn't exist
    document.getElementById("g_bootanimation").innerHTML += `
    <div>
      <p>Installing themes...</p>
    </div>`
    fs.mkdirSync(plugins_folder);
    const github = require('octonode')
    const client = github.client()   
    const request = require("request");
    let loaded =0 ;
    for(i=0;i<default_plugins.length;i++){
      const i_t = i;
      client.repo(default_plugins[i]).info(function(err,data){
        if(err){
          new Notification('Graviton',getTranslation("SetupError1"));
          return call!=undefined?call():"";
        }
        const nodegit = require("nodegit");
        request(`https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/package.json`, function (error, response, body2) {
          const config = JSON.parse(body2);
          nodegit.Clone(data.clone_url, path.join(plugins_folder.replace(/\\/g, '\\\\'),config.name)).then(function(repository) {       
            plugins.install(config,function(){
              loaded++;
              if(loaded==default_plugins.length){
                return call!=undefined?call():"";
              }
            })
          });
        });
      }); 
    }
  } else { //If the plugins folder already exist  
    fs.readdir(plugins_folder, (err, paths) => {
      let loaded =0 ;
      for(i=0;i<paths.length;i++){
        const direct = fs.statSync(path.join(plugins_folder, paths[i]));
        if (!direct.isFile()) {
          fs.readFile(path.join(plugins_folder, paths[i], "package.json"), 'utf8', function(err, data) {
            if (err) throw err;
            const config = JSON.parse(data);
            plugins.install(config,function(){
            loaded++;
            if(loaded==paths.length){
              return call!=undefined?call():"";
            }
            })
          });
        }
      }
    });
  }
}
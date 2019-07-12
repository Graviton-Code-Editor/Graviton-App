/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
let plugins_list = [],
    plugins_dbs = [];

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
    fs.mkdirSync(plugins_folder);
    fs.copy(path.join(__dirname, "themes"), plugins_folder, err => {
      if (err) throw err;
      fs.readdir(plugins_folder, (err, paths) => {
        paths.forEach(dir => {
          fs.readFile(path.join(plugins_folder, dir,"package.json"), 'utf8', function(err, data) {
            if (err) throw err;
            const config = JSON.parse(data);
            if(config.colors!=undefined){
              themes.push(config); //Push the theme to the array
              plugins_list.push(config);
              const newLink = document.createElement("link");
              newLink.setAttribute("rel", "stylesheet");
              newLink.setAttribute("href", path.join(highlights_folder, config["highlight"] + ".css")); //Link new themes 
              document.body.appendChild(newLink);
            }
          });
        });
      });
    });

  } else { //If the plugins folder already exist
    fs.readdir(plugins_folder, (err, paths) => {
      paths.forEach(dir => {
        const direct = fs.statSync(path.join(plugins_folder, dir));
        if (!direct.isFile()) {
          fs.readFile(path.join(plugins_folder, dir, "package.json"), 'utf8', function(err, data) {
            if (err) throw err;
            const config = JSON.parse(data);
            plugins.install(config)
            return call!=undefined?call():"";
          });
        }
      });
    });
  }
  
}
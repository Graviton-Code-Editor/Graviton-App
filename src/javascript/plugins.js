/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
let plugins_list = [],
    plugins_dbs = [];

function detectPlugins() {
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
    fs.copy(path.join(__dirname, "plugins"), plugins_folder, err => {
      fs.readdir(plugins_folder, (err, paths) => {
        paths.forEach(dir => {
          const direct = fs.statSync(path.join(plugins_folder, dir));
          if (!direct.isFile()) {
            fs.readFile(path.join(plugins_folder, dir, "package.json"), 'utf8', function(err, data) {
              const config = JSON.parse(data);
              if (err) throw err;
              plugins_list.push(config);
              if(config["main"]!=undefined) {
                const plugin = require(path.join(plugins_folder, config["folder"], config["main"]));
              }
              for (i = 0; i < config["javascript"].length; i++) {
                const script = document.createElement("script");
                script.setAttribute("src", path.join(plugins_folder, config["folder"], config["javascript"][i])),
                  document.body.appendChild(script);
              }
            });
          }
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
            plugins_list.push(config);
            if(config["main"]!=undefined){
               const plugin = require(path.join(plugins_folder, config["folder"], config["main"]));
            }
            for (i = 0; i < config["css"].length; i++) {
              const link = document.createElement("link");
              link.setAttribute("rel", "stylesheet");
              link.setAttribute("href", path.join(plugins_folder, config["folder"], config["css"][i])),
                document.body.appendChild(link);
            }
          });
        }
      });
    });
  }
}
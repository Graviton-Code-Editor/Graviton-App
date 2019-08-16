/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
'use strict'

let plugins_list = [],
  plugins_dbs = [];

const default_plugins = [
  "Graviton-Code-Editor/Dark",
  "Graviton-Code-Editor/Arctic"
]; //Plugins which are installed in the setup process

function detectPlugins(call) {
  if (!fs.existsSync(plugins_db)) { //If the plugins_db folder doesn't exist
    fs.mkdirSync(plugins_db);
  }
  if (!fs.existsSync(plugins_folder)) {
    //If the plugins folder doesn't exist
    document.getElementById("g_bootanimation").innerHTML += `
    <div>
      <p>Installing themes...</p>
    </div>`;
    fs.mkdirSync(plugins_folder);
    const github = require("octonode");
    const client = github.client();
    const request = require("request");
    let loaded = 0;
    let _old_error = false;
    for (i = 0; i < default_plugins.length; i++) {
      const i_t = i;
      client.repo(default_plugins[i]).info(function (err, data) {
        if (_old_error) return;
        if (err) {
          new Notification({
            title: "Graviton",
            content: getTranslation("SetupError1")
          });
          _old_error = true;
          return call != undefined ? call() : "";
        }
        const nodegit = require("nodegit");
        request(
          `https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${
            data.default_branch
          }/package.json`,
          function (error, response, body2) {
            if (err) {
              new Notification({
                title: "Graviton",
                content: getTranslation("SetupError1")
              });
              return call != undefined ? call() : "";
            }
            const config = JSON.parse(body2);
            nodegit
              .Clone(
                data.clone_url,
                path.join(plugins_folder.replace(/\\/g, "\\\\"), config.name)
              )
              .then(function (repository) {
                plugins.install(config, function () {
                  loaded++;
                  if (loaded == default_plugins.length) {
                    return call != undefined ? call() : "";
                  }
                });
              });
          }
        );
      });
    }
  } else {
    let date = new Date
    date = Number(date.getFullYear() + "" + date.getMonth() + "" + date.getDay())
    if (fs.existsSync(market_file)) {
      fs.readFile(market_file, "utf8", (err, data) => {
        const market = JSON.parse(data);
        if (date > market.date) {
          const rimraf = require('rimraf')
          rimraf.sync(market_file);
        } else {
          full_plugins = market.cache
          plugins_market = market.list
        }
        current_plugins = 5
        if (!err) return;
      })
    }
    fs.readdir(plugins_folder, (err, paths) => {
      let loaded = 0;
      if (paths.length == 0) return call != undefined ? call() : "";
      for (i = 0; loaded < paths.length; i++) {
        const direct = fs.statSync(path.join(plugins_folder, paths[loaded]));
        if (!fs.existsSync(path.join(plugins_folder, paths[loaded], "package.json"))) {
          loaded++;
        }
        if (!direct.isFile()) {
          try {
            require(path.join(plugins_folder, paths[loaded], "package.json"))
          } catch {
            if (loaded == paths.length) {
              return call != undefined ? call() : "";
            }
          }
          try{
            require(path.join(plugins_folder, paths[loaded], "package.json"))
          }catch{
            console.warn("Cannot parse the package of >"+`%c ${paths[loaded]}`+" %c < plugin. \nReport it in: https://github.com/Graviton-Code-Editor/plugins_list/issues","color:red; font-weight:bold;","color:normal; font-weight:normal;") //Throw warn in case a plugin has an error
            loaded++;
            if (loaded == paths.length) {
              return call != undefined ? call() : "";
            }
          }
          const config = require(path.join(plugins_folder, paths[loaded], "package.json"))
          plugins.install(config, function () {
            loaded++;

            if (loaded == paths.length) {
              return call != undefined ? call() : "";
            }
          });
        }
      }
    });
  }
}

/*

installing a plugin from a local source:

*/
const installFromLocal = function () {
  dialog.showOpenDialog({
    properties: ["openDirectory"]
  }, selectedFiles => {
    if (selectedFiles === undefined) return;
    const folder_name = path
      .basename(selectedFiles[0])
      .split(".")
      .pop();
    fs.copy(selectedFiles[0], path.join(plugins_folder, folder_name), function (
      err
    ) {
      if (err) {
        graviton.throwError("An error occured while copying the folder.");
        return console.error(err);
      }
      console.log("Installed on" + path.join(plugins_folder, folder_name));
    });
  });
};
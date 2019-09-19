/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
"use strict";

module.exports = {
  Plugins: {
    detect: function(call) {
      const me = this;
      if (!fs.existsSync(plugins_db)) {
        //If the plugins_db folder doesn't exist
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
          client.repo(default_plugins[i]).info(function(err, data) {
            if (_old_error) return;
            if (err) {
              new Notification({
                title: "Graviton",
                content: getTranslation("SetupError1")
              });
              _old_error = true;
              return call != undefined ? call() : "";
            }
            const degit = require('degit');
            request(
              `https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/package.json`,
              function(error, response, body2) {
                if (err) {
                  new Notification({
                    title: "Graviton",
                    content: getTranslation("SetupError1")
                  });
                  return call != undefined ? call() : "";
                }
                const config = JSON.parse(body2);
                const emitter = degit(data.full_name);
                emitter.on('info', info => {});
                emitter.clone(
                    path.join(
                      plugins_folder.replace(/\\/g, "\\\\"),
                      config.name
                    )
                ).then(() => {
                  me.load(config, function() {
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
        let date = new Date();
        date = Number(
          date.getFullYear() + "" + date.getMonth() + "" + date.getDate()
        );
        if (fs.existsSync(market_file)) {
          fs.readFile(market_file, "utf8", (err, data) => {
            const market = JSON.parse(data);
            if (date > market.date) {
              const rimraf = require("rimraf");
              rimraf.sync(market_file);
            } else {
              full_plugins = market.cache;
              plugins_market = market.list;
            }
            current_plugins = full_plugins.length;
            if (!err) return;
          });
        }
        fs.readdir(plugins_folder, (err, paths) => {
          let loaded = 0;
          if (paths.length == 0) {
            graviton.consoleWarn("No plugins has been detected.");
            return call != undefined ? call() : "";
          }
          for (i = 0; loaded < paths.length; i++) {
            const direct = fs.statSync(
              path.join(plugins_folder, paths[loaded])
            );
            if (
              !fs.existsSync(
                path.join(plugins_folder, paths[loaded], "package.json")
              )
            ) {
              loaded++;
            }
            if (!direct.isFile()) {
              try {
                require(path.join(
                  plugins_folder,
                  paths[loaded],
                  "package.json"
                ));
              } catch {
                if (loaded == paths.length) {
                  return call != undefined ? call() : "";
                }
              }
              try {
                require(path.join(
                  plugins_folder,
                  paths[loaded],
                  "package.json"
                ));
              } catch {
                console.warn(
                  "Cannot parse the package of >" +
                    `%c ${paths[loaded]}` +
                    " %c < plugin. \nReport it in: https://github.com/Graviton-Code-Editor/plugins_list/issues",
                  "color:red; font-weight:bold;",
                  "color:normal; font-weight:normal;"
                ); //Throw warn in case a plugin has an error
                loaded++;
                if (loaded == paths.length) {
                  return call != undefined ? call() : "";
                }
              }
              const config = require(path.join(
                plugins_folder,
                paths[loaded],
                "package.json"
              ));
              me.load(config, function() {
                loaded++;

                if (loaded == paths.length) {
                  graviton.consoleInfo("All plugins have been loaded.");
                  return call != undefined ? call() : "";
                }
              });
            }
          }
        });
      }
    },
    load: function(config, call) {
      /**
       * @desc Load a pluign
       * @param {object} config - package.json of the plugin
       * @param {function} call - Function's callback
       * @return call - Function's callback
       */
      if (config.colors == undefined) {
        plugins_list.push(config);
        if (config["main"] != undefined) {
          if (graviton.isProduction()) {
            try {
              require(path.join(
                plugins_folder,
                config["name"],
                config["main"]
              ));
            } catch {
              console.warn(
                "Cannot load succesfully the plugin >" +
                  `%c ${config.name}` +
                  " %c <. \nReport it in: https://github.com/Graviton-Code-Editor/plugins_list/issues",
                "color:red; font-weight:bold;",
                "color:normal; font-weight:normal;"
              ); //Throw warn in case a plugin has an error
              return call != undefined ? call() : "";
            }
          } else {
            require(path.join(plugins_folder, config["name"], config["main"]));
          }
          if (config["css"] == undefined) {
            return call != undefined ? call() : "";
          }
        }
        if (config["css"] != undefined) {
          if (config.type == "custom_theme") {
            themes.push(config);
            if (current_config.theme != config.name)
              return call != undefined ? call() : "";
          }
          for (i = 0; i < config["css"].length; i++) {
            const link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.classList = config["name"] + "_css";
            link.setAttribute(
              "href",
              path.join(plugins_folder, config["name"], config["css"][i])
            ),
              document.body.appendChild(link);
            if (i == config.css.length - 1) {
              return call != undefined ? call() : "";
            }
          }
          return call != undefined ? call() : "";
        }
      } else {
        themes.push(config); //Push the theme to the array
        plugins_list.push(config);
        const newLink = document.createElement("link");
        newLink.setAttribute("rel", "stylesheet");
        if (
          config.type != "custom_theme" ||
          config.highlight == "default" ||
          config.highlight == "LightUI"
        ) {
          newLink.setAttribute(
            "href",
            path.join("src", "highlightings", config["highlight"] + ".css")
          ); //Link new themes
        } else {
          newLink.setAttribute(
            "href",
            path.join(
              plugins_folder,
              config["name"],
              config["highlight"] + ".css"
            )
          ); //Link new themes
        }
        document.body.appendChild(newLink);
        return call != undefined ? call() : "";
      }
    },
    installDependencies: function(config) {
      /**
       * @desc Install NodeJS dependencies of the plugin
       * @param {object} config - Dependencies object of the plugin
       */
      const me = this;
      const npm = require("npm");
      npm.load(
        {
          prefix: path.join(plugins_folder, config["name"])
        },
        function(er) {
          if (er) return er;
          for (const depen in config["dependencies"]) {
            npm.commands.install([depen], function(er, data) {
              if (er) return er;
              me.load(config);
            });
          }
        }
      );
    },
    disableCSS: function(config) {
      /**
       * @desc Disable plugin's CSS
       * @param {object} config - Package.json's of the plugin
       */
      if (config.css == undefined || config.css.length == 0) return;
      const csss = document.getElementsByClassName(config.name + "_css");
      for (b = 0; b < csss.length; b++) {
        csss[b].remove();
        b--;
      }
    },
    enableCSS: function(config) {
      /**
       * @desc Enable plugin's CSS
       * @param {object} config - Package.json's of the plugin
       */
      if (config.css == undefined || config.css.length == 0) return;
      for (b = 0; b < config.css.length; b++) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.classList = config["name"] + "_css";
        link.setAttribute(
          "href",
          path.join(plugins_folder, config["name"], config["css"][b])
        ),
          document.body.appendChild(link);
      }
    },
    installFromLocal: () => {
      dialog.showOpenDialog(
        {
          properties: ["openDirectory"]
        },
        selectedFiles => {
          if (selectedFiles === undefined) return;
          const folder_name = path
            .basename(selectedFiles[0])
            .split(".")
            .pop();
          fs.copy(
            selectedFiles[0],
            path.join(plugins_folder, folder_name),
            function(err) {
              if (err) {
                graviton.throwError(
                  "An error occured while copying the folder."
                );
                return console.error(err);
              }
              console.log(
                "Installed on" + path.join(plugins_folder, folder_name)
              );
            }
          );
        }
      );
    }
  }
};

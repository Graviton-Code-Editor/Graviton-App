/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanztor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict";

module.exports = {
  Market: {
    open: function(callback) {
      /**
       * @desc Open the Market window
       */
      const market_window = new Window({
        id: "market_window",
        content: `
          <div id="market_loader" class="center loading_bar">
            <div></div>
            <div class="bg"></div>
          </div>
                `
      });
      market_window.launch();
      if (marketCache.length != 0) {
        this.loadMenus();
        return callback();
      }

      this.extensions = [];
      const me = this;
      const fetch = require("node-fetch");
      fetch(
        "https://raw.githubusercontent.com/Graviton-Code-Editor/plugins_list/master/list.json"
      )
        .then(res => res.json())
        .then(body => {
          me.extensions = body;
          plugins_market = me.extensions;
          current_plugins = 5;
          me.loadMoreExtensions(0, callback);
        }).catch(err=>{
          me.loadMenus()
          return callback(1)
        })
    },
    loadMenus: function() {
      /**
       * @desc Load the Market page structure
       */
      if (document.getElementById("market_window_window") == undefined) return;

      graviton.windowContent(
        "market_window",
        `
      <gv-navpanel>
        <gv-navbar>
          <gv-navtitle>${getTranslation("Market")}</gv-navtitle>
          <gv-navbutton href="All" default="" onclick="Market.navigate('all')"  >${getTranslation(
            "All"
          )}</gv-navbutton>
          <gv-navbutton href="Themes" onclick="Market.navigate('themes');">${getTranslation(
            "Themes"
          )}</gv-navbutton>
          <gv-navbutton href="Installed" onclick="Market.navigate('installed');">${getTranslation(
            "Installed"
          )}</gv-navbutton>
          <gv-navbutton href="Settings" onclick="Market.navigate('settings')">${getTranslation(
            "Settings"
          )}</gv-navbutton>
        </gv-navbar>
        <gv-navcontent id="market_content">
          <gv-navpage id="sec_all" href="All" default=""></gv-navpage>
          <gv-navpage id="sec_installed" href="Installed"></gv-navpage>
          <gv-navpage id="sec_themes" href="Themes"></gv-navpage>
          <gv-navpage id="sec_settings" href="Settings"></gv-navpage>
        </gv-navcontent>
      </gv-navpanel>`
      );
      elasticContainer.append(document.getElementById("market_content"));
    },
    clearCache: function() {
      /**
       * @desc Clear the market cache
       */
      const rimraf = require("rimraf");
      rimraf.sync(market_file);
      marketCache = [];
      current_plugins = 0;
      plugins_market = [];
      this.extensions = [];
      closeWindow("market_window");
    },
    navigate: function(num, err) {
      /**
       * @desc Load the market pages
       */
      if (document.getElementById("market_window_window") == undefined) return;
      switch (num) {
        case "all":
          if (err == 1) {
            document.getElementById("sec_all").innerHTML = getTranslation(
              "MarketError1"
            );
            document.getElementById("sec_themes").innerHTML = getTranslation(
              "MarketError1"
            );
            return;
          }
          if (err == 2) {
            document.getElementById("sec_all").innerHTML = getTranslation(
              "MarketError2"
            );
            document.getElementById("sec_themes").innerHTML = getTranslation(
              "MarketError2"
            );
            return;
          }
          if (err == 3) {
            document.getElementById("sec_all").innerHTML = getTranslation(
              "MarketError3"
            );
            document.getElementById("sec_themes").innerHTML = getTranslation(
              "MarketError3"
            );
            return;
          }
          if (document.getElementById("sec_all").innerHTML == "") {
            document.getElementById("sec_all").innerHTML = `
                          <div id=loading_exts>Loading extensions...</div>
                        `;
            marketCache.forEach(_plugin => {
              const plugin = graviton.getPlugin(_plugin.package.name);
              const data = plugin.repo.git;
              const _package = plugin.repo.package;
              if (document.getElementById("loading_exts") != undefined) {
                document.getElementById("loading_exts").remove();
              }
              const _new_update =
                plugin.local != undefined
                  ? semver.gt(
                      semver.parse(_package.version),
                      semver.parse(plugin.local.version)
                    )
                  : false;
              const retrieveCard = require("../components/plugins/plugin_card")
              const card = retrieveCard({
                plugin:plugin,
                packageConf:_package,
                newUpdate:_new_update,
                repository:data,
                isInstalled:graviton.getPlugin(_package.name).local != undefined,
                section:"all"
              })
              const {puffin} = require("@mkenzo_8/puffin")
              puffin.render(card  ,document.getElementById("sec_all"))
            });
            if (plugins_market.length != marketCache.length) {
              document.getElementById("sec_all").innerHTML += `
                <div  id=load_more_plugins  class="extension_div static" >
                  <button onclick=" Market.loadMoreExtensions(current_plugins,function(){ document.getElementById('sec_all').innerHTML = ''; Market.navigate('all')}); " class=" center button1 fixed-scale" > Load more</button>
                </div>`;
            }
          }
          return;
        case "installed":
          if (document.getElementById("sec_installed").innerHTML == "") {
            document.getElementById("sec_installed").innerHTML = `
                      <div id=loading_exts2>Loading extensions...</div>
                    `;
            if (plugins_list.length == 0) {
              document.getElementById("sec_installed").innerHTML = `
                      Empty
                    `;
            }
            for (const _data of plugins_list) {
              if (document.getElementById("loading_exts2") != undefined) {
                document.getElementById("loading_exts2").remove();
              }
              const plugin = graviton.getPlugin(_data.name);
              const newUpdate =
                plugin.repo != undefined
                  ? semver.gt(
                      semver.parse(plugin.repo.package.version),
                      semver.parse(plugin.local.version)
                    )
                  : false;
              const retrieveCard = require("../components/plugins/plugin_card")
              const test = retrieveCard({
                plugin:plugin,
                packageConf:plugin.local,
                newUpdate:newUpdate,
                isInstalled:true,
                section:"installed"
              })
              const {puffin} = require("@mkenzo_8/puffin")
              puffin.render(test,document.getElementById("sec_installed"))
            }
          }
          return;
        case "themes":
          if (document.getElementById("sec_themes").innerHTML == "") {
            document.getElementById("sec_themes").innerHTML = `
                    <div id=loading_exts3>Loading extensions...</div>`;
            for (const _data of marketCache) {
              const plugin = graviton.getPlugin(_data.package.name);
              const data = plugin.repo.git;
              const _package = plugin.repo.package;
              if (_package.colors != undefined) {
                if (document.getElementById("loading_exts3") != undefined) {
                  document.getElementById("loading_exts3").remove();
                }
                const newUpdate =
                  plugin.local != undefined
                    ? semver.gt(
                        semver.parse(_package.version).version,
                        semver.parse(plugin.local.version).version
                      )
                    : false;
                const retrieveCard = require("../components/plugins/plugin_card")
                const test = retrieveCard({
                  plugin:plugin,
                  packageConf:_package,
                  newUpdate:newUpdate,
                  repository:data,
                  isInstalled:graviton.getPlugin(_package.name).local != undefined,
                  section:"all"
                })
                const {puffin} = require("@mkenzo_8/puffin")
                puffin.render(test,document.getElementById("sec_themes"))
              }
            }
            if (document.getElementById("loading_exts3") != undefined) {
              document.getElementById("loading_exts3").remove();
            }
            if (plugins_market.length != marketCache.length) {
              document.getElementById("sec_themes").innerHTML += `
                      <div  id=load_more_plugins  class="extension_div static" >
                        <button onclick=" Market.loadMoreExtensions(current_plugins,function(){ document.getElementById('sec_themes').innerHTML = ''; Market.navigate('themes')}); " class=" center button1" > Load more</button>
                      </div>`;
            }
          }

          return;
        case "settings":
          document.getElementById("sec_settings").innerHTML = `
                <h4>${getTranslation("Cache")}</h4>
                <div class="section-1">
                  <button class=button1 onclick='Market.clearCache()'>${getTranslation(
                    "Clear"
                  )}</button>
                </div>
                `;
      }
    },
    loadMoreExtensions(start, callback) {
      /**
       * @desc Load extensions
       */
      let plugins_to_update = false;
      const me = this;
      if (plugins_market[start] == undefined) {
        if (document.getElementById("load_more_plugins") != undefined) {
          document.getElementById("load_more_plugins").remove();
        }
        return;
      }
      me.extensions = plugins_market.slice(start, start + 5);
      current_plugins = start + me.extensions.length;
      for (i = 0; i < me.extensions.length; i++) {
        const this_i = i;
        me.getExtensionData(me.extensions[this_i],callback,function(){
          if (start === 0) {
            document.getElementById(
              "market_loader"
            ).children[0].style.width = i * 20 + 20 + "%";
          }
          if (i == current_plugins - 1) {
            let date = new Date();
            date = Number(
              date.getFullYear() +
                "" +
                date.getMonth() +
                "" +
                date.getDate()
            );
            const new_cache = {
              date: date,
              list: plugins_market,
              cache: marketCache
            };
            fs.writeFile(market_file, JSON.stringify(new_cache), function(
              err
            ) {
              if (err) {
                return err;
              }
            });
            me.loadMenus();
            if (plugins_to_update) {
              new Notification({
                title: getTranslation("Market"),
                content: getTranslation("ExtUpdateNotification")
              });
            }
            if (callback != undefined) callback();
          }
        })
      }
    },
    getExtensionData(extension,callback,succCallback){
      const me = this;
      const github = require("octonode");
      const client = github.client();
      client.repo(extension).info(function(err, data) {
        if (err) {
          me.loadMenus(); 
          console.log(err)
          return callback(2); // Maxium requests error, 60 requests / hour / ip
        }
        const fetch = require("node-fetch");
        fetch(
          `https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/package.json`
        )
          .then(res => res.json())
          .then(packageConf => {
            const extensionData = {
              git: data,
              package: Plugins.sanitizePlugin(packageConf)
            }
            marketCache.push(extensionData);
            const plugin = graviton.getPlugin(packageConf.name);
            const _new_update =
              plugin.local != undefined
                ? semver.gt(
                    semver.parse(packageConf.version),
                    semver.parse(plugin.local.version)
                  )
                : false;
            if (_new_update) {
              plugins_to_update = true;
            }
            if (err) {
              me.loadMenus();
              return callback(3);
            }
            return succCallback(extensionData)
          });
      });
    },
    openSubExtensions: function({name,update}) {
      /**
       * @desc Open each's eextension window
       */
      const plugin = graviton.getPlugin(name);
      if (plugin == undefined) {
        new Notification({
          title: getTranslation("Market"),
          content: getTranslation("ExtCannotLoad")
        });
        return;
      }
      const pluginPackage = plugin.repo?plugin.repo.package:plugin.local
      const retrieveWindow = require("../components/plugins/plugin_window")
      const pluginWindow = retrieveWindow({
        plugin:plugin,
        newUpdate:update,
        package:pluginPackage,
        isInstalled:plugin.local != undefined,
        repository:plugin.repo?plugin.repo.git:undefined
      })
      
      const ext_win = new Window({
        id: `sec${name}`,
        content: `<div id="${name}_window" style="height:100%;overflow:auto;"></div>`,
        closeButton:true,
        animation:"slide_up"
      });
      ext_win.launch();
      const { puffin } = require("@mkenzo_8/puffin")
      puffin.render(pluginWindow,document.getElementById(`${name}_window`))
      const bottom_section = document.getElementById(
        `${name}_readme`
      );
      if (bottom_section != null) {
        if (plugin.local != undefined) {
          /*
          Local Readme
          */
          fs.readFile(
            path.join(plugins_folder, name, "readme.md"),
            "utf8",
            function(err, readme) {
              const marked = require("marked")
              bottom_section.innerHTML = `<div style="flex:1;" >${
                !err ? marked(readme) : getTranslation("NoReadme")
              }</div>`;
            }
          );
          /*
          Local Screenshots
          */
          if (plugin.local.screenshots != undefined) {
            plugin.local.screenshots.forEach(sc => {
              const screenshoot = document.createElement("img");
              screenshoot.setAttribute(
                "src",
                path.join(plugins_folder, plugin.local.name, sc)
              );
              screenshoot.style = "height:200px; ";
              screenshoot.draggable = false;
              document
                .getElementById(`${name}_screenshots`)
                .appendChild(screenshoot);
            });
          }
        } else {
          /**
           * @desc Repository Readme
           */
          const fetch = require("node-fetch");
          fetch(
            `https://raw.githubusercontent.com/${plugin.repo.git.owner.login}/${plugin.repo.git.name}/${plugin.repo.git.default_branch}/readme.md`
          )
            .then(res => res.text())
            .then(body3 => {
              const marked = require("marked")
              if (
                document.getElementById(`${name}_div`) !=
                undefined
              ) {
                bottom_section.innerHTML = `<div style="flex:1;" >${
                  !body3.match("404: Not Found")
                    ? marked(body3)
                    : getTranslation("NoReadme")
                }</div>`;
              }
            });
          if (plugin.repo.package.screenshots != undefined) {
            plugin.repo.package.screenshots.forEach(sc => {
              const screenshoot = document.createElement("img");
              screenshoot.setAttribute(
                "src",
                `https://raw.githubusercontent.com/${plugin.repo.git.owner.login}/${plugin.repo.git.name}/${plugin.repo.git.default_branch}/${sc}`
              );
              screenshoot.style = "height:200px; ";
              screenshoot.draggable = false;
              document
                .getElementById(plugin.repo.package.name + "_screenshots")
                .appendChild(screenshoot);
            });
          }
        }
      }
    },
    installExtension: function(name) {
      /**
       * @desc Install a plugin from the market
       * @param {string} name - Name of the plugin
       */
      const plugin = graviton.getPlugin(name);
      if (fs.existsSync(path.join(plugins_folder, name))) {
        new Notification({
          title: "Market",
          content: name + getTranslation("ExtAlreadyInstalled")
        });
        return;
      }
      (() => {
        const content = document.getElementById(`${name}_div`);
        content.innerHTML += `
        <gv-process id="plugin_process${name}" style="width:100%" value="0">
            <gv-process-bar></gv-process-bar>
            <gv-process-text>Retrieving package information...</gv-process-text>
        </gv-process>
        `;
      })();
      const processLoader = document.getElementById(`plugin_process${name}`);
      const degit = require("degit");
      const emitter = degit(plugin.repo.git.full_name);
      processLoader.setValue("15");
      processLoader.setText(getTranslation("Process.DownloadingSource"));
      emitter.on("info", info => {});
      emitter
        .clone(path.join(plugins_folder.replace(/\\/g, "\\\\"), name))
        .then(() => {
          processLoader.setValue("45");
          processLoader.setText(getTranslation("Process.DownloadingSource"));

          if (plugin.repo.package["dependencies"] != undefined) {
            processLoader.setValue("75");
            processLoader.setText(
              getTranslation("Process.CheckingDependencies")
            );
            Plugins.installDependencies(plugin.repo.package, () => {
              processLoader.setValue("100");
              processLoader.setText(
                getTranslation("Process.InstallingDependencies")
              );
              setTimeout(function() {
                processLoader.close();
              }, 1500);
            });
          } else {
            processLoader.setValue("100");
            processLoader.setText(getTranslation("Process.Completed"));
            setTimeout(function() {
              processLoader.close();
            }, 1500);
            Plugins.load(plugin.repo.package);
          }
          const installed_ext_event = new CustomEvent("extension_installed", {
            detail: {
              name: name
            }
          });
          document.dispatchEvent(installed_ext_event);
          if (plugin.repo.package.colors != undefined) {
            new Notification({
              title: "Market",
              content: name + getTranslation("ExtInstalled"),
              buttons: {
                [getTranslation("Select")]: {
                  click: function() {
                    graviton.setTheme(name);
                    graviton.saveConfiguration();
                  }
                }
              }
            });
          } else {
            new Notification({
              title: "Market",
              content: name + getTranslation("ExtInstalled")
            });
          }
        });
    },
    updateExtension: function(name) {
      /**
       * @desc Update a plugin from the market
       * @param {string} name - Name of the plugin
       */
      const plugin = graviton.getPlugin(name);
      const new_update =
        plugin.local != undefined && plugin.repo != undefined
          ? semver.gt(
              semver.parse(plugin.repo.package.version).version,
              semver.parse(plugin.local.version).version
            )
          : false;
      if (plugin.repo == undefined) {
        new Notification({
          title: "Market",
          content: name + getTranslation("ExtNotListed")
        });
        return;
      }
      if (!fs.existsSync(path.join(plugins_folder, name))) {
        new Notification({
          title: "Market",
          content: name + getTranslation("ExtNotInstalled")
        });
        return;
      }
      if (!new_update) {
        new Notification({
          title: "Market",
          content: `${getTranslation("ExtNoUpdate") + name}.`
        });
        return;
      }
      const rimraf = require("rimraf");
      rimraf.sync(path.join(plugins_folder, name));

      const degit = require("degit");

      const emitter = degit(plugin.repo.git.full_name);

      emitter.on("info", info => {});

      emitter
        .clone(path.join(plugins_folder.replace(/\\/g, "\\\\"), name))
        .then(() => {
          const updated_ext_event = new CustomEvent("updated_installed", {
            detail: {
              name: name
            }
          });
          document.dispatchEvent(updated_ext_event);
          new Notification({
            title: "Market",
            content: name + getTranslation("ExtUpdated")
          });
          if (plugin.repo.package["dependencies"] != undefined) {
            Plugins.installDependencies(plugin.repo.package);
          } else {
            Plugins.load(plugin.repo.package);
          }
        });
    },
    uninstallExtension: function(name) {
      /**
       * @desc Load a pluign
       * @param {string} name - Name of the plugin
       */
      const rimraf = require("rimraf");
      if (!fs.existsSync(path.join(plugins_folder, name))) {
        new Notification({
          title: "Market",
          content: name + getTranslation("ExtNotInstalled")
        });
        return;
      }
      rimraf.sync(path.join(plugins_folder, name));
      new Notification({
        title: "Market",
        content: name + getTranslation("ExtUninstalled")
      });
      const csss = document.getElementsByClassName(name + "_css");
      for (i = 0; i < csss.length; i++) {
        csss[i].remove();
        i--;
      }
      for (i = 0; i < plugins_list.length; i++) {
        if (plugins_list[i].name == name) {
          plugins_list.splice(i, 1);
          return;
        }
      }
      const uninstalled_ext_event = new CustomEvent("extension_uninstalled", {
        detail: {
          name: name
        }
      });
      document.dispatchEvent(uninstalled_ext_event);
    }
  }
};

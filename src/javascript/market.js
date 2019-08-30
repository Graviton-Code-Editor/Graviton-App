/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict"
let plugins_market = [];
let current_plugins = 0;
const extensions = {
  navigate: function (num, err) {
    if (document.getElementById("market_window_window") == undefined) return;
    for (i = 0; i < document.getElementById("navbar2").children.length; i++) {
      document.getElementById("navbar2").children[i].classList.remove('active')
    }
    switch (num) {
      case 'all':
        for (i = 0; i < document.getElementById("_content2").children.length; i++) {
          document.getElementById("_content2").children[i].classList = "page_hidden";
        }
        document.getElementById("sec_all").classList = "page_showed"
        document.getElementById('navC1').classList.add('active')
        if (err == 1) {
          document.getElementById("sec_all").innerHTML = getTranslation("MarketError1")
          document.getElementById("sec_themes").innerHTML = getTranslation("MarketError1")
          return;
        }
        if (err == 2) {
          document.getElementById("sec_all").innerHTML = getTranslation("MarketError2")
          document.getElementById("sec_themes").innerHTML = getTranslation("MarketError2")
          return;
        }
        if (err == 3) {
          document.getElementById("sec_all").innerHTML = getTranslation("MarketError3")
          document.getElementById("sec_themes").innerHTML = getTranslation("MarketError3")
          return;
        }
        if (document.getElementById('sec_all').innerHTML == "") {
          document.getElementById("sec_all").innerHTML = `
                    <div id=loading_exts>Loading extensions...</div>
                  `
          const request = require("request");
          full_plugins.forEach((_plugin) => {
            const plugin = graviton.getPlugin(_plugin.package.name);
            const data = plugin.repo.git;
            const _package = plugin.repo.package
            if (document.getElementById("loading_exts") != undefined) {
              document.getElementById("loading_exts").remove();
            }
            const sec_ID = 'sec' + Math.random().toString();
            const _new_update = plugin.local != undefined ? semver.gt(semver.parse(_package.version).version, semver.parse(plugin.local.version).version) : false;
            document.getElementById('sec_all').innerHTML += graviton.getTemplate("market_plugin_card",`

              const sec_ID = "${sec_ID}";
              const _package = ${JSON.stringify(_package)};
              const _new_update = ${new_update};
              const plugin = ${JSON.stringify(plugin)};
              const data = ${JSON.stringify(data)} ;

              `)
                
          })
          if (plugins_market.length != full_plugins.length) {
            document.getElementById('sec_all').innerHTML += `
                <div  id=load_more_plugins  class="extension_div static" >
                  <button onclick=" extensions.loadMoreExtensions(current_plugins,function(){ document.getElementById('sec_all').innerHTML = ''; extensions.navigate('all')}); " class=" center button1 fixed-scale" > Load more</button>
                </div>`
          }
        }
        return
      case 'installed':
        for (i = 0; i < document.getElementById("_content2").children.length; i++) {
          document.getElementById("_content2").children[i].classList = "page_hidden";
        }
        document.getElementById("sec_installed").classList = "page_showed"
        document.getElementById('navC2').classList.add('active')
        if (document.getElementById('sec_installed').innerHTML == "") {
          document.getElementById("sec_installed").innerHTML = `
                <div id=loading_exts2>Loading extensions...</div>
              `
          if (plugins_list.length == 0) {
            document.getElementById("sec_installed").innerHTML = `
                Empty
              `
          }
          for (const _data of plugins_list) {
            if (document.getElementById("loading_exts2") != undefined) {
              document.getElementById("loading_exts2").remove();
            }
            const plugin = graviton.getPlugin(_data.name)
            const new_update = plugin.repo != undefined ? semver.gt(semver.parse(plugin.repo.package.version).version, semver.parse(plugin.local.version).version) : false;
            const sec_ID = 'sec' + Math.random().toString();
            document.getElementById('sec_installed').innerHTML += graviton.getTemplate("market_plugin_card_installed",`

            const sec_ID = "${sec_ID}";
            const _new_update = ${new_update};
            const plugin = ${JSON.stringify(plugin)};

            `)
          };
        }
        return
      case 'themes':
        for (i = 0; i < document.getElementById("_content2").children.length; i++) {
          document.getElementById("_content2").children[i].classList = "page_hidden";
        }
        document.getElementById("sec_themes").classList = "page_showed"
        document.getElementById('navC3').classList.add('active')
        if (document.getElementById('sec_themes').innerHTML == "") {
          document.getElementById("sec_themes").innerHTML = `
              <div id=loading_exts3>Loading extensions...</div>`
          for (const _data of full_plugins) {
            const plugin = graviton.getPlugin(_data.package.name)
            const data = plugin.repo.git;
            const _package = plugin.repo.package;
            if (_package.colors != undefined) {
              if (document.getElementById("loading_exts3") != undefined) {
                document.getElementById("loading_exts3").remove();
              }
              const _new_update = plugin.local != undefined ? semver.gt(semver.parse(_package.version).version, semver.parse(plugin.local.version).version) : false;
              const sec_ID = 'sec' + Math.random().toString();
              document.getElementById('sec_themes').innerHTML += graviton.getTemplate("market_plugin_card",`

              const sec_ID = "${sec_ID}";
              const _package = ${JSON.stringify(_package)};
              const _new_update = ${new_update};
              const plugin = ${JSON.stringify(plugin)};
              const data = ${JSON.stringify(data)} ;

              `)
              
              
            }
          }
          if (document.getElementById("loading_exts3") != undefined) {
            document.getElementById("loading_exts3").remove();
          }
          if (plugins_market.length != full_plugins.length) {
            document.getElementById('sec_themes').innerHTML += `
                <div  id=load_more_plugins  class="extension_div static" >
                  <button onclick=" extensions.loadMoreExtensions(current_plugins,function(){ document.getElementById('sec_themes').innerHTML = ''; extensions.navigate('themes')}); " class=" center button1 fixed-scale" > Load more</button>
                </div>`
          }
        }
        
        return
      case 'settings':
        for (i = 0; i < document.getElementById("_content2").children.length; i++) {
          document.getElementById("_content2").children[i].classList = "page_hidden";
        }
        document.getElementById("sec_settings").classList = "page_showed"
        document.getElementById('navC4').classList.add('active')
        document.getElementById("sec_settings").innerHTML = `
          <h4>${getTranslation("Cache")}</h4>
          <div class="section-1">
            <button class=button1 onclick='store.clearCache()'>${getTranslation("Clear")}</button>
          </div>
          `
        return
    }
  },
  openStore: function (callback) {
    const market_window = new Window({
      id: 'market_window',
      content: `
        <div class=center>
          <div class="spinner">
            <div></div> 
          </div>
        </div>
          `
    })
    market_window.launch();
    if (full_plugins.length != 0) {
      store.loadMenus();
      return callback();
    }
    const request = require("request");
    this.extensions = [];
    const me = this;
    request('https://raw.githubusercontent.com/Graviton-Code-Editor/plugins_list/master/list.json', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        me.extensions = JSON.parse(body);
      } else {
        store.loadMenus();
        return callback(1);
      }
      plugins_market = me.extensions;
      current_plugins = 5;
      me.loadMoreExtensions(0, callback)
    });
  },
  loadMoreExtensions(start, callback) {
    let plugins_to_update = false;
    const github = require('octonode')
    const client = github.client()
    const request = require("request");
    const me = this;

    if (plugins_market[start] == undefined) {
      if (document.getElementById("load_more_plugins") != undefined) document.getElementById("load_more_plugins").remove();
      return;
    }
    me.extensions = plugins_market.slice(start, start + 5);
    console.log(me.extensions)
    current_plugins = start + me.extensions.length
    for (i = 0; i < me.extensions.length; i++) {
      const this_i = i;
      client.repo(me.extensions[this_i]).info(function (err, data) {
        if (err) {
          store.loadMenus(); //Maxium calls error, 60calls/hour/ip
          return callback(2);
        }
        request(`https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/package.json`, function (error, response, body2) {
          const _package = JSON.parse(body2);
          full_plugins.push({
            git: data,
            package: _package
          })
          const plugin = graviton.getPlugin(_package.name);
          const _new_update = plugin.local != undefined ? semver.gt(
              semver.parse(_package.version).version,
              semver.parse(plugin.local.version).version) :
            false;
          if (_new_update) {
            plugins_to_update = true;
          }
          if (err) {
            store.loadMenus();
            return callback(3);
          }
          if (i == current_plugins - 1) {
            let date = new Date
            date = Number(date.getFullYear() + "" + date.getMonth() + "" + date.getDate())
            const new_cache = {
              "date": date,
              "list": plugins_market,
              "cache": full_plugins
            }
            fs.writeFile(market_file, JSON.stringify(new_cache), function (err) {
              if (err) {
                return err;
              }
            });
            store.loadMenus();
            if (plugins_to_update) {
              new Notification({
                title: getTranslation('Market'),
                content: getTranslation('ExtUpdateNotification')
              })
            }
            if (callback != undefined) callback();
          }
        });
      })
    };
  },
  openSubExtensions: function (data) {
    const plugin = graviton.getPlugin(data.getAttribute("name"));
    if (plugin == undefined) {
      new Notification({
        title: getTranslation('Market'),
        content: getTranslation('ExtCannotLoad')
      })
      return;
    }
    const ext_win = new Window({
      id: 'sec' + data.getAttribute("name"),
      content: graviton.getTemplate("market_plugin", `
        const name = '${data.getAttribute("name")}';
        const update = '${data.getAttribute("update")}';
        const plugin = ${JSON.stringify(plugin)};
      `)
});
    ext_win.launch();
    const bottom_section = document.getElementById(data.getAttribute('name') + '_div2');
    if (bottom_section != null) {
      if (plugin.local != undefined) {
        fs.readFile(path.join(plugins_folder, data.getAttribute("name"), "readme.md"), "utf8", function (err, readme) {
          document.getElementById(data.getAttribute('name') + '_div2').innerHTML = `<div style="flex:1;" >${!err?marked(readme):getTranslation("NoReadme")}</div>`
        });
      } else {
        const request = require("request");
        request(`https://raw.githubusercontent.com/${plugin.repo.git.owner.login}/${plugin.repo.git.name}/${plugin.repo.git.default_branch}/readme.md`, function (error, response, body3) {
          if (document.getElementById(data.getAttribute('name') + '_div') == undefined) return;
          document.getElementById(data.getAttribute('name') + '_div2').innerHTML = `<div style="flex:1;" >${!error && response.statusCode ==200?marked(body3):getTranslation("NoReadme")}</div>`
        })
      }
    }
  },
  installExtension: function (name) {
    /*
     * @desc Install a plugin from the market
     * @param {string} name - Name of the plugin
     */
    const plugin = graviton.getPlugin(name)
    if (fs.existsSync(path.join(plugins_folder, name))) {
      new Notification({
        title: 'Market',
        content: name + getTranslation("ExtAlreadyInstalled")
      });
      return;
    }
    const nodegit = require("nodegit");
    nodegit.Clone(plugin.repo.git.clone_url, path.join(plugins_folder.replace(/\\/g, '\\\\'), name)).then(function (repository) {
      const installed_ext_event = new CustomEvent("extension_installed", {
        detail: {
          name: name
        }
      })
      document.dispatchEvent(installed_ext_event);
      if (plugin.repo.package.colors != undefined) {
        new Notification({
          title: 'Market',
          content: name + getTranslation("ExtInstalled"),
          buttons: {
            [getTranslation("Select")]: {
              click: function () {
                graviton.setTheme(name)
              }
            }
          }
        });
      } else {
        new Notification({
          title: 'Market',
          content: name + getTranslation("ExtInstalled"),
        });
      }
      if (plugin.repo.package["dependencies"] != undefined) {
        plugins.installDependencies(plugin.repo.package);
      } else {
        plugins.install(plugin.repo.package)
      }
    });
  },
  updateExtension: function (name) {
    /*
     * @desc Update a plugin from the market
     * @param {string} name - Name of the plugin
     */
    const plugin = graviton.getPlugin(name)
    const new_update = plugin.local != undefined && plugin.repo != undefined ? semver.gt(semver.parse(plugin.repo.package.version).version, semver.parse(plugin.local.version).version) : false;
    if (plugin.repo == undefined) {
      new Notification({
        title: 'Market',
        content: name + getTranslation("ExtNotListed")
      });
      return;
    }
    if (!fs.existsSync(path.join(plugins_folder, name))) {
      new Notification({
        title: 'Market',
        content: name + getTranslation("ExtNotInstalled")
      });
      return;
    }
    if (!new_update) {
      new Notification({
        title: 'Market',
        content: `${getTranslation("ExtNoUpdate")+name}.`
      });
      return;
    }
    const rimraf = require("rimraf")
    rimraf.sync(path.join(plugins_folder, name));
    const nodegit = require("nodegit");
    nodegit.Clone(plugin.repo.git.clone_url, path.join(plugins_folder.replace(/\\/g, '\\\\'), name)).then(function (repository) {
      const updated_ext_event = new CustomEvent("updated_installed", {
        detail: {
          name: name
        }
      })
      document.dispatchEvent(updated_ext_event);
      new Notification({
        title: 'Market',
        content: name + getTranslation("ExtUpdated")
      });
      if (plugin.repo.package["dependencies"] != undefined) {
        plugins.installDependencies(plugin.repo.package);
      } else {
        plugins.install(plugin.repo.package)
      }
    });
  },
  uninstallExtension: function (name) {
    /*
     * @desc Load a pluign
     * @param {string} name - Name of the plugin
     */
    const rimraf = require('rimraf');
    if (!fs.existsSync(path.join(plugins_folder, name))) {
      new Notification({
        title: 'Market',
        content: name + getTranslation("ExtNotInstalled")
      });
      return;
    }
    rimraf.sync(path.join(plugins_folder, name));
    new Notification({
      title: 'Market',
      content: name + getTranslation("ExtUninstalled")
    })
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
    })
    document.dispatchEvent(uninstalled_ext_event);
  }
}

const store = {
  loadMenus: function () {
    /*
     * @desc Load the Market page structure
     */
    if (document.getElementById("market_window_window") == undefined) return;
    graviton.windowContent("market_window", `
        <div class="g_lateral_panel">
          <h2 class="window_title window_title2 translate_word"  idT="Market">${getTranslation('Market')}</h2> 
          <div id="navbar2" class="navbar">
            <button id="navC1" onclick="extensions.navigate('all')" class="translate_word" idT="All">${getTranslation("All")}</button>
            <button id="navC2" onclick="extensions.navigate('installed')" class="translate_word" idT="Installed">${getTranslation('Installed')}</button>
            <button id="navC3" onclick="extensions.navigate('themes')" class="translate_word" idT="Themes">${getTranslation('Themes')}</button>
            <button id="navC4" onclick="extensions.navigate('settings')" class="translate_word" idT="Settings">${getTranslation('Settings')}</button>
          </div>
        </div>
        <div id="_content2" class="window_content">
          <div id="sec_all"></div>
          <div id="sec_installed"></div>
          <div id="sec_themes"></div>
          <div id="sec_settings"></div>
        </div>  
        `);
    elasticContainer.append(document.getElementById("_content2"));
  },
  clearCache: function () {
    /*
     * @desc Clear the market cache 
     */
    const rimraf = require('rimraf')
    rimraf.sync(market_file)
    full_plugins = []
    current_plugins = 0
    plugins_market = []
    extensions.extensions = []
    closeWindow('market_window')
  }
}

const installCli = function () {
  const npm = require('npm')
  npm.load({
    global: true
  }, function (er) {
    if (er) return er;
    npm.commands.install(['graviton-cli'], function (er, data) {
      if (er) return er;
      console.log("Graviton CLI has been installed!")
    })
  })
}
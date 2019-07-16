/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const extensions ={
    navigate: function (num,err) {
      for (i = 0; i < document.getElementById("navbar2").children.length; i++) {
        document.getElementById("navbar2").children[i].classList.remove('active')
      }
      switch (num) {
        case 'all':
            for(i=0;i<document.getElementById("_content2").children.length;i++){
              document.getElementById("_content2").children[i].classList = "page_hidden";
            }
            document.getElementById("sec_all").classList = "page_showed"
            document.getElementById('navC1').classList.add('active')
            if(err==1){
              document.getElementById("sec_all").innerHTML=getTranslation("MarketError1")
              document.getElementById("sec_themes").innerHTML=getTranslation("MarketError1")
              return;
            }
            if(err==2){
              document.getElementById("sec_all").innerHTML=getTranslation("MarketError2")
              document.getElementById("sec_themes").innerHTML=getTranslation("MarketError2")
              return;
            }
            if(err==3){
              document.getElementById("sec_all").innerHTML=getTranslation("MarketError3")
              document.getElementById("sec_themes").innerHTML=getTranslation("MarketError3")
              return;
            }
            if(document.getElementById('sec_all').innerHTML == ""){
              document.getElementById("sec_all").innerHTML=`
                <div id=loading_exts>Loading extensions...</div>
              `
              const request = require("request");
              for(const plugin of full_plugins){
                const data = plugin.git;
                request(`https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/package.json`, function (error, response, body2) {
                  const package = JSON.parse(body2);
                  if(document.getElementById("loading_exts")!=undefined){
                    document.getElementById("loading_exts").remove();
                  }
                  const sec_ID = 'sec'+Math.random().toString();
                  document.getElementById('sec_all').innerHTML +=`
                  <div onclick=extensions.openSubExtensions(this) class=extension_div id=${sec_ID} name=${data.name} git=${data.clone_url} description='${data.description}' author='${data.owner.login}' branch='${data.default_branch}' stars=${data.stargazers_count}>
                    <h3>${data.name}  </h3>
                    <p>${data.description} </p>
                    <p class=installed>${graviton.getPlugin(data.name)!=undefined?` ${current_config.language["Installed"]} · v${graviton.getPlugin(data.name).version} ·`:""}  ${data.stargazers_count} ⭐ </p>
                  </div>
                  ` 
                });
              }
            }
            
          return
        case 'installed':
            for(i=0;i<document.getElementById("_content2").children.length;i++){
              document.getElementById("_content2").children[i].classList = "page_hidden";
            }
            document.getElementById("sec_installed").classList = "page_showed"
            document.getElementById('navC2').classList.add('active')
            if(document.getElementById('sec_installed').innerHTML == ""){
              document.getElementById("sec_installed").innerHTML=`
                <div id=loading_exts2>Loading extensions...</div>
              `
              for(const data of plugins_list ){
                if(document.getElementById("loading_exts2")!=undefined){
                  document.getElementById("loading_exts2").remove();
                }
                const git = (function(){
                    for(const plugin of full_plugins){
                        if(plugin.package.folder== data.name){
                            return plugin.git;
                        }
                    }
                    return {
                        git:undefined,
                        default_branch:undefined
                    }
                })()
                const sec_ID = 'sec'+Math.random().toString();
                document.getElementById('sec_installed').innerHTML +=`
                <div onclick=extensions.openSubExtensions(this) class=extension_div id=${sec_ID} name=${data.name} git=${data.clone_url} description='${data.description}' author='${data.author}' branch='${git.default_branch}' stars='${git.stargazers_count}'>
                  <h3>${data.name}  </h3>
                  <p>${data.description} </p>
                  <p class=installed>${graviton.getPlugin(data.name)!=undefined?`v${graviton.getPlugin(data.name).version}`:""} ${git.stargazers_count!=undefined?`· ${git.stargazers_count} ⭐`:""} </p>
                </div>
                ` 
              };
            }
            
          return
        case 'themes':
          for(i=0;i<document.getElementById("_content2").children.length;i++){
            document.getElementById("_content2").children[i].classList = "page_hidden";
          }
          document.getElementById("sec_themes").classList = "page_showed"
          document.getElementById('navC3').classList.add('active')
          if(document.getElementById('sec_themes').innerHTML == ""){
            document.getElementById("sec_themes").innerHTML=`
                <div id=loading_exts3>Loading extensions...</div>`
            for(const plugin of full_plugins){
                const data = plugin.git;
                const package = plugin.package;
                if(package.colors!=undefined){
                  if(document.getElementById("loading_exts3")!=undefined){
                    document.getElementById("loading_exts3").remove();
                }
                const sec_ID = 'sec'+Math.random().toString();
                document.getElementById('sec_themes').innerHTML +=`
                <div onclick=extensions.openSubExtensions(this) class=extension_div id=${sec_ID} name=${data.name} git=${data.clone_url} description='${data.description}' author='${data.owner.login}' branch=${data.default_branch} stars=${data.stargazers_count}>
                    <h3>${data.name}  </h3>
                    <p>${data.description} </p>
                    <p class=installed>${graviton.getPlugin(data.name)!=undefined?` ${getTranslation("Installed")} · v${graviton.getPlugin(data.name).version} ·`:""}  ${data.stargazers_count} ⭐ </p>
                </div>
                ` 
                }
            }
            if(document.getElementById("loading_exts3")!=undefined){
              document.getElementById("loading_exts3").remove();
            }
          }
        return
      }
    },
    openStore : function(callback){
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
      if(full_plugins.length!=0) {
        store.loadMenus();
        return callback();
      }
      const github = require('octonode')
      const client = github.client()   
      const request = require("request");
      let extensions = []; 
      request('https://raw.githubusercontent.com/Graviton-Code-Editor/plugins_list/master/list.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          extensions = JSON.parse(body);
        }else {
          store.loadMenus();
          return callback(1);
        }
        for(i=0;i<extensions.length;i++){
          client.repo(extensions[i]).info(function(err,data){
            if(err) {
              store.loadMenus();
              return callback(2);
            }
            request(`https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/package.json`, function (error, response, body2) {
              const package = JSON.parse(body2);
              full_plugins.push({
                git:data,
                package:package
              })
              if(err){
                store.loadMenus();
                return callback(3);
              }
              if(i==extensions.length && full_plugins.length == i){
                store.loadMenus();
                if(callback!=undefined) callback();
                
              }
            });
            
          })
          
        };
      });
      
    },
    openSubExtensions: function(data){
      const ext_win = new Window({
        id: 'sec'+data.name,
        content:`
        <button class="button1 close_exts" onclick=closeWindow('sec${data.name}') >${icons.close}</button>
        <div class=sub_extension_div id=${data.getAttribute('name')+'_div'} >
            <div class="top">
              <div>
                <h1>${data.getAttribute('name')}</h1>
                <p>${data.getAttribute('description')}</p>
                <p>${getTranslation("MadeBy")} ${data.getAttribute('name')!='undefined'?data.getAttribute('author'):"Unknown"}</p>
                <p>${getTranslation("Version")}: ${graviton.getPlugin(data.getAttribute('name'))!=undefined?graviton.getPlugin(data.getAttribute('name')).version:"Unknown"}</p>
                <p>${getTranslation("Stars")}: ${data.getAttribute('stars')!='undefined'?data.getAttribute('stars'):"Unknown"}</p>
              </div> 
              <div>
                <div>
                  <button onclick=extensions.installExtension('${data.id}') id=${Math.random()+'install'} class=button1 >${current_config.language["Install"]}</button> 
                  <button onclick=extensions.uninstallExtension('${data.id}') id=${Math.random()+'uninstall'} class=button1 >${current_config.language["Uninstall"]}</button> 
                </div>
              </div> 
            </div>
          </div>
        </div>`
        });
        ext_win.launch();
        if(graviton.getPlugin(data.getAttribute('name'))!=undefined){
          fs.readFile(path.join(plugins_folder, data.getAttribute("name"),"readme.md"), "utf8", function(err, readme) {
            document.getElementById(data.getAttribute('name')+'_div').innerHTML += `<div class=ext_content>${!err?marked(readme):getTranslation("NoReadme")}</div>`
          });
        }else{
          const request = require("request");
          request(`https://raw.githubusercontent.com/${data.getAttribute('author')}/${data.getAttribute('name')}/${data.getAttribute('branch')}/readme.md`, function (error, response, body3) {
            document.getElementById(data.getAttribute('name')+'_div').innerHTML += `<div class=ext_content>${!error?marked(body3):getTranslation("NoReadme")}</div>`
          })
        }
    },
    installExtension: function(id){
      const data = document.getElementById(id);
      if (fs.existsSync(path.join(plugins_folder,data.getAttribute("name")))) {
        new Notification('Market',data.getAttribute("name")+ current_config.language["ExtAlreadyInstalled"]);
        return;
      }
      const nodegit = require("nodegit");
      nodegit.Clone(data.getAttribute("git"), path.join(plugins_folder.replace(/\\/g, '\\\\'),data.getAttribute("name"))).then(function(repository) {
        const installed_ext_event = new CustomEvent("extension_installed",{
          detail:{
            name : data.getAttribute("name")
          }
        })
        document.dispatchEvent(installed_ext_event);
        new Notification('Market',data.getAttribute("name")+ current_config.language["ExtInstalled"]);
        for(i=0;i<full_plugins.length;i++){
          if(full_plugins[i].package.name==data.getAttribute("name")){
            const config = full_plugins[i].package;
            if(config["dependencies"]!=undefined){
              plugins.installDependencies(config);
            }else{
              plugins.install(full_plugins[i].package)
            }
            
          }
        }
  
      });
      
    },
    uninstallExtension: function(id){
      const data = document.getElementById(id);
      const rimraf = require('rimraf');
        const fs = require('fs');
        if (!fs.existsSync(path.join(plugins_folder,data.getAttribute("name")))) {
            new Notification('Market',data.getAttribute("name")+ current_config.language["ExtNotInstalled"]);
            return;
        }
        rimraf.sync(path.join(plugins_folder,data.getAttribute("name")));
  
            new Notification('Market',data.getAttribute("name") + current_config.language["ExtUninstalled"])
            const csss = document.getElementsByClassName(data.getAttribute("name")+"_css");
            for(i=0;i<csss.length;i++){
              csss[i].remove();
              i--;
            }
            for(i=0;i<plugins_list.length;i++){
              if(plugins_list[i].name==data.getAttribute("name")){
                plugins_list.splice(i,1);
                return;
              }
            }
            const uninstalled_ext_event = new CustomEvent("extension_uninstalled",{
              detail:{
                name : data.getAttribute("name")
              }
            })
            document.dispatchEvent(uninstalled_ext_event);
       
    }
  }
  
  const store = {
    loadMenus:function(){
      graviton.windowContent("market_window",`
        <div class="g_lateral_panel">
          <h2 class="window_title window_title2 translate_word"  idT="Market">${getTranslation('Market')}</h2> 
          <div id="navbar2" class="navbar">
            <button id="navC1" onclick="extensions.navigate('all')" class="translate_word" idT="All">${getTranslation("All")}</button>
            <button id="navC2" onclick="extensions.navigate('installed')" class="translate_word" idT="Installed">${getTranslation('Installed')}</button>
            <button id="navC3" onclick="extensions.navigate('themes')" class="translate_word" idT="Themes">${getTranslation('Themes')}</button>
          </div>
        </div>
        <div id="_content2" class="window_content">
          <div id="sec_all"></div>
          <div id="sec_installed"></div>
          <div id="sec_themes"></div>
        </div>  
        `);
    }
  }
  const plugins = {
    install: function(config){
      if(config.colors==undefined){
        plugins_list.push(config);
        if(config["main"]!=undefined){
          const plugin = require(path.join(plugins_folder, config["folder"], config["main"]));
        }
        if(config["css"] !=undefined) {
          for (i = 0; i < config["css"].length; i++) {
            const link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.classList = config["name"]+"_css";
            link.setAttribute("href", path.join(plugins_folder, config["folder"], config["css"][i])),
            document.body.appendChild(link);
          }
        }      
      }else{
        themes.push(config); //Push the theme to the array
        plugins_list.push(config);
        const newLink = document.createElement("link");
        newLink.setAttribute("rel", "stylesheet");
        newLink.setAttribute("href", path.join(highlights_folder, config["highlight"] + ".css")); //Link new themes 
        document.body.appendChild(newLink);
      }
    },
    installDependencies: function(config){
      const npm = require('npm')
      npm.load({
        prefix:path.join(plugins_folder,config["folder"])
      },function (er) {
        if (er) return er;
        for(const depen in config["dependencies"]){
          npm.commands.install([depen], function (er, data) {
            if (er) return er;
            plugins.install(config) //Dependencies of the plugin  has been installed successfully
          })
        }
      })
    }
  }
  
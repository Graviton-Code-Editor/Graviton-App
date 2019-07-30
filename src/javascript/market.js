/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
const extensions ={
    navigate: function (num,err) {
      if(document.getElementById("market_window_window")==undefined) return;
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
              for(const _plugin of full_plugins){
                const plugin = graviton.getPlugin(_plugin.package.name);
                const data = plugin.repo.git;
                const package = plugin.repo.package
                if(document.getElementById("loading_exts")!=undefined){
                  document.getElementById("loading_exts").remove();
                }
               
                const sec_ID = 'sec'+Math.random().toString();
                const new_update = plugin.local!=undefined?getVersionSum(package.version)>getVersionSum(graviton.getPlugin(package.name).local.version):false;
                document.getElementById('sec_all').innerHTML +=`
                <div onclick=extensions.openSubExtensions(this) class=extension_div id=${sec_ID} name=${package.name} update=${new_update}>
                  ${new_update?icons["update"]:""}
                  <h3>${data.name}  </h3>
                  <p>${data.description} </p>
                  <p class=installed>${plugin.local!=undefined?` ${current_config.language["Installed"]} · v${plugin.local.version} ·`:""}  ${data.stargazers_count} ${icons.star} </p>
                </div>
                ` 
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
              if(plugins_list.length==0){
                document.getElementById("sec_installed").innerHTML=`
                Empty
              `
              }
              for(const _data of plugins_list ){
                if(document.getElementById("loading_exts2")!=undefined){
                  document.getElementById("loading_exts2").remove();
                }
                const plugin = graviton.getPlugin(_data.name)
                const new_update = plugin.repo!=undefined?getVersionSum(plugin.repo.package.version)>getVersionSum(plugin.local.version):false;
                const sec_ID = 'sec'+Math.random().toString();
                document.getElementById('sec_installed').innerHTML +=`
                <div onclick=extensions.openSubExtensions(this) class=extension_div id=${sec_ID}  name=${plugin.local.name} update=${new_update}>
                   ${new_update?icons["update"]:""}
                  <h3>${plugin.local.name}  </h3>
                  <p>${plugin.local.description} </p>
                  <p class=installed>v${plugin.local.version}${plugin.repo!=undefined?` ${plugin.repo.git.stargazers_count!=undefined? `· ${plugin.repo.git.stargazers_count} ${icons.star}`:""}`:""} </p>
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
            for(const _data of full_plugins){
              const plugin = graviton.getPlugin(_data.package.name)
              const data = plugin.repo.git;
              const package = plugin.repo.package;
              if(package.colors!=undefined){
                if(document.getElementById("loading_exts3")!=undefined){
                  document.getElementById("loading_exts3").remove();
              }
              const new_update = plugin.local!=undefined?getVersionSum(package.version)>getVersionSum(plugin.local.version):false;
              const sec_ID = 'sec'+Math.random().toString();
              document.getElementById('sec_themes').innerHTML +=`
              <div onclick=extensions.openSubExtensions(this) class=extension_div id=${sec_ID}  name=${package.name}  update=${new_update}>
                    ${new_update?icons["update"]:""}
                  <h3>${data.name}  </h3>
                  <p>${data.description} </p>
                  <p class=installed>${plugin.local!=undefined?` ${current_config.language["Installed"]} · v${plugin.local.version} ·`:""}  ${data.stargazers_count} ${icons.star} </p>
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
        let plugins_to_update = false;
        for(i=0;i<extensions.length;i++){
          client.repo(extensions[i]).info(function(err,data){
            if(err) {
              store.loadMenus(); //Maxium calls error, 60calls/hour/ip
              return callback(2);
            }
            request(`https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/package.json`, function (error, response, body2) {
              const package = JSON.parse(body2);
              full_plugins.push({
                git:data,
                package:package
              })
              const plugin = graviton.getPlugin(package.name);
              const new_update = plugin.local!=undefined?getVersionSum(package.version)>getVersionSum(plugin.local.version):false;
              if(new_update){
                plugins_to_update = true;
              }
              if(err){
                store.loadMenus();
                return callback(3);
              }
              if(i==extensions.length-1 ){
                store.loadMenus();
                if(plugins_to_update){
                  new Notification(getTranslation('Market'),getTranslation('ExtUpdateNotification'))
                }
                if(callback!=undefined) callback();
              }
            });
            
          })
        };
      });
    },
    openSubExtensions: function(data){
      const plugin  = graviton.getPlugin(data.getAttribute("name"));
      if(plugin==undefined){
        new Notification(getTranslation('Market'),getTranslation('ExtCannotLoad'))
        return;
      }
      const ext_win = new Window({
        id: 'sec'+data.getAttribute("name"),
        content:`
        <button class="button1 close_exts" onclick=closeWindow('sec${data.getAttribute("name")}') >${icons.close}</button>
        <div class=sub_extension_div id=${data.getAttribute("name")+'_div'} >
            <div class="top">
              <div>
                <h1>${data.getAttribute("name")}</h1>
                <p>${plugin.repo!=undefined?plugin.repo.package.description:plugin.local.description}</p>
                <p>${getTranslation("MadeBy")} ${plugin.repo!=undefined?plugin.repo.package.author:plugin.local.author}</p>
                <p>${getTranslation("Version")}: ${plugin.repo!=undefined?data.getAttribute('update')=='false'?plugin.repo.package.version:plugin.local.version+" ( 🎉 update: "+plugin.repo.package.version+" )":plugin.local.version}</p>
                <p>${getTranslation("Stars")}: ${plugin.repo!=undefined?plugin.repo.git.stargazers_count:"Unknown"}</p>
                ${plugin.repo!=undefined?`<p class=link onclick=shell.openExternal("https://github.com/Graviton-Code-Editor/plugins_list/issues")>${getTranslation("Report")}</p>`:""}
              </div> 
              <div>
                <div>
                  <button onclick=extensions.installExtension('${data.getAttribute("name")}') id=${Math.random()+'install'} class=button1 >${current_config.language["Install"]}</button> 
                  <button onclick=extensions.uninstallExtension('${data.getAttribute("name")}') id=${Math.random()+'uninstall'} class=button1 >${current_config.language["Uninstall"]}</button> 
                  <button onclick=extensions.updateExtension('${data.getAttribute("name")}') id=${Math.random()+'update'} class=button1 >${getTranslation("Update")}</button> 
                </div>
              </div> 
            </div>
          </div>
        </div>`
        });
        ext_win.launch();
        if(plugin.local!=undefined){
          fs.readFile(path.join(plugins_folder, data.getAttribute("name"),"readme.md"), "utf8", function(err, readme) {
            document.getElementById(data.getAttribute('name')+'_div').innerHTML += `<div class=ext_content>${!err?marked(readme):getTranslation("NoReadme")}</div>`
          });
        }else{
          const request = require("request");
          request(`https://raw.githubusercontent.com/${plugin.repo.git.owner.login}/${plugin.repo.git.name}/${plugin.repo.git.default_branch}/readme.md`, function (error, response, body3) {
            if(document.getElementById(data.getAttribute('name')+'_div')==undefined) return;  
            document.getElementById(data.getAttribute('name')+'_div').innerHTML += `<div class=ext_content>${!error && response.statusCode ==200?marked(body3):getTranslation("NoReadme")}</div>`
          })
        }
    },
    installExtension: function(name){
      const plugin = graviton.getPlugin(name)
      if (fs.existsSync(path.join(plugins_folder,name))) {
        new Notification('Market',name + current_config.language["ExtAlreadyInstalled"]);
        return;
      }
      const nodegit = require("nodegit");
      nodegit.Clone(plugin.repo.git.clone_url, path.join(plugins_folder.replace(/\\/g, '\\\\'),name)).then(function(repository) {
        const installed_ext_event = new CustomEvent("extension_installed",{
          detail:{
            name : name
          }
        })
        document.dispatchEvent(installed_ext_event);
        new Notification('Market',name+ current_config.language["ExtInstalled"]);
        if(plugin.repo.package["dependencies"]!=undefined){
          plugins.installDependencies(plugin.repo.package);
        }else{
          plugins.install(plugin.repo.package)
        }
      });
    },
    updateExtension: function(name){
      const plugin = graviton.getPlugin(name)
      const new_update = plugin.local!=undefined?getVersionSum(plugin.repo.package.version)>getVersionSum(plugin.local.version):false;
      if (!fs.existsSync(path.join(plugins_folder,name))) {
        new Notification('Market',name+ current_config.language["ExtNotInstalled"]);
        return;
      }
      if(!new_update){
        new Notification('Market',`${getTranslation("ExtNoUpdate")+name}.`);
        return;
      } 
      const rimraf = require("rimraf")
      rimraf.sync(path.join(plugins_folder,name));
      const nodegit = require("nodegit");
      nodegit.Clone(plugin.repo.git.clone_url, path.join(plugins_folder.replace(/\\/g, '\\\\'),name)).then(function(repository) {
        const updated_ext_event = new CustomEvent("updated_installed",{
          detail:{
            name : name
          }
        })
        document.dispatchEvent(updated_ext_event);
        new Notification('Market',name+ current_config.language["ExtUpdated"]);
        console.log(plugin);
        if(plugin.repo.package["dependencies"]!=undefined){
          plugins.installDependencies(plugin.repo.package);
        }else{
          plugins.install(plugin.repo.package)
        }
      });      
    },
    uninstallExtension: function(name){
      const rimraf = require('rimraf');
      if (!fs.existsSync(path.join(plugins_folder,name))) {
        new Notification('Market',name+ current_config.language["ExtNotInstalled"]);
        return;
      }
      rimraf.sync(path.join(plugins_folder,name));
      new Notification('Market',name + current_config.language["ExtUninstalled"])
      const csss = document.getElementsByClassName(name+"_css");
      for(i=0;i<csss.length;i++){
        csss[i].remove();
        i--;
      }
      for(i=0;i<plugins_list.length;i++){
        if(plugins_list[i].name==name){
          plugins_list.splice(i,1);
          return;
        }
      }
      const uninstalled_ext_event = new CustomEvent("extension_uninstalled",{
        detail:{
          name : name
        }
      })
      document.dispatchEvent(uninstalled_ext_event);
    }
  }
  
  const store = {
    loadMenus:function(){
      if(document.getElementById("market_window_window")==undefined) return;
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
    install: function(config,call){
      if(config.colors==undefined ){
        plugins_list.push(config);
        if(config["main"]!=undefined){
          require(path.join(plugins_folder, config["name"], config["main"]));
          if(config["css"]==undefined){
            return call!=undefined?call():"";
          }
        }
        if(config["css"] !=undefined) {
          if(config.type=="custom_theme"){
            themes.push(config);
            if(current_config.theme!=config.name)  return call!=undefined?call():"";
          }
          for (i = 0; i < config["css"].length; i++) {
            const link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.classList = config["name"]+"_css";
            link.setAttribute("href", path.join(plugins_folder, config["name"], config["css"][i])),
            document.body.appendChild(link);
            if(i==config.css.length-1){
              return call!=undefined?call():"";
            }
          }
          return call!=undefined?call():"";
        }      
      }else{
        themes.push(config); //Push the theme to the array
        plugins_list.push(config);
        const newLink = document.createElement("link");
        newLink.setAttribute("rel", "stylesheet");
        if(config.type!="custom_theme"){
          newLink.setAttribute("href", path.join("src","Highlights", config["highlight"] + ".css")); //Link new themes 
        }else{
          newLink.setAttribute("href", path.join(plugins_folder,config["name"], config["highlight"] + ".css")); //Link new themes 
        }
        document.body.appendChild(newLink);
       return call!=undefined?call():"";
      }
    },
    installDependencies: function(config){
      const npm = require('npm')
      npm.load({
        prefix:path.join(plugins_folder,config["name"])
      },function (er) {
        if (er) return er;
        for(const depen in config["dependencies"]){
          npm.commands.install([depen], function (er, data) {
            if (er) return er;
            plugins.install(config) //Dependencies of the plugin  has been installed successfully
          })
        }
      })
    },
    disableCSS: function(config){
      if(config.css==undefined ||config.css.length == 0) return;
      const csss = document.getElementsByClassName(config.name+"_css");
      for(b=0;b<csss.length;b++){
        csss[b].remove();
        b--;
      }   
    },
    enableCSS: function(config){
      if(config.css==undefined ||config.css.length == 0) return;
      for (b = 0; b < config.css.length; b++) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.classList = config["name"]+"_css";
        link.setAttribute("href", path.join(plugins_folder, config["name"], config["css"][b])),
        document.body.appendChild(link);
      }
    }
  }

 const getVersionSum = (input) =>{
   return (function(){
     const _input = input.match( /\d+/g);
     let result = "";
      for(const num of _input){
        result += num
      }
      return parseInt(result,10);
   })(input)
 }

const installCli = function(){
  const npm = require('npm')
  npm.load({
    global:true
  },function (er) {
    if (er) return er;
    npm.commands.install(['graviton-cli'], function (er, data) {
      if (er) return er;
      console.log("cli installed!")
    })
  })
}

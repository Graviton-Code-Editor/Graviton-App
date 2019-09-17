`
<elastic-container related=self>
<button class="button1 close_exts" onclick="closeWindow('sec${name}')">${icons.close}</button>
<div class=sub_extension_div id=${name+ '_div'}>
   <div class="top">
      ${(function(){
         console.log(update)
         /* 

            If plugin is not installed:

               Case 1( It has a logo):
                  The logo is loaded directly from the source repository

               Case 2(It doesn't have any logo):
                  It shows a dynamic logo  base on the repository's package.json

            If plugin is installed:

               Case 1( It has a logo):
                  The logo is loaded locally
                  
               Case 2(It doesn't have any logo):
                  It shows a dynamic logo base on the local package.json

         */
         if(plugin.local !=undefined){
            if(plugin.local.logo !=undefined){  /* LOCAL LOGO */
               return `<img  src=${path.join(plugins_folder,plugin.local.name,plugin.local.logo)}>`
            }else{
               if(plugin.repo !=undefined){
                  if(plugin.repo.package.logo!=undefined){ /* ONLINE LOGO */
                     return `<img  src=${"https://raw.githubusercontent.com/"+plugin.repo.git.owner.login+"/"+plugin.repo.git.name+"/master/"+plugin.local.logo+"?sanitize=true"}>`
                  }else{ /* DYNAMIC ONLINE LOGO */
                     return  graviton.getTypePlugin(plugin.repo.package) == "theme" || graviton.getTypePlugin(plugin.repo.package) == "custom_theme" ? "<div class=img >"+icons.market_theme+"</div>":"<div class=img >"+icons.market_plugin+"</div>"
                  }
               }else{ /* DYNAMIC LOCAL LOGO */
                  return  graviton.getTypePlugin(plugin.local) == "theme" || graviton.getTypePlugin(plugin.local) == "custom_theme" ? "<div class=img >"+icons.market_theme+"</div>":"<div class=img >"+icons.market_plugin+"</div>"
               }
            }
         }else{ /* DYNAMIC ONLINE LOGO */
              if(plugin.repo.package.logo !=undefined){
                  return `<img  src=${"https://raw.githubusercontent.com/"+plugin.repo.git.owner.login+"/"+plugin.repo.git.name+"/master/"+plugin.repo.package.logo+"?sanitize=true"}>`
              }else{
                  return graviton.getTypePlugin(plugin.repo.package) == "theme" || graviton.getTypePlugin(plugin.repo.package) == "custom_theme" ? "<div class=img >"+icons.market_theme+"</div>":"<div class=img >"+icons.market_plugin+"</div>"
              } 
         }
      })()}
      <div>
         <h1>${name}</h1>
         <p>${plugin.repo!=undefined?plugin.repo.package.description:plugin.local.description}</p>
         <p>${getTranslation("MadeBy")} ${plugin.repo!=undefined?plugin.repo.package.author:plugin.local.author}</p>
         <p>${getTranslation("Version")}: ${plugin.repo!=undefined?update=='false'?plugin.repo.package.version:plugin.local.version+" ( 🎉 update: "+plugin.repo.package.version+" )":plugin.local.version}</p>
         <p>${getTranslation("Stars")}: ${plugin.repo!=undefined?plugin.repo.git.stargazers_count:"Unknown"}</p>
         ${plugin.repo!=undefined?`
         <p class=link onclick="shell.openExternal('www.github.com/Graviton-Code-Editor/plugins_list/issues')">${getTranslation(`Report`)}</p>`:""}

      </div>
      
      <div>
         <div>
            ${(function(){ if(plugin.local!=undefined){ return ` ${(function(){ if(plugin.local.colors!=undefined){ return ` <button class=button1 onclick="graviton.setTheme('${name}');">Select</button>` }else{ return "" } })()}
            <button onclick="Market.updateExtension('${name}')" id=${Math.random()+ 'update'} class=button1>${getTranslation("Update")}</button>
            <button onclick="Market.uninstallExtension('${name}')" id=${Math.random()+ 'uninstall'} class=button1>${getTranslation("Uninstall")}</button> ` }else{ return `<button onclick="Market.installExtension('${name}')" id=${Math.random()+
               'install'} class=button1>${getTranslation("Install")}</button> `; } })()}
         </div>
      </div>
   </div>
</div>
<div class=ext_content>
   <navbar id=plugin_navbar style="display:flex; justify-content:center; align-items:center">
      <a ref=readme class="active" >${getTranslation("Readme")}</a>
      <a ref=permissions >${getTranslation("Permissions")}</a>
      <a ref=screenshoots ${plugin.local!=undefined? plugin.local.screenshoots!=undefined? "":'style="display:none;"':'style="display:none;"'}>${getTranslation("Screenshots")}</a>
   </navbar>
   <div id=plugin_navbar_refs> 
      <div ref=permissions style="display:none;">
         <ul  class="list">
            ${ (function(){ let html = ""; if((plugin.repo!=undefined?plugin.repo.package.icons:plugin.local.icons) != undefined){ html += `
            <li>${getTranslation("PermissionCustomIcons")}</li>` } if((plugin.repo!=undefined?plugin.repo.package.css : plugin.local.css) != undefined){ html += `
            <li> ${ getTranslation("PermissionCustomStyling") } </li>` } if ((plugin.repo != undefined ? plugin.repo.package.colors : plugin.local.colors) != undefined) { html += `
            <li>${getTranslation("PermissionCustomColors")}</li>` } if ((plugin.repo != undefined ? plugin.repo.package.main: plugin.local.main) != undefined) { html += `
            <li>${getTranslation("PermissionExecuteJavaScript")}</li>` } return html; })() }
         </ul>
      </div>
      <div ref=readme id=${ name + 'readme'} class=readme-container >
         <p> Loading... </p>
      </div>
      <div class=image-scroller ref=screenshoots  id=${ name + '_screenshoots'} style="display:none;">
         <elastic-container related=parent direction=horizontal></elastic-container>
      </div>
   </div>
</div>
</elastic-container>`
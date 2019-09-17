`
<div onclick=Market.openSubExtensions(this) class=extension_div id=${sec_ID} name=${_package.name} update=${_new_update}>
   ${_new_update?icons["update"]:""}
   <div >
      ${(function(){
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
      
      <div class=text>
         <h3>${data.name} </h3>
         <p class=description>${data.description} </p>
      </div>
   </div>
   <p class=installed>${plugin.local!=undefined?` ${getTranslation("Installed")} · v${plugin.local.version} ·`:` v${plugin.repo.package.version} · `}    ${data.stargazers_count} ${icons.star} </p>
</div>`
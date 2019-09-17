`
<div onclick=Market.openSubExtensions(this) class=extension_div id=${sec_ID} name=${plugin.local.name} update=${_new_update}>
   ${_new_update?icons["update"]:""}
   <div >
   ${(function(){
      /* 

         Case 1( It has a logo):
            The logo is loaded locally
            
         Case 2(It doesn't have any logo):
            It shows a dynamic logo base on the local package.json

      */
      if(plugin.local !=undefined){
         if(plugin.local.logo !=undefined){  /* LOCAL LOGO */
            return `<img  src=${path.join(plugins_folder,plugin.local.name,plugin.local.logo)}>`
         }else{
            return  graviton.getTypePlugin(plugin.local) == "theme" || graviton.getTypePlugin(plugin.local) == "custom_theme" ? "<div class=img >"+icons.market_theme+"</div>":"<div class=img >"+icons.market_plugin+"</div>"
         }
      }
   })()}
      <div class=text>
         <h3>${plugin.local.name} </h3>
         <p class=description>${plugin.local.description} </p>
      </div>
   </div>
   <p class=installed>v${plugin.local.version}${plugin.repo!=undefined?` ${plugin.repo.git.stargazers_count!=undefined? `· ${plugin.repo.git.stargazers_count} ${icons.star}`:""}`:""} </p>
</div>
`
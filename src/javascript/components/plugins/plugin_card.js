

function retrieveCard({
  plugin,
  newUpdate,
  isInstalled,
  packageConf,
  repository,
  clickable = true
}) {
  const updateIcon = puffin.element(`<div>${newUpdate ? icons.update : ""}</div>`, { props: [] });

  const cardLogo = puffin.element(`<div></div>`, { props: [] });

  if (packageConf.logo == undefined) {
    switch (graviton.getTypePlugin(packageConf)) {
      case "theme":
      case "custom_theme":
        cardLogo.node.innerHTML = `<div class='img' >${icons.market_theme}</div>`;
        break;
      case "plugin":
        cardLogo.node.innerHTML = `<div class='img' >${icons.market_plugin}</div>`;
        break;
    }
  } else {
    if(isInstalled){
      cardLogo.node.innerHTML = `<img src="${path.join(
        plugins_folder,
        plugin.local.name,
        plugin.local.logo
      )}"/>`;
    }else{
      cardLogo.node.innerHTML = `<img  src="https://raw.githubusercontent.com/${repository.owner.login}/${repository.name}/master/${packageConf.logo}?sanitize=true">`;
    }
  }

  const cardBottom = puffin.element(`<div></div>`, { props: [] });

  if(repository === undefined){
    cardBottom.node.innerHTML = `v${packageConf.version} · ${getTranslation('Installed')} `
  }else{
    if(isInstalled){
      cardBottom.node.innerHTML = `v${packageConf.version} · ${getTranslation('Installed')} · ${repository.stargazers_count}${icons.star}`
    }else{
      cardBottom.node.innerHTML = `v${packageConf.version} · ${repository.stargazers_count}${icons.star}`
    }
  }

  const pluginCard = puffin.element(
    `
      <div click="$openMe" class="extension_div" name="${
        packageConf.name
      }" update="${newUpdate}">
        ${newUpdate ? "<updateIcon/>" : ""} 
      <div>
        <cardLogo/>
        <div class="text">
          <h3 class="plugin_name_prop" >${packageConf.name} </h3>
          <p class="plugin_description_prop">${packageConf.description}</p>   
        </div>
      </div>
      <div class="installed"> 
        <cardBottom/>
      </div>
      </div>
    `,
    {
      components: {
        updateIcon,
        cardLogo,
        cardBottom
      },
      props: [],
      methods: [
        function openMe() {
          if(clickable){
            Market.openSubExtensions({
              name:packageConf.name,
              update:newUpdate
            });
          }
        }
      ]
    }
  );
  return pluginCard;
}

module.exports = retrieveCard;

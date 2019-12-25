

function retrieveWindow({
  plugin,
  newUpdate,
  isInstalled,
  package,
  repository,
  remotePackage
}) {
  console.log(isInstalled)
  const pluginLogo = puffin.element(`<div></div>`, { props: [] });

  if (package.logo == undefined) {
    switch (graviton.getTypePlugin(package)) {
      case "theme":
      case "custom_theme":
        pluginLogo.node.innerHTML = `
        <div>
          <div draggable="false" class='img' >${icons.market_theme}</div>
          <div class="colors_list">
            <div class="theme_card_accent" style="background:${package.colors.accentDarkColor}"></div>
            <div class="theme_card_accent" style="background:${package.colors.accentLightColor}"></div>
            <div class="theme_card_accent" style="background:${package.colors.accentColor}"></div>
          </div>
        </div>
        `;
        break;
      case "plugin":
        pluginLogo.node.innerHTML = `
          <div draggable="false" class='img' >${icons.market_plugin}</div>
        `;
        break;
    }
  } else {
    switch (isInstalled) {
      case false:
        switch (graviton.getTypePlugin(package)) {
          case "theme":
          case "custom_theme":
            pluginLogo.node.innerHTML = `
            <div>
              <img draggable="false" src="https://raw.githubusercontent.com/${repository.owner.login}/${repository.name}/master/${package.logo}?sanitize=true">
              <div class="colors_list">
                <div class="theme_card_accent" style="background:${package.colors.accentDarkColor}"></div>
                <div class="theme_card_accent" style="background:${package.colors.accentLightColor}"></div>
                <div class="theme_card_accent" style="background:${package.colors.accentColor}"></div>
              </div>
            </div>
            `;
            break;
          case "plugin":
            pluginLogo.node.innerHTML = `
              <img draggable="false" src="https://raw.githubusercontent.com/${repository.owner.login}/${repository.name}/master/${package.logo}?sanitize=true">
            `;
            break;
        }
       
        break;
      case true:
        switch (graviton.getTypePlugin(package)) {
          case "theme":
          case "custom_theme":
            pluginLogo.node.innerHTML = `
            <div>
              <img draggable="false" src="${path.join(
                plugins_folder,
                plugin.package.name,
                plugin.package.logo
              )}"/>
              <div class="colors_list">
                  <div class="theme_card_accent" style="background:${package.colors.accentDarkColor}"></div>
                  <div class="theme_card_accent" style="background:${package.colors.accentLightColor}"></div>
                  <div class="theme_card_accent" style="background:${package.colors.accentColor}"></div>
                </div>
            </div>
            `;
            break;
          case "plugin":
            pluginLogo.node.innerHTML = `
            <img draggable="false" src="${path.join(
              plugins_folder,
              plugin.package.name,
              plugin.package.logo
            )}"/>
            `;
            break;
        }
        break;
    }
  }
  const pluginContent = puffin.element(`
  <div>
    <div>
      <h1>${package.name}</h1>
      <p>${package.description}</p>
      <p>${getTranslation("MadeBy")}${package.author}</p>
      <p>${getTranslation("Version")}: ${package.version} ${newUpdate?"(🎉 update:"+remotePackage.version+")":""}</p>
      <p>${getTranslation("Stars")}: ${plugin.repo != undefined ? plugin.repo.git.stargazers_count : "Unknown"}</p>
      <p class="link" onclick="shell.openExternal('www.github.com/Graviton-Code-Editor/plugins_list/issues')">${getTranslation("Report")}</p>
    </div>
  </div>`, { props: [] });
  const pluginButtons = puffin.element(`
  <div>
  ${(function() {
    let button_content = "";
    if (isInstalled) {
      if (newUpdate) {
        button_content += `
          <button onclick="Market.updateExtension('${package.name}')" id="${Math.random() +
          "update"}" class="button1">${getTranslation(
          "Update"
        )}</button>
      `;
      }
      if (plugin.package.colors != undefined) {
        button_content += `
          <button class="button1" onclick="graviton.setTheme('${package.name}'); graviton.saveConfiguration();">${getTranslation("Select")}</button>
       `;
      }
      button_content += ` <button onclick="Market.uninstallExtension('${package.name}')" id="${Math.random() +
        "uninstall"}" class="button1">${getTranslation(
        "Uninstall"
      )}</button>`;
      return button_content;
    } else {
      return `<button onclick="Market.installExtension('${package.name}')" id="${Math.random() +
        "install"}" class="button1">${getTranslation(
        "Install"
      )}</button> `;
    }
  })()}
  
  </div>`, { props: [] });

  const pluginTabs = puffin.element(`
    <gv-navbar class="top-bar">
        <gv-navbutton href="readme" default="" >${getTranslation(
            "Readme"
        )}</gv-navbutton>
        <gv-navbutton href="permissions" >${getTranslation(
            "Permissions"
        )}</gv-navbutton>
        ${package.screenshots? `<gv-navbutton href="screenshots" >${getTranslation(
            "Screenshots"
        )}</gv-navbutton>`:""}  
    </gv-navbar>`, { props: [] });

    const pluginTabsContent = puffin.element(`
    <ul  class="list">
    ${(function() {
        let content = "";
        switch(graviton.getTypePlugin(package)){
            case "custom_theme":
                    content += ` <li>${getTranslation("PermissionCustomStyling")}</li>`;
                    if(package.icons != undefined){
                      content += ` <li>${getTranslation("PermissionCustomIcons")}</li>`;
                    }
            case "theme":
                    content += ` <li>${getTranslation("PermissionCustomColors")}</li>`;
             break;
            case "plugin":
                    content += ` <li>${getTranslation("PermissionExecuteJavaScript")}</li>`;
             break;
        }
        return content;
      })()}
    </ul>
   `, { props: [] });

  const pluginPage = puffin.element(
    `
    <elastic-container related="parent" >
    <div style="padding:15px;" class="extension_window">
    <div class="sub_extension_div" id="${package.name}_div">
        <div class="top">
            <pluginLogo/>
            <pluginContent/> 
            <div>
                <div>
                    <pluginButtons/>
                </div>
            </div>
        </div>
    </div>
    <div class="ext_content">
        <gv-navpanel class="top-bar">
        <pluginTabs/>
        <gv-navcontent>
            <gv-navpage href="readme" id="${package.name}_readme" class="readme-container" default="">
                <p> Loading...</p>
            </gv-navpage>
            <gv-navpage href="permissions" >
               <pluginTabsContent/>
            </gv-navpage>
            <gv-navpage href="screenshots" class="image-scroller" ref="screenshots"  id="${package.name}_screenshots" style="height:300px; overflow-y:hidden;">
                <elastic-container related="self"  direction="horizontal"></elastic-container>
            </gv-navpage>
        </gv-navcontent>
        </gv-navpanel>
        </div>
    </div>
    </elastic-container>
  `,
    {
      components: {
        pluginLogo,
        pluginContent,
        pluginButtons,
        pluginTabs,
        pluginTabsContent
      },
      props: [],
      methods: [
        function installMe() {
          alert("installing");
        }
      ]
    }
  );
  return pluginPage;
}

module.exports = retrieveWindow;

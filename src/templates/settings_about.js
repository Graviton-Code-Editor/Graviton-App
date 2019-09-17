`
<h4>${getTranslation("About")} </h4>
<div class="section-1">
   <p>${getTranslation("About-text1")}</p>
   <p>${getTranslation("About-text2")}</p>
   <button class="button1" onclick="shell.openExternal('https://www.graviton.ml')">Website</button>
   <button class="button1" onclick="shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/')">Source Code</button>
   <button class="button1" onclick="shell.openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md')">License</button>
</div>
<h4>${getTranslation("CurrentVersion")}</h4>
<div class="section-1">
   <div id="about_section">
      <p>${getTranslation("Version")}: ${GravitonInfo.version} (${ GravitonInfo.date }) - ${GravitonInfo.state}</p>
      <p>${getTranslation("OS")}: ${ graviton.currentOS().name }
      </p>
   </div>
   <button class="button1" onclick="graviton.dialogChangelog();">${
    getTranslation("Changelog")
  }</button>
   <button class="button1" onclick="updater.check_updates();">${
    getTranslation("CheckUpdates")
  }</button>
</div>`
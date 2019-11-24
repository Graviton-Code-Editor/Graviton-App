`
<elastic-container related=self>
  <gv-blocktitle>${getTranslation("Performance")}</gv-blocktitle>
  <gv-blockcontent>
    <div class="inline-widget">
      <gv-switch onclick="graviton.toggleAnimations()" class="${
        current_config.animationsPreferences
      }"></gv-switch>
        <h5>${getTranslation("Settings-Advanced-Performance-Animations")} </h5>
    </div>
  </gv-blockcontent>
  <gv-blocktitle>${getTranslation("Developers")}</gv-blocktitle>
  <gv-blockcontent>
      <p>${getTranslation("Settings-Advanced-Developer-Tools-text")}</p>
      <button class="button1" onclick="graviton.openDevTools();">${getTranslation(
        "DeveloperTools"
      )}</button>
      <p>${getTranslation("Settings-Advanced-Developer-Tools-text2")}</p>
        <button class="button1" onclick="shell.openItem(DataFolderDir)">${getTranslation(
          "Open Configuration"
        )}</button>
    </gv-blockcontent>
    <gv-blocktitle>${getTranslation("FactoryReset")}</gv-blocktitle>
    <gv-blockcontent>
      <p>${getTranslation("Settings-Advanced-FactoryReset-text")}
      </p>
      <button class="button1 red" onclick="graviton.factoryResetDialog();">${getTranslation(
        "FactoryReset"
      )}</button>
  </gv-blockcontent>
</elastic-container>`;

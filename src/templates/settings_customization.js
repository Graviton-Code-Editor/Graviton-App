`
  <gv-blocktitle>${getTranslation("Themes")}</gv-blocktitle>
   <gv-blockcontent>
      <div id='theme_list' style="min-height:50px;"></div>
      ${(function() {
        if (themes.length != 0) {
          return `
      <p class="link"  onclick="closeWindow('settings_window');Market.open(function(){Market.navigate('all')})">${getTranslation(
        "Market"
      )}
      </p>
      `;
        } else {
          return "";
        }
      })()}
      <p>${getTranslation("Themes.Text")}</p>
      <gv-switch onclick="graviton.useSystemAccent(); saveConfig();" class="${
        current_config.accentColorPreferences == "system"
          ? "activated"
          : "desactivated"
      }"></gv-switch>
  </gv-blockcontent>
  <gv-blocktitle>${getTranslation("Miscellaneous")}</gv-blocktitle>
  <gv-blockcontent>
    <div class="section-1 inline">
      <h5>${getTranslation("ZoomSize")}</h5>
      <input id="slider_zoom" onchange="Settings.refresh(); saveConfig();" type="range" min="0" step="5" max="50" value="${
        current_config.appZoom
      }" class="slider">
    </div>
    <div class="section-1 inline">
      <button class="Button1" onClick="graviton.setZoom(25); document.getElementById('slider_zoom').value=25;">${getTranslation(
        "DefaultZoom"
      )}</button>
    </div>
    <div class="section-1 inline">
      <h5>${getTranslation("Blur")}</h5>
      <input id="slider_blur" onchange="Settings.refresh(); saveConfig();" type="range" min="0" step="0.2" max="50" value="${
        current_config.blurPreferences
      }" class="slider">
    </div>
    <div class="section-1 inline">
      <h5>${getTranslation("Bounce")}</h5>
      <gv-switch onclick="graviton.toggleBounceEffect(); saveConfig();" class="${
        current_config.bouncePreferences
      }"></gv-switch>
    </div>
    <div class="section-1 inline">
      <h5>${getTranslation("ZenMode")}</h5>
      <gv-switch onclick="graviton.toggleZenMode()" class="${
        editor_mode != " zen " ? "activated " : "desactivated "
      }"></gv-switch>
    </div>
    </gv-blockcontent>
    <gv-blocktitle>${getTranslation("ExplorerPosition")}</gv-blocktitle>
    <gv-blockcontent>
      <label class="radio" onclick="graviton.changeExplorerPosition('left'); saveConfig();"  value="Left" ${
        current_config.explorerPosition === "left" ? "checked" : ""
      }>
        Left
        <input type="radio" name="explorer_position"  ${
          current_config.explorerPosition === "left" ? "checked" : ""
        }>
        <span class="radio_dot"></span>
      </label>
      <label class="radio" onclick="graviton.changeExplorerPosition('right'); saveConfig();"  value="Right">
        Right
        <input type="radio" name="explorer_position"  ${
          current_config.explorerPosition === "right" ? "checked" : ""
        }>
        <span class="radio_dot"></span>
      </label>
    </gv-blockcontent>
      
 `;
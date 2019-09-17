`
<h4>${getTranslation("FontSize")}</h4>
<div class="section-1">
   <input class="input1" id="fs-input" onchange="graviton.setEditorFontSize(this.value)" type="number" value="${
    current_config.fontSizeEditor
  }">
</div>
<h4>${getTranslation("Auto-Completion")}</h4>
<div class="section-1">
   <p>${ getTranslation( "Settings-Editor-AutoCompletion-text" ) } </p>
   <gv-switch onclick="graviton.toggleAutoCompletation();  saveConfig();" class="${
    current_config.autoCompletionPreferences
  }"></gv-switch>
</div>
<h4>${getTranslation("Line-Wrapping")}</h4>
<div class="section-1">
   <gv-switch onclick="graviton.toggleLineWrapping(); saveConfig();" class="${
    current_config.lineWrappingPreferences
  }"></gv-switch>
</div>
<h4>${getTranslation("Highlighting")}</h4>
<div class="section-1">
   <gv-switch onclick="graviton.toggleHighlighting(); saveConfig();" class="${g_highlighting}"></gv-switch>
</div>`
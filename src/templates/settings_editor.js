`
<div class="section-1 inline">
   <h5>${getTranslation('FontSize')}</h5>
   <input class="input1" id="fs-input" onchange="graviton.setEditorFontSize(this.value)" type="number" value="${
  current_config.fontSizeEditor
}">
</div>

<div class="section-1 inline">
   <h5>${getTranslation('Auto-Completion')}</h5>
   <gv-switch onclick="graviton.toggleAutoCompletation();  saveConfig();" class="${
  current_config.autoCompletionPreferences
}"></gv-switch>
</div>

<div class="section-1 inline">
   <h5>${getTranslation('Line-Wrapping')}</h5>
   <gv-switch onclick="graviton.toggleLineWrapping(); saveConfig();" class="${
  current_config.lineWrappingPreferences
}"></gv-switch>
</div>

<div class="section-1 inline">
   <h5>${getTranslation('Highlighting')}</h5>
   <gv-switch onclick="graviton.toggleHighlighting(); saveConfig();" class="${g_highlighting}"></gv-switch>
</div>`

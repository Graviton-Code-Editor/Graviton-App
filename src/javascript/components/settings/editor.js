const { puffin } = require("@mkenzo_8/puffin")

const editorSection = puffin.element(`
    <div>
        <div class="inline-widget">
            <input class="input1" id="fs-input" onchange="graviton.setEditorFontSize(this.value)" type="number" value="${
            current_config.fontSizeEditor
            }"/>
            <h5>${getTranslation("FontSize")}</h5>
        </div>
        <div class="inline-widget">
            <gv-switch onclick="graviton.toggleAutoCompletation();  saveConfig();" class="${
            current_config.autoCompletionPreferences
            }"></gv-switch>
            <h5>${getTranslation("Auto-Completion")}</h5>
        </div>
        <div class="inline-widget">
            <gv-switch onclick="graviton.toggleLineWrapping(); saveConfig();" class="${
            current_config.lineWrappingPreferences
            }"></gv-switch>
            <h5>${getTranslation("Line-Wrapping")}</h5>
        </div>
        <div class="inline-widget">
            <gv-switch onclick="graviton.toggleHighlighting(); saveConfig();" class="${g_highlighting}"></gv-switch>
            <h5>${getTranslation("Highlighting")}</h5>
        </div>
    </div>
`,{
    
})

module.exports = editorSection
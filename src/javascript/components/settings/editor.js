const { puffin } = require("@mkenzo_8/puffin")

const shortCutButton = puffin.element(`
    <div click="$changekey"  combo="{{combo}}" action="{{action}}" class="round-box">
        <p>{{action}}</p>
        <b>{{combo}}</b>
    </div>
`,{
    props:["action","combo"],
    methods:[
        function changekey(){
            const button = this;
            new Dialog({
                title:"Modify shortcut",
                content: `
                    <input class='section-1 input2'  id="change_key_input" placeHolder="${this.getAttribute("combo")}"/>
                `,
                buttons:{
                    [getTranslation("Continue")]:{
                        click:function(e){
                            current_config.shortCuts.filter(a=>a.action == button.getAttribute("action"))[0].combo = document.getElementById("change_key_input").value
                            GravitonState.emit("KeyShortCutsChanged",current_config.shortCuts)
                        }
                    }
                }
            })
        }
    ]
})


let content = "";

graviton.getConfiguration().shortCuts.map(function(sh){
    content += `
        <shortCutButton action="${sh.action}" combo="${sh.combo}"/>
    `
})

const shortCutList = puffin.element(`
    <div>${content}</div>
`,{
    components:{
        shortCutButton
    }
})


const editorSection = puffin.element(`
    <div>
        <gv-blocktitle>${getTranslation("Editor")}</gv-blocktitle>
        <gv-blockcontent>
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
        </gv-blockcontent>
        <gv-blocktitle>${getTranslation("KeyBindings")}</gv-blocktitle>
        <gv-blockcontent>
            <shortCutList/>
        </gv-blockcontent>
    </div>
`,{
    components:{
        shortCutList
    }
})

module.exports = editorSection
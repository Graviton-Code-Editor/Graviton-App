const { puffin } = require("@mkenzo_8/puffin")
const ThemeCard = require("../plugins/theme_card.js")

const customizationSection = puffin.element(`
    <div>
        <gv-blocktitle>${getTranslation("Themes")}</gv-blocktitle>
        <gv-blockcontent>
            <div id="theme_list" style="min-height:60px; padding:10px 0px; margin:5px 0px; overflow-y:hidden; overflow-x:scroll;">
            <elastic-container direction="horizontal">
            ${(function() {
                let content = "";
                themes.map((th)=>{
                    content += `<ThemeCard id="theme_card_${th.name}" author="${getTranslation("By")} ${th.author}" description="${th.description}" accent="${th.colors.accentColor}" accentLight="${th.colors.accentLightColor}" accentDark="${th.colors.accentDarkColor}" name="${th.name}"></ThemeCard> `
                })
                if (themes.length !== 0) {
                   return content;
                }
            })()}
            </elastic-container>
            </div>
            <div class=" inline-widget">
            <gv-switch onclick="graviton.useSystemAccent(); graviton.saveConfiguration();" class="${
            current_config.accentColorPreferences == "system"
                ? "activated"
                : "desactivated"
            }"></gv-switch>
            <h5>${getTranslation("Themes.Text")}</h5>
        </div>   
        </gv-blockcontent>
        <gv-blocktitle>${getTranslation("Miscellaneous")}</gv-blocktitle>
        <gv-blockcontent>
        <div class="inline-widget">
            <input id="slider_zoom" onchange="Settings.refresh(); graviton.saveConfiguration();" type="range" min="0" step="5" max="50" value="{{appZoom}}" class="slider"/>
            <h5>${getTranslation("ZoomSize")}</h5>
        </div>
        <div class="inline-widget">
            <button class="Button1" click="$setDefaultZoom">${getTranslation(
            "DefaultZoom"
            )}</button>
        </div>
        <div class="inline-widget">
            <input id="slider_blur" onchange="Settings.refresh(); graviton.saveConfiguration();" type="range" min="0" step="0.2" max="50" value="{{blurPreferences}}" class="slider"/>
            <h5>${getTranslation("Blur")}</h5>
        </div>
        <div class="inline-widget">
            <gv-switch onclick="graviton.toggleBounceEffect(); graviton.saveConfiguration();" class="${
            current_config.bouncePreferences
            }"></gv-switch>
            <h5>${getTranslation("Bounce")}</h5>
        </div>
        <div class="inline-widget">
            <gv-switch onclick="graviton.toggleZenMode()" class="${
            editor_mode != " zen " ? "activated " : "desactivated "
            }"></gv-switch>
            <h5>${getTranslation("ZenMode")}</h5>
        </div>
        </gv-blockcontent>
        <gv-blocktitle>${getTranslation("Explorer")}</gv-blocktitle>
        <gv-blockcontent>
            <h5>${getTranslation("ExplorerPosition")}</h5>
            <label class="radio" onclick="graviton.changeExplorerPosition('left'); graviton.saveConfiguration();"  value="Left" ${
                current_config.explorerPosition === "left" ? 'checked=""' : ""
            }> Left
                <input type="radio" name="explorer_position"  ${
                current_config.explorerPosition === "left" ? 'checked=""' : ""
                }/>
                <span class="radio_dot"></span>
            </label>
            <label class="radio" onclick="graviton.changeExplorerPosition('right'); graviton.saveConfiguration();"  value="Right"> Right
            <input type="radio" name="explorer_position"  ${
                current_config.explorerPosition === "right" ? 'checked=""' : ""
            }/>
            <span class="radio_dot"></span>
            </label>
            <div class="inline-widget">
            <gv-switch onclick="graviton.toggleNPMPanel(); graviton.saveConfiguration();" class="${
                current_config.npm_panel ? "activated" : "desactivated"
            }"></gv-switch>
            <h5>${getTranslation("NPMPanel")}</h5>
            </div>
        </gv-blockcontent>
    </div>
`,{
    components:{
        ThemeCard
    },
    events:{
        mounted(target){
            target.props.blurPreferences = GravitonState.data.currentConfig.blurPreferences
            target.props.appZoom = GravitonState.data.currentConfig.appZoom
        }
    },
    methods:[
        function setDefaultZoom(){
            graviton.setZoom(25); 
        }
    ],
    props:["blurPreferences","appZoom"]
})

module.exports = customizationSection
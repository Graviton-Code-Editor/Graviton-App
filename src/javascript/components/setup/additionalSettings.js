const { puffin } = require("@mkenzo_8/puffin")

const additionalSettingsPage = puffin.element(`
    <div>
        <h1 style="font-size:5vh; text-align:center;" class="translate_word" idT="Welcome.TakeATheme">${
            getTranslation('Welcome.AdditionalSettings')}
        </h1>
        <div style="overflow:auto; position:relative;max-height:60%"  class="center-column">
            <div class="section-1">
                <div class="section-4">
                    <p>${getTranslation('ZoomSize')}</p>
                    <input id="slider_zoom" change="$refreshSettings" type="range" min="0" step="5" max="50"
                    value="${
                        current_config.appZoom
                    }" class="slider-widget"/>
                </div>
                <div class="section-4">
                    <p>${getTranslation('Blur')}</p>
                    <input id="slider_blur" change="$refreshSettings" type="range" min="0" step="0.2" max="50"
                    value="${
                        current_config.blurPreferences
                    }" class="slider-widget"/>
                </div>
                <div class="section-4">
                    <p>${getTranslation('Bounce')}</p>
                    <gv-switch click="$changebounce" class="${
                        current_config.bouncePreferences
                    }"></gv-switch>
                </div>
            </div>
        </div>
        <button click="$goBack" class="button1 fullScreenWindow-left">${
            getTranslation('Back')
        }</button>
        <button click="$goForward" class="button1 fullScreenWindow-right" >${
            getTranslation('Continue')
        }</button>
    </div>
`,{
    methods:[
        function goBack(){
            Setup.navigate("themes");
        },
        function goForward(){
            Setup.navigate("suggestions");
        },
        function refreshSettings(){
            Settings.refresh(); 
            graviton.saveConfiguration();
        },
        function changeBounce(){
            this.toggle();
            graviton.toggleBounceEffect();
            graviton.saveConfiguration();
        }
    ]
})

module.exports = additionalSettingsPage
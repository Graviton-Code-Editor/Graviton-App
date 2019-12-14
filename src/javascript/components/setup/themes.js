const { puffin } = require("@mkenzo_8/puffin")


const themeComponent = puffin.element(`
    <img draggable="false" class="theme_div2" click="$setMe"/> 
`,{
    props:[
        "src","name","class"
    ],
    methods:[
        function setMe(){
            graviton.setTheme(this.getAttribute("name")); 
            selectionFromTo(this.parentElement,this);
        }
    ]
})


const themesPage = puffin.element(`
    <div>
        <h1 style="font-size:5vh; text-align:center;" class="translate_word" idT="Welcome.TakeATheme">${
            getTranslation('Welcome.TakeATheme')}
        </h1>
        <div class="theme_divs">
            <themeComponent name="Dark" class="${current_config.theme == 'Dark' ? 'active' : ''}" src="src/icons/dark.svg"/>
            <themeComponent name="Arctic" class="${current_config.theme == 'Arctic' ? 'active' : ''}" src="src/icons/light.svg"/>
        </div>
        <button click="$goBack" class="button1 fullScreenWindow-left translate_word" idT="Back">${
            getTranslation('Back')
        }</button>
        <button click="$goForward" class="button1 fullScreenWindow-right translate_word" idT="Continue">${
            getTranslation('Continue')
        }</button>
    </div>
`,{
    components:{
        themeComponent
    },
    methods:[
        function goBack(){
            Setup.navigate("languages"); 
        },
        function goForward(){
            Setup.navigate("additional_settings");
        }
    ]
})

module.exports = themesPage
const { puffin } = require("@mkenzo_8/puffin")

const languagesComponent = puffin.element(`
    <div class="language_div" click="$loadMe">
        <div class="language_text">{{name}}</div>
    </div>
`,{
    props:[
        "name","class"
    ],
    methods:{
        loadMe(){
            loadLanguage(this.getAttribute("name")); 
            selectionFromTo(this.parentElement,this);
        }
    }
})

const languagesPage = puffin.element(`
<div>
    <h1 style="font-size:5vh; line-height:3em; text-align:center; position:relative; " class="translate_word" idT="Languages">${
        getTranslation('Languages')
    }</h1>
    <div id='language_list' class="welcome">
        <elastic-container related="parent"></elastic-container>
        ${(function(){
            let content = "";
            for (i = 0; i < languages.length; i++) {
               content += `<languagesComponent name="${languages[i].name}" class="${graviton.getUILanguage() == languages[i].name ? "active":""}"/>`
              }
            return content
        })()}
    </div>
    <button click="$goForward" class="button1 fullScreenWindow-right translate_word" idT="Continue">${
        getTranslation('Continue')
    }</button>
</div>
`,{
    components:{
        languagesComponent
    },
    methods:{
        goForward(){
            if(themes.length){
                Setup.navigate('themes') 
            }else{
                Setup.navigate('additional_settings')
            }
        }
    }
})

module.exports = languagesPage
const { puffin } = require("@mkenzo_8/puffin")


const languageComponent = puffin.element(`
    <div class="language_div" click="$loadMe">
        <div class="language_text"></div>
    </div>
`,{
    props:[
        {
            class:"language_div",
            type:"attribute",
            attribute:"name",
            value:"$name"
        },
        {
            class:"language_div",
            type:"attribute",
            attribute:"class",
            value:"$class"
        },
        {
            class:"language_text",
            type:"text",
            value:"$name"
        }
    ],
    methods:[
        function loadMe(){
            loadLanguage(this.getAttribute("name")); 
            selectionFromTo(this.parentElement,this);
        }
    ]
})


const languagesSection = puffin.element(`
<div>
    <div>
        <elastic-container related="parent"></elastic-container>
        ${(function(){
            let content = "";
            for (i = 0; i < languages.length; i++) {
               content += `<languageComponent name="${languages[i].name}" class="${graviton.getUILanguage() == languages[i].name ? "active":""}"/>`
              }
            return content
        })()}
    </div>
</div>
`,{
    components:{
        languageComponent
    }
})

module.exports = languagesSection
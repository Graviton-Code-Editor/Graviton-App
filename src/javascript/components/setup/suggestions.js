const { puffin } = require("@mkenzo_8/puffin")

const suggestionsPage = puffin.element(`
<div>
    <div>
        <h1 style="font-size:5vh; line-height:3em; text-align:center; position:relative; " class="translate_word" idT="Languages">${
            getTranslation('Suggestions')
        }</h1>
        <div class="center-column">
            Loading...
        </div>
    </div>
    <div style="height:20%;">
    <button click="$goBack"  class="button1 fullScreenWindow-left" >${getTranslation(
    "GoBack"
    )}</button> 
    <button click="$goForward" class="button1 fullScreenWindow-right" >${getTranslation(
    "Continue"
    )}</button> 
    </div>
</div>
`,{
    methods:{
        goBack(){
            Setup.navigate("additional_settings");
        },
        goForward(){
            Setup.navigate("welcome");
        }
    },
    events:{
        mounted(target){
            Market.fetchPlugins(["marc2332/GitPlus"]).then(function(plugins){
                const retrieveCard = require("../plugins/plugin_card")
                const container = target.children[0].children[1]
                container.textContent = "";
                plugins.map(function(plugin){
                    const card = retrieveCard({
                        plugin: plugin,
                        packageConf: plugin.package,
                        newUpdate: false,
                        repository: plugin.git,
                        isInstalled:false,
                        section: "all"
                    });
                    puffin.render(card,container)
                })
            })  
        }
    }
})        

module.exports =  suggestionsPage
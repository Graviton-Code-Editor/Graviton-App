const { puffin } = require("@mkenzo_8/puffin")

const welcomeSetupPage = puffin.element(`
    <div style="min-height: 100%; display: flex; justify-content: center; align-items: center;">
        <div>
            <div style="display:flex; align-items:center;">
                <div style=" display:flex; font-size:5vh; font-weight:900; ">
                    <h3 style="margin:5px; font-size:5vh; margin-right:2vh;">${getTranslation("WelcomeMessage")}</h3>
                    <h3 style="margin:5px; color:var(--accentColor); font-size:5vh;"> Graviton! </h3>
                    <img class="emoji-title" src="src/openemoji/1F973.svg"/>
                </div> 
            </div>
            <br/>
            <div style="display:flex; align-items:center;justify-content: center;">
                <button click="$goBack"  class="button1" >${getTranslation(
                "GoBack"
                )}</button> 
                <button click="$openMarket"  class="button1" >${getTranslation(
                "Market"
                )}</button> 
                <button click="$finish" class="button1" >${getTranslation(
                "Finish"
                )}</button> 
            </div>
        </div>
    </div>
`,{
    methods:{
        openMarket(){
            Market.open()
        },
        goBack(){
            Setup.navigate("suggestions");
        },
        finish(){
            Setup.close(); 
            Welcome.open();
        }
    }
})

module.exports =  welcomeSetupPage
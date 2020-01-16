

const theme_card = puffin.element(`
    <div  click="$setTheme" class="theme_div" id="$id" >
        <div class="theme_div_top">
            <p style="font-size:18px;" >{{name}}</p>
            <p style="font-size:10px;" class="theme_card_author">{{author}}</p>
        </div>
        <p style="font-size:14px; margin:12px 0px;" class="theme_card_description">{{description}}</p>
        <div class="colors_list">
            <div class="theme_card_accent" style="background:{{accentDark}}"></div>
            <div class="theme_card_accent" style="background:{{accentLight}}"></div>
            <div class="theme_card_accent" style="background:{{accent}}"></div>
        </div>  
    </div>
`,{
    props:[
       "description",
       "author",
       "name",
       "accentLight",
       "accent",
       "accentDark"
    ],
    methods:{
        setTheme(){
            graviton.setTheme(this.getAttribute("name"))
            selectionFromTo(this.parentElement,this);
            GravitonState.emit("ConfigurationChanged")
        }
    }
});

module.exports = theme_card;

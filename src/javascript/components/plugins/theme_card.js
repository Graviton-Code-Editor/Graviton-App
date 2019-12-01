

const theme_card = puffin.element(`
    <div  click="$setTheme" class="theme_div" id="$id" >
        <div class="theme_div_top">
            <p style=" font-size:18px; " class="theme_card_name"></p>
            <p style="font-size:10px; "  class="theme_card_author"></p>
        </div>
        <p style="font-size:14px; margin:12px 0px;" class="theme_card_description"></p>
        <div class="theme_card_accent" ></div>
    </div>
`,{
    props:[
       {
        class: "theme_card_name",
        type:"text",
        value:"$name"
       },
       {
        class: "theme_card_description",
        type:"text",
        value:"$description"
       },
       {
        class: "theme_card_author",
        type:"text",
        value:"$author"
       },
       {
        class: "theme_div",
        type:"attribute",
        attribute:"name",
        value:"$name"
       },
       {
        class: "theme_card_accent",
        type:"attribute",
        attribute:"style",
        value:"$accent"
       }
    ],
    methods:[
        function setTheme(){
            graviton.setTheme(this.getAttribute("name"))
            selectionFromTo(this.parentElement,this);
            graviton.saveConfiguration()
        }
    ]
});

module.exports = theme_card;

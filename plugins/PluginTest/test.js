const test = new gPlugin({
  name: "Example Plugin"
})
const testDm = new dropMenu({
  "translation":false
});
const testDm2 = new dropMenu({
  "translation":false
});
testDm.setList({
  "button": "PluginTest",
  "list": {
    "Notification Plugin" : "new Notification(Math.random(),'Plugin Example Notifcation!!');",
    "test editor gettext" :  "new Notification('Text:',editor.getValue())",
    "get the current theme" : "new Notification('Selected theme:',graviton.getCurrentTheme()['Name'])",
    "selected text" :  "new Notification('Selected Text:',graviton.getSelectedText());",
    "Set Light Theme" : "graviton.setThemeByName('Light Accented')",
    "get the current path":"new Notification(graviton.getCurrentFile(),'Plugin Example Notifcation!!');",
    "*line":"fdsfds",
    "Show color":"showColor();",
    "return current editor":"console.log(graviton.getCurrentEditor().filepath)",
    "save key":"save();",
    "get data":"console.log(test.getData());",
    "delete key":"test.deleteData('hey');",
    "delete ALL":"test.deleteData();",
    "add data":"test.setData(Math.random(),'fsdfjsdjfdsj')"
  }
  
});

testDm2.setList({
  "button": "CustomDropMenu",
  "custom": "<h2>Custom DropMenu</h2>"
  
});

test.createData({
    "week":"test",
});
 //Initializes the DB in case it's not already created.
function save(){ //Updates Plugin's DB

    test.saveData({
      "test":"testing..."
    });

}

const config = test.getData(); //Get the PluginDB


function showColor(){
  const floatingwin2 = new floatingWindow([100,100],`
    <div style='height:100px; width:100px; background-color: `+graviton.getSelectedText()+`;'>
    </div>`);

}

new show_color_menu = new contextMenu({
  "Show color":"showColor();"
});


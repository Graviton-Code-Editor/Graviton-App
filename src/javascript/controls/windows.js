/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

//Creating a window, example:

/*

const my_window = new Window({
    id:'my_window1',
    content:'This is a very big window! '
})

my_window.launch(); //Open the window

my_window.close(); //Close the window

closeWindow('my_window1'); //Close the window by passing the id

*/

module.exports = {
    Window : function(data){
        this.id = data.id;
        this.code = data.content;
        this.onClose = data.onClose == undefined ? "" : data.onClose;
        const newWindow = document.createElement("div");
        newWindow.setAttribute("id", this.id + "_window");
        newWindow.setAttribute("style", "-webkit-user-select: none;");
        newWindow.innerHTML = `
            <div class="background_window" onclick="closeWindow('${this.id}'); ${this.onClose}"></div>
            <div id="${this.id+"_body"}" class="body_window">
                ${this.code}
            </div>`;
        this.myWindow = newWindow;
        this.launch = function(){
            document.getElementById("body1").setAttribute("windows",Number(document.getElementById("body1").getAttribute("windows"))+1);
            document.body.appendChild(this.myWindow);
        }
        this.close = function(){
            document.getElementById("body1").setAttribute("windows",Number(document.getElementById("body1").getAttribute("windows"))-1);
            document.getElementById(`${this.id}_window`).remove();
        }
    },
    closeWindow: (id) => {
        document.getElementById("body1").setAttribute("windows",Number(document.getElementById("body1").getAttribute("windows"))-1);
        document.getElementById(`${id}_window`).remove();
    }
}

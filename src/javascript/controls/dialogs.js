/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

//Creating a dialog, example:

/*

const my_dialog = new Dialog({
    id:'my_dialog1',
    title:'A title',
    content:'This is an example button.',
    buttons: {
        'Accept':'closeDialog(this)'
    }
})

closeDialog('my_dialog1'); //Close the dialog by passing the id

*/

module.exports = {
    Dialog:function(dialogObject) {
        if (typeof [...arguments] != "object") {
            graviton.throwError("Parsed argument is not object.")
            return;
        }
        const all = document.createElement("div");
        all.setAttribute("id", dialogObject.id + "_dialog");
        all.setAttribute("style", "-webkit-user-select: none;");
        all.innerHTML = `
            <div myID="${dialogObject.id}" class="background_window" onclick="closeDialog(this)"></div>`
        const body_dialog = document.createElement("div");
        body_dialog.setAttribute("class", "dialog_body");
        body_dialog.innerHTML = `
            <p style="font-size:22px; line-height:5px; margin-top:13px; white-space: nowrap; font-weight:bold;">    
                ${dialogObject.title} 
            </p>
            <div style="font-size:15px; min-height:15px;">
                ${dialogObject.content}
            </div>
            <div class="buttons" style="display:flex;"></div>`;
        Object.keys(dialogObject.buttons).forEach(function(key, index) {
        const button = document.createElement("button");
            button.innerText = key;
            button.setAttribute("myID", dialogObject.id);
            if(typeof dialogObject.buttons[key] == "string"){
                button.setAttribute("onclick", dialogObject.buttons[key]);
            }else{
                button.setAttribute("onclick", dialogObject.buttons[key].click);
                button.setAttribute("class", dialogObject.buttons[key].important==true?"important":"");
            }
            
            body_dialog.children[2].appendChild(button);
        });
        all.appendChild(body_dialog);
        document.body.appendChild(all);
        this.close = function(me) {
            closeDialog(me);
        }
    },
    closeDialog: (id) => {
        document.getElementById(id.getAttribute("myID") + "_dialog").remove();
    }
}


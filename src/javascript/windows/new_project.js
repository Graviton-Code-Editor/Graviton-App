/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanztor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict";

module.exports = {
    NewProject:{
        open:()=>{
            const new_project_window = new Window({
                id:'new_project',
                content:`
                <div class="section-1">
                    <h1>${getTranslation("NewProject")}</h1>
                    <div >
                        <div class="section-2" onclick="createNewProject('html'); closeWindow('new_project');">
                            <p>HTML</p>
                        </div>
                    </div>
                </div>
                
                `
            })

            new_project_window.launch();


        }
    }
}
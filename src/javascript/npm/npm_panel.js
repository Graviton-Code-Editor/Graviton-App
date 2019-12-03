


/**
 * @desc Load NPM scripts panel when a NodeJS project is loaded
*/

"use strict"

document.addEventListener("loaded_project", function() {
  graviton.getEnv().then(result => {
    if (result.env === "node") {
      if(Object.keys(result.scripts).length == 0) return;
      const npm_panel = new Panel({
        id:"npm_panel",
        content: `
          <gv-panel id="npm_scripts_panel">
              <gv-paneltitle>NPM Scripts</gv-paneltitle>
          </gv-panel>
          `,
        visible:current_config.npm_panel
      });      
      for (const script in result.scripts) {
        const button = document.createElement("button");
        button.classList.add("panel_button");
        button.textContent = script;
        button.onclick = () => {
          const { exec } = require("child_process");
          exec(
            `npm ${script}`,
            {
              cwd: graviton.getCurrentDirectory()
            },
            (err,data) => {
              console.log(err,data)
            }
          );
        };
        npm_panel.panelObject.children[0].appendChild(button);
      }
    }
  });
});

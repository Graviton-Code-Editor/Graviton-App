/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanztor

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict";

module.exports = {
  Welcome: {
    open: function() {
      if (graviton.isProduction() == true) {
        if (remote.process.argv[1] != undefined) {
          const dir = path.resolve(remote.process.argv[1]);
          Explorer.load(dir, "g_directories", true);
          if (error_showed == false) DeleteBoot();
          return;
        }
      }
      const welcome_window = new Window({
        id: "welcome_window",
        content: graviton.getTemplate("welcome")
      });
      welcome_window.launch();
      if (document.getElementById("recent_projects") != null) {
        for (i = 0; i < log.length; i++) {
          const project = document.createElement("div");
          project.setAttribute("class", "section-2");
          project.setAttribute(
            "onclick",
            `Explorer.load('${log[i].Path.replace(
              /\\/g,
              "\\\\"
            )}','g_directories','yes'); closeWindow('welcome_window'); `
          );
          project.innerText = log[i].Name;
          const description = document.createElement("p");
          description.innerText = log[i].Path;
          description.setAttribute("style", "font-size:12px;");
          project.appendChild(description);
          if (document.getElementById("recent_projects") == undefined) return;
          document.getElementById("recent_projects").appendChild(project);
          document.getElementById("clear_log").style = "";
        }
      }
      if (error_showed == false) DeleteBoot();
    }
  }
};

/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
"use strict"

module.exports = {
  check_updates: function () {
    const github = require("octonode");
    const client = github.client();
    const ghrepo = client.repo("Graviton-Code-Editor/Graviton-App");
    ghrepo.releases(function (err, res, body) {
      if (!err) {
        for (i = 0; i < res.length + 1; i++) {
          if (i < res.length + 1) {
            if (res[i].tag_name > g_version.version) {
              // New update detected
              new Dialog({
                id: "update",
                title: `<strong>${g_version.state}</strong> Update avaiable !`,
                content: getTranslation("DetectedUpdateMessage") + " " + res[i].tag_name + "?",
                buttons: {
                  [getTranslation("No")]: {},
                  [getTranslation("Yes")]: {
                    click: "updater.update()",
                    important: true
                  }
                }
              });
              return;
            }
          }
          new Notification({
            title: 'Graviton',
            content: getTranslation("NoUpdateFound")
          });
          return;
        }
      }
    });
  },
  update: function () {
    shell.openExternal(
      "https://github.com/Graviton-Code-Editor/Graviton-App/releases"
    );
  }
};
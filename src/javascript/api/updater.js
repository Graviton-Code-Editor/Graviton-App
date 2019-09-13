/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
'use strict'

module.exports = {
  check_updates: function () {
    const github = require('octonode')
    const client = github.client()
    const ghrepo = client.repo('Graviton-Code-Editor/Graviton-App')
    ghrepo.releases(function (err, res, body) {
      if (!err) {
        console.log(res,body);
        for (i = 0; i < res.length + 1; i++) {
          if (i < res.length + 1) {
            console.log(i,res.length);
            console.log(res[i].tag_name,GravitonInfo.version)
            if (semver.gt(res[i].tag_name,GravitonInfo.version)) {
               new Dialog({
                id: 'update',
                title: `<strong>${GravitonInfo.state}</strong> Update avaiable !`,
                content: getTranslation('DetectedUpdateMessage') + ' ' + res[i].tag_name + '?',
                buttons: {
                  [getTranslation('No')]: {},
                  [getTranslation('Yes')]: {
                    click: 'updater.update()',
                    important: true
                  }
                }
              })
              return
            }
          }
          new Notification({
            title: 'Graviton',
            content: getTranslation('NoUpdateFound')
          })
          return
        }
      }
    })
  },
  update: function () {
    shell.openExternal(
      'https://github.com/Graviton-Code-Editor/Graviton-App/releases'
    )
  }
}

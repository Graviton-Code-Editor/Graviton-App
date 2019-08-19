/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
"use strict"

let languages = [];
/*
 * 
 *@desc Load the languages JSON files and push it to an array
 *
 */

window.onload = function(){
  fs.readdir(path.join(__dirname, "languages"), (err, paths) => {
    paths.forEach(dir => {
      fs.readFile(path.join(__dirname, "languages", dir), "utf8", function (
        err,
        data
      ) {
        if (err) throw err;
        try {
          JSON.parse(data);
        } catch {
          return;
        }
        languages.push(JSON.parse(data)); // Push the language
        if (languages.length === paths.length) {
          loadConfig(); 
        }
      });
    });
  });
}

const loadLanguage = language => {
  languages.map((item, index) => {
    if (item["name"] === language) {
      current_config.language = item;
      const toTranslate = document.getElementsByClassName("translate_word");
      for (i = 0; i < toTranslate.length; i++) {
        toTranslate[i].innerText = getTranslation(toTranslate[i].getAttribute("idT"))
      }
    }
  });
};

const getTranslation = text => {
  if (current_config.language.strings[text] == undefined) {
    let output = text;
    languages.forEach((lang)=>{
      if (lang.name === "english") {
        output = lang.strings[text] != undefined ? lang.strings[text] : text;
      }
    })
    return text;
  } else {
    return current_config.language.strings[text];
  }
};
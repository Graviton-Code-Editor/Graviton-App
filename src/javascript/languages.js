/*
########################################
              MIT License

Copyright (c) 2019 Marc Espín Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
let languages = [];

function detectLanguages() {
  fs.readdir(path.join(__dirname, "languages"), (err, paths) => {
    paths.forEach(dir => {
      fs.readFile(path.join(__dirname, "languages", dir), "utf8", function(
        err,
        data
      ) {
        if (err) throw err;
        try{
           JSON.parse(data);
        }catch{ 
          return;
        }
        const obj = JSON.parse(data);
        languages.push(obj); // Push the language
        if (languages.length === paths.length) {
          loadConfig();
        }
      });
    });
  });
}
const loadLanguage = language => {
  languages.map((item, index) => {
    if (item["g_l"] === language) {
      current_config["language"] = item;
      const toTranslate = document.getElementsByClassName("translate_word");
      for (i = 0; i < toTranslate.length; i++) {
        if (item[toTranslate[i].getAttribute("idT")] != undefined) {
          toTranslate[i].innerText = item[toTranslate[i].getAttribute("idT")];
        } else {
          languages.map((item, index) => {
            if (item["g_l"] === "english") {
              if (item[toTranslate[i].getAttribute("idT")] != undefined)
                toTranslate[i].innerText =
                  item[toTranslate[i].getAttribute("idT")];
            }
          });
        }
      }
    }
  });
};
const getTranslation = text => {
  if (current_config.language[text] == undefined) {
    for (i = 0; i < languages.length; i++) {
      if (languages[i]["g_l"] === "english") {
        return languages[i][text] != undefined ? languages[i][text] : text;
      }
    }
  } else {
    return current_config.language[text];
  }
};

/*

languages.push(random_language);

if(current_config.language=="random"){
    loadLanguage("random");
}


*/

/*
########################################
              MIT License

Copyright (c) 2019 Graviton Code Editor

Full license > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
let languages = [];
function detectLanguages(){
	fs.readdir(path.join(__dirname,"languages"), (err, paths) => {
  	paths.forEach(dir => {
  		fs.readFile(path.join(__dirname, "languages",dir), 'utf8', function (err, data) {
 		 	if (err) throw err;
 		 	const obj = JSON.parse(data)
 		 	languages.push(obj); //Push the language
  		 	 if(languages.length === paths.length) {
 		 	 	loadConfig(); 
 		 	 }
			});
  	});
	});	
}
function loadLanguage(language){
	languages.map((item,index)=>{
		if(item["Name"]===language){
			current_config["language"] = item;
			const toTranslate = document.getElementsByClassName("translate_word");
			for(i=0;i<toTranslate.length;i++){
					if(item[toTranslate[i].getAttribute("idT")]!=undefined)toTranslate[i].innerText = item[toTranslate[i].getAttribute("idT")];
			}
		}
	});
}
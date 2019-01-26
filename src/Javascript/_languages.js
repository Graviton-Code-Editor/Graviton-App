var languages = [];
var selected_language = "";
function detectLanguages(){
	fs.readdir(path.join(__dirname,"languages"), (err, paths) => {
  	paths.forEach(dir => {
  		fs.readFile(path.join(__dirname, "languages",dir), 'utf8', function (err, data) {
 		 	if (err) throw err;
 		 	var obj = JSON.parse(data)
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
		selected_language = item;
	
	var toTranslate = document.getElementsByClassName("TT");
		for(i=0;i<toTranslate.length;i++){
				toTranslate[i].innerText = item[toTranslate[i].getAttribute("idT")];
		}
	}
});


}
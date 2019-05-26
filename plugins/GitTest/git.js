/* Just testing */

const git = new Plugin({
  name: "GitTest"
})
const gitdm = new dropMenu({
	id:"git_dm"
});
gitdm.setList({
  "button": "GitTest",
  "list":{
  	"get last commit":"git_read()"
  }
})
function git_read(){
	const dir  = graviton.getCurrentDirectory();
	if(dir!="not_selected"){
		fs.readFile(path.join(dir,".git","COMMIT_EDITMSG"), "utf8", function(err, data) {
			if (err) {
				console.log(err);
			  return err;
			}
			new Notification("Last commit message",data);
		});
	}
}
const path = window.require("path")
const OS = eval('process.platform')
//This will force MS-DOS directories to use double back slash, this also removes doubles quotes in case there are
function normalizeDir(dir,use=false){
	const dirNormalized =  path.normalize(dir)
	let result = dirNormalized.replace(/"/g,'').replace(/\$/g,'*')
	if(OS == "win32"){
		result = result.replace(/\\/g,'\\\\')
	}
	if(use){
		result = result.replace(/\*/g,'$')
	}
	return result
}

export default normalizeDir
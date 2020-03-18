import requirePath from './require'
const path = requirePath("path")
//This will force MS-DOS directories to use double back slash, this algo removes doubles quotes in case there are
function normalizeDir(dir,use=false){
	const dirNormalized =  path.normalize(dir)
	let result = dirNormalized.replace(/"/g,'').replace(/\$/g,'*')
	if(process.platform == "win32"){
		result = result.replace(/\\/g,'\\\\')
	}
	if(use){
		result = result.replace(/\*/g,'$')
	}
	return result
}

export default normalizeDir
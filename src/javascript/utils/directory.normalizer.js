import requirePath from './require'
const path = requirePath("path")
import Process from 'Process'
//This will force MS-DOS directories to use double back slash, this also removes doubles quotes in case there are
function normalizeDir(dir,use=false){
	const dirNormalized =  path.normalize(dir)
	let result = dirNormalized.replace(/"/g,'').replace(/\$/g,'*')
	if(Process.platform == "win32"){
		result = result.replace(/\\/g,'\\\\')
	}
	if(use){
		result = result.replace(/\*/g,'$')
	}
	return result
}

export default normalizeDir
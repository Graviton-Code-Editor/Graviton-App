const path = window.require("path")
const OS = eval('process.platform')
//This will force MS-DOS directories to use double back slash, this also removes doubles quotes in case there are
function normalizeDir( dir){
	const dirNormalized =  dir.split(/\\+/gm).join('\\')
	let result = dirNormalized.replace(/"/g,'')
	if( OS == "win32" ) result = result.replace(/\/+/g,'\\').replace(/\\/g,'\\\\')
	return result
}

export default normalizeDir
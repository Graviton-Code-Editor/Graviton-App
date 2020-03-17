import requirePath from './require'
const path = requirePath("path")
//This will force MS-DOS directories to use double back slash, this algo removes doubles quotes in case there are
function normalizeDir(dir){
	return path.normalize(dir).replace(/\\/g,'\\\\').replace(/"/g,'')
}

export default normalizeDir
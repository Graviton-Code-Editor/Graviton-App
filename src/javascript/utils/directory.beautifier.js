import requirePath from './require'
const path = requirePath("path")

function beautifyDir(dir){
	return path.normalize(dir).replace(/\\\\/g,'\\').replace(/"/g,'')
}

export default beautifyDir
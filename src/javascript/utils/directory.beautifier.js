const path = window.require('path')

function beautifyDir(dir) {
	return path.normalize(dir).replace(/\\\\/g, '\\').replace(/"/g, '')
}

export default beautifyDir

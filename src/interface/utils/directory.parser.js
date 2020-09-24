const path = window.require('path')

function parseDirectory(directory) {
	let nameFolder = path.basename(directory)
	if (process.platform == 'win32' && directory.includes(':')) {
		nameFolder = path.basename(directory.replace(/\\/g, '\\\\'))
	}
	return nameFolder
}

export default parseDirectory

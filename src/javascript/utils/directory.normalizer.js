const path = window.require('path')
const OS = eval('process.platform')

//This will force Windows directories to use double back slash, this also removes doubles quotes in case there are

function normalizeDir(dir, { isWSL = false } = {}) {
	if (OS === 'win32') {
		let dirNormalized = dir.split(/\\+/gm).join('\\')
		dirNormalized = dirNormalized.replace(/"/g, '')
		dirNormalized = dirNormalized.replace(/\/+/g, '\\').replace(/\\/g, '\\\\')
		dirNormalized = dirNormalized.replace(/\+/g, '//')
		return dirNormalized
	}
}

export default normalizeDir

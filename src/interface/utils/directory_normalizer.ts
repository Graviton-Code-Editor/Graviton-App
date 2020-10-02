const OS = process.platform

/*
 * This will force Windows directories to use double back slash, this also removes doubles quotes in case there are
 */

export default function normalizeDir(dir: string, { isWSL = false } = {}): string {
	let dirNormalized = dir.split(/\\+/gm).join('\\')
	dirNormalized = dirNormalized.replace(/"/g, '')
	if (OS == 'win32') dirNormalized = dirNormalized.replace(/\/+/g, '\\')
	if (isWSL) dirNormalized = dirNormalized.replace(/\+/g, '//')
	return dirNormalized
}

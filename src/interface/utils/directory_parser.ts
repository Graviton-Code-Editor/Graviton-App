import * as path from 'path'

export default function parseDirectory(directory: string): string {
	let nameFolder = path.basename(directory)
	if (process.platform == 'win32' && directory.includes(':')) {
		nameFolder = path.basename(directory.replace(/\\/g, '\\\\'))
	}
	return nameFolder
}

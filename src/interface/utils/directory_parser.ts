import * as path from 'path'
import isBrowser from './is_browser'

export default function parseDirectory(directory: string): string {
	let nameFolder = path.basename(directory)
	if (!isBrowser && process.platform == 'win32' && directory.includes(':')) {
		nameFolder = path.basename(directory.replace(/\\/g, '\\\\'))
	}
	return nameFolder
}

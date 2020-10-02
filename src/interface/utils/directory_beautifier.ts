import * as path from 'path'

export default function beautifyDir(dir: string): string {
	return path.normalize(dir).replace(/\\\\/g, '\\').replace(/"/g, '')
}

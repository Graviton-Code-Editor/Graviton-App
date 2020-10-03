import * as path from 'path'

export default function getFormat(dir: string): string {
	const array = path.extname(dir).split('.')
	return array ? array[array.length - 1] : path.basename(dir)
}

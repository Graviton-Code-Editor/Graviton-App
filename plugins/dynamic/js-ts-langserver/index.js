import path from 'path'

export function entry({ RunningConfig }) {
	RunningConfig.emit('registerLanguageServer', {
		modes: ['javascript', 'typescript'],
		args: ['node', path.resolve(__dirname, 'server.js')],
	})
}

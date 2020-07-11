import path from 'path'

export function entry({ RunningConfig }) {
	RunningConfig.emit('registerLanguageServer', {
		name: 'javascript',
		args: ['node', path.resolve(__dirname, 'server.js')],
	})
}

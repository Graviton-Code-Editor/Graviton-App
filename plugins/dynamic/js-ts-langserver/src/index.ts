import path from 'path'

export function entry({ RunningConfig }) {
	RunningConfig.emit('registerLanguageServer', {
		modes: ['javascript', 'typescript'],
		args: ['node', path.resolve(__dirname, 'cli.js'), '--stdio', `--tsserver-path`,path.join(__dirname, 'tslib', 'tsserver.js')],
	})
}

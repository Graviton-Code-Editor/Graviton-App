const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: path.resolve(__dirname, './node_modules/javascript-typescript-langserver/lib/language-server-stdio.js'),
	target: 'node',
	node: {
		__dirname: false,
	},
	output: {
		path: path.resolve(__dirname, '..', '..', 'pluginsDist', path.basename(__dirname)),
		filename: 'server.js',
		libraryTarget: 'commonjs',
	},
	resolve: {
		extensions: ['.js'],
	},
	module: {
		rules: [
			{
				test: path.resolve(__dirname, './node_modules/javascript-typescript-langserver/lib/language-server-stdio.js'),
				use: 'shebang-loader',
			},
		],
	},
	plugins: [new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })],
}

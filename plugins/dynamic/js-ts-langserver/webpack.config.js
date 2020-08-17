const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: path.resolve(__dirname, './node_modules/typescript-language-server/lib/cli.js'),
	target: 'node',
	node: {
		__dirname: false,
	},
	output: {
		path: path.resolve(__dirname, '..', '..', '..', 'pluginsDist', path.basename(__dirname)),
		filename: 'cli.js',
		libraryTarget: 'commonjs',
	},
	resolve: {
		extensions: ['.js'],
	},
	module: {
		rules: [
			{
				test: path.resolve(__dirname, './node_modules/typescript-language-server/lib/cli.js'),
				use: 'shebang-loader',
			},
		],
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: '#!/usr/bin/env node',
			raw: true,
		}),
	],
}

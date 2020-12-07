const path = require('path')
const WebpackMessages = require('webpack-messages')
const WebpackBar = require('webpackbar')

module.exports = {
	name: 'preload',
	mode: process.env.NODE_ENV,
	optimization: {
		minimize: true,
	},
	entry: {
		index: path.resolve(process.cwd(), 'src', 'app', 'preload.ts'),
	},
	plugins: [
		new WebpackBar({
			name: 'Preload',
		}),
		new WebpackMessages({
			name: 'Preload',
			logger: str => console.log(`[webpack] --> ${str}`),
		}),
	],
	resolve: {
		extensions: ['.js', '.ts'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: {
					configFile: path.resolve(__dirname, './preload_tsconfig.json'),
				},
				exclude: [path.resolve(process.cwd(), './node_modules')],
			},
		],
	},
	target: 'electron-main',
	externals: ['fs-extra', 'electron', 'path', 'node-pty'],
	output: {
		filename: 'preload.js',
		path: path.resolve(process.cwd(), 'dist_main'),
		libraryTarget: 'umd',
	},
}

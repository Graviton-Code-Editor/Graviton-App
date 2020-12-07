const path = require('path')
const WebpackMessages = require('webpack-messages')
const WebpackBar = require('webpackbar')

module.exports = {
	name: 'testing',
	mode: process.env.NODE_ENV,
	performance: {
		hints: false,
	},
	optimization: {
		minimize: true,
	},
	entry: {
		index: path.resolve(process.cwd(), 'src', 'app', 'store_handler.ts'),
	},
	plugins: [
		new WebpackBar({
			name: 'testing',
		}),
		new WebpackMessages({
			name: 'testing',
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
					configFile: path.resolve(__dirname, './test_tsconfig.json'),
				},
				exclude: [path.resolve(process.cwd(), './node_modules')],
			},
		],
	},
	target: 'electron-main',
	externals: ['fs', 'electron', 'path'],
	output: {
		filename: 'test.js',
		path: path.resolve(process.cwd(), 'dist_test'),
		libraryTarget: 'umd',
	},
}

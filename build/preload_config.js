const path = require('path')

module.exports = {
	name: 'preload',
	mode: process.env.NODE_ENV,
	optimization: {
		minimize: true,
	},
	entry: {
		index: path.resolve(process.cwd(), 'src', 'app', 'preload.ts'),
	},
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

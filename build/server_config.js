const path = require('path')
const Nodemon = require('nodemon-webpack-plugin')

module.exports = {
	name: 'server',
	mode: process.env.NODE_ENV,
	performance: {
		hints: false,
	},
	optimization: {
		minimize: false,
	},
	entry: {
		index: path.resolve(process.cwd(), 'src', 'server', 'index.ts'),
	},
	plugins: [new Nodemon()],
	node: {
		__dirname: false,
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
					configFile: path.resolve(__dirname, './server_tsconfig.json'),
				},
				exclude: [path.resolve(process.cwd(), './node_modules')],
			},
		],
	},
	target: 'node',
	externals: ['node-pty', 'express', 'express-ws', 'fs-extra'],
	output: {
		filename: 'main.js',
		path: path.resolve(process.cwd(), 'dist_server'),
		libraryTarget: 'commonjs',
	},
}

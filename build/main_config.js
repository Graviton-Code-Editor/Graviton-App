const path = require('path')

module.exports = {
	name: 'main',
	mode: process.env.NODE_ENV,
	performance: {
		hints: false,
	},
	optimization: {
		minimize: true,
	},
	entry: {
		index: path.resolve(process.cwd(), 'src', 'app', 'main.ts'),
	},
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
					configFile: path.resolve(__dirname, './main_tsconfig.json'),
				},
				exclude: [path.resolve(process.cwd(), './node_modules')],
			},
		],
	},
	target: 'electron-main',
	externals: ['node-pty'],
	output: {
		filename: 'main.js',
		path: path.resolve(process.cwd(), 'dist_main'),
		libraryTarget: 'commonjs',
	},
}

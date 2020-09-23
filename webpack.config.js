const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const WebpackMessages = require('webpack-messages')
const WebpackBar = require('webpackbar')

module.exports = [
	{
		name: 'renderer',
		mode: process.env.NODE_ENV,
		optimization: {
			minimize: true,
		},
		entry: {
			index: './src/javascript/main.ts',
		},
		plugins: [
			new WebpackBar({
				name: 'Renderer Process',
			}),
			new WebpackMessages({
				name: 'Graviton interface',
				logger: str => console.log(`[webpack] --> ${str}`),
			}),
			new HtmlWebpackPlugin({
				title: 'Graviton',
				filename: path.resolve(__dirname, 'dist_ui', 'index.html'),
				templateContent: `
					<html>
						<meta charset="UTF-8" />
						<body>
							<div id="App"></div>
						</body>
					</html>
				`,
			}),
			new CopyPlugin({
				patterns: [
					{ from: path.resolve(__dirname, 'assets'), to: path.resolve(__dirname, 'dist_ui') },
					{ from: path.resolve(__dirname, 'iconpacks'), to: path.resolve(__dirname, 'dist_ui') },
				],
			}),
		],
		node: {
			__dirname: true,
		},
		module: {
			rules: [
				{
					test: /\.s[ac]ss$/i,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.(woff(2)?|ttf|eot|png|jpe?g|svg)(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: 'dist/',
							},
						},
						{
							loader: 'image-webpack-loader',
							options: {
								disable: true,
							},
						},
					],
				},
				{
					test: /\.tsx?$/,
					loader: 'ts-loader',
					exclude: path.resolve(__dirname, './node_modules'),
				},
			],
		},
		resolve: {
			extensions: ['.js', '.ts'],
			alias: {
				ThemeProvider: path.resolve(__dirname, './src/javascript/utils/theme.provider.ts'),
				StaticConfig: path.resolve(__dirname, './src/javascript/utils/static.config.ts'),
				RunningConfig: path.resolve(__dirname, './src/javascript/utils/running.config.ts'),
				PluginsRegistry: path.resolve(__dirname, './src/javascript/utils/plugins.registry.ts'),
				LanguageConfig: path.resolve(__dirname, './src/javascript/utils/lang.config.ts'),
				AppPlatform: path.resolve(__dirname, './src/javascript/utils/platform.ts'),
				Constants: path.resolve(__dirname, './src/javascript/defaults/constants.ts'),
				StaticPlugins: path.resolve(__dirname, './plugins/static'),
				Types: path.resolve(__dirname, './src/javascript/types'),
				Constructors: path.resolve(__dirname, './src/javascript/constructors'),
				Components: path.resolve(__dirname, './src/javascript/components'),
				Assets: path.resolve(__dirname, './assets'),
				Root: __dirname,
			},
		},
		target: 'electron-renderer',
		output: {
			filename: 'main.js',
			path: path.resolve(__dirname, 'dist_ui'),
		},
		devServer: {
			contentBase: path.join(__dirname, 'dist_ui'),
			compress: true,
			port: 9000,
			stats: 'errors-only',
		},
	},
	{
		name: 'main',
		mode: process.env.NODE_ENV,
		optimization: {
			minimize: true,
		},
		entry: {
			index: path.resolve(__dirname, 'app', 'main.ts'),
		},
		plugins: [
			new WebpackBar({
				name: 'Main Process',
			}),
			new WebpackMessages({
				name: 'Graviton Main',
				logger: str => console.log(`[webpack] --> ${str}`),
			}),
		],
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
						configFile: path.resolve(__dirname, './main.tsconfig.json'),
					},
					exclude: [path.resolve(__dirname, './node_modules'), path.resolve(__dirname, './src')],
				},
			],
		},
		target: 'electron-main',
		output: {
			filename: 'main.js',
			path: path.resolve(__dirname, 'dist_main'),
			libraryTarget: 'commonjs',
		},
	},
]

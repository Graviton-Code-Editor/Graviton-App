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
			index: './src/interface/main.ts',
		},
		plugins: [
			new WebpackBar({
				name: 'Interface',
			}),
			new WebpackMessages({
				name: 'Interface',
				logger: str => console.log(`[webpack] --> ${str}`),
			}),
			new HtmlWebpackPlugin({
				title: 'Graviton Editor',
				filename: path.resolve(__dirname, 'dist_ui', 'index.html'),
				templateContent: `
					<html>
						<head>
							<meta charset="UTF-8" />
						</head>
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
				ThemeProvider: path.resolve(__dirname, './src/interface/core/theme_provider.ts'),
				StaticConfig: path.resolve(__dirname, './src/interface/core/static_config.ts'),
				RunningConfig: path.resolve(__dirname, './src/interface/core/running_config.ts'),
				PluginsRegistry: path.resolve(__dirname, './src/interface/core/plugins_registry.ts'),
				LanguageConfig: path.resolve(__dirname, './src/interface/core/lang_config.ts'),
				FileSystem: path.resolve(__dirname, './src/interface/core/file_system.ts'),
				PluginLoader: path.resolve(__dirname, './src/interface/core/plugin_loader.ts'),
				AppPlatform: path.resolve(__dirname, './src/interface/core/platform.ts'),
				Constants: path.resolve(__dirname, './src/interface/defaults/constants.ts'),
				Core: path.resolve(__dirname, './src/interface/core/core.ts'),
				StaticPlugins: path.resolve(__dirname, './plugins/static'),
				Types: path.resolve(__dirname, './src/interface/types'),
				Constructors: path.resolve(__dirname, './src/interface/constructors'),
				Components: path.resolve(__dirname, './src/interface/components'),
				Assets: path.resolve(__dirname, './assets'),
				Root: __dirname,
			},
		},
		target: 'electron-renderer',
		externals: ['node-pty', 'node-jsonrpc-lsp', 'chokidar'],
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
		name: 'browser',
		mode: process.env.NODE_ENV,
		optimization: {
			minimize: true,
		},
		entry: {
			index: './src/interface/main.ts',
		},
		plugins: [
			new WebpackBar({
				name: 'Browser',
			}),
			new WebpackMessages({
				name: 'Browser',
				logger: str => console.log(`[webpack] --> ${str}`),
			}),
			new HtmlWebpackPlugin({
				title: 'Graviton Editor',
				filename: path.resolve(__dirname, 'dist_browser', 'index.html'),
				templateContent: `
					<html>
						<head>
							<meta charset="UTF-8" />
							<link rel="shortcut icon" type="image/svg" href="dist/logo.svg"/>
							<title>Graviton Editor</title>
						</head>
						<body>
							<div id="App"></div>
						</body>
					</html>
				`,
			}),
			new CopyPlugin({
				patterns: [
					{ from: path.resolve(__dirname, 'assets'), to: path.resolve(__dirname, 'dist_browser') },
					{ from: path.resolve(__dirname, 'iconpacks'), to: path.resolve(__dirname, 'dist_browser') },
				],
			}),
		],
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
				ThemeProvider: path.resolve(__dirname, './src/interface/core/theme_provider.ts'),
				StaticConfig: path.resolve(__dirname, './src/interface/core/static_config.ts'),
				RunningConfig: path.resolve(__dirname, './src/interface/core/running_config.ts'),
				PluginsRegistry: path.resolve(__dirname, './src/interface/core/plugins_registry.ts'),
				LanguageConfig: path.resolve(__dirname, './src/interface/core/lang_config.ts'),
				FileSystem: path.resolve(__dirname, './src/interface/core/file_system.ts'),
				PluginLoader: path.resolve(__dirname, './src/interface/core/plugin_loader.ts'),
				AppPlatform: path.resolve(__dirname, './src/interface/core/platform.ts'),
				Constants: path.resolve(__dirname, './src/interface/defaults/constants.ts'),
				Core: path.resolve(__dirname, './src/interface/core/core.ts'),
				StaticPlugins: path.resolve(__dirname, './plugins/static'),
				Types: path.resolve(__dirname, './src/interface/types'),
				Constructors: path.resolve(__dirname, './src/interface/constructors'),
				Components: path.resolve(__dirname, './src/interface/components'),
				Assets: path.resolve(__dirname, './assets'),
				Root: __dirname,
			},
		},
		target: 'web',
		node: {
			fs: 'empty',
			'fs-extra': 'empty',
			chokidar: 'empty',
			'simple-git': 'empty',
			child_process: 'empty',
			electron: 'empty',
			rimraf: 'empty',
			'node-json-lsp': 'empty',
		},
		output: {
			filename: 'main.js',
			path: path.resolve(__dirname, 'dist_browser'),
		},
		devServer: {
			contentBase: path.join(__dirname, 'dist_browser'),
			compress: true,
			port: 7500,
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
			index: path.resolve(__dirname, 'src', 'app', 'main.ts'),
		},
		plugins: [
			new WebpackBar({
				name: 'App',
			}),
			new WebpackMessages({
				name: 'App',
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
					exclude: [path.resolve(__dirname, './node_modules')],
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
	{
		name: 'preload',
		mode: process.env.NODE_ENV,
		optimization: {
			minimize: true,
		},
		entry: {
			index: path.resolve(__dirname, 'src', 'app', 'preload.ts'),
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
						configFile: path.resolve(__dirname, './preload.tsconfig.json'),
					},
					exclude: [path.resolve(__dirname, './node_modules')],
				},
			],
		},
		target: 'electron-main',
		externals: ['fs-extra', 'electron', 'path'],
		output: {
			filename: 'preload.js',
			path: path.resolve(__dirname, 'dist_main'),
			libraryTarget: 'umd',
		},
	},
	{
		name: 'testing',
		mode: process.env.NODE_ENV,
		optimization: {
			minimize: true,
		},
		entry: {
			index: path.resolve(__dirname, 'src', 'app', 'store_handler.ts'),
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
						configFile: path.resolve(__dirname, 'test', './test.tsconfig.json'),
					},
					exclude: [path.resolve(__dirname, './node_modules')],
				},
			],
		},
		target: 'electron-main',
		externals: ['fs', 'electron', 'path'],
		output: {
			filename: 'test.js',
			path: path.resolve(__dirname, 'dist_test'),
			libraryTarget: 'umd',
		},
	},
]

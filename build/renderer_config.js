const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
	name: 'renderer',
	mode: process.env.NODE_ENV,
	performance: {
		hints: false,
	},
	optimization: {
		minimize: true,
	},
	entry: {
		index: './src/interface/main.ts',
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Graviton Editor',
			filename: path.resolve(process.cwd(), 'dist_ui', 'index.html'),
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
			hash: true,
		}),
		new CopyPlugin({
			patterns: [
				{ from: path.resolve(process.cwd(), 'assets'), to: path.resolve(process.cwd(), 'dist_ui') },
				{ from: path.resolve(process.cwd(), 'plugins/iconpacks'), to: path.resolve(process.cwd(), 'dist_ui') },
				{ from: path.resolve(process.cwd(), 'plugins/themes'), to: path.resolve(process.cwd(), 'dist_ui') },
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
				options: {
					configFile: path.resolve(__dirname, './tsconfig.json'),
				},
				exclude: path.resolve(process.cwd(), './node_modules'),
			},
		],
	},
	resolve: {
		extensions: ['.js', '.ts'],
		alias: {
			ThemeProvider: path.resolve(process.cwd(), './src/interface/core/theme_provider.ts'),
			StaticConfig: path.resolve(process.cwd(), './src/interface/core/static_config.ts'),
			RunningConfig: path.resolve(process.cwd(), './src/interface/core/running_config.ts'),
			PluginsRegistry: path.resolve(process.cwd(), './src/interface/core/plugins_registry.ts'),
			LanguageConfig: path.resolve(process.cwd(), './src/interface/core/lang_config.ts'),
			FileSystem: path.resolve(process.cwd(), './src/interface/core/file_system.ts'),
			PluginLoader: path.resolve(process.cwd(), './src/interface/core/plugin_loader.ts'),
			AppPlatform: path.resolve(process.cwd(), './src/interface/core/platform.ts'),
			Constants: path.resolve(process.cwd(), './src/interface/defaults/constants.ts'),
			Core: path.resolve(process.cwd(), './src/interface/core/core.ts'),
			Types: path.resolve(process.cwd(), './src/interface/types'),
			Constructors: path.resolve(process.cwd(), './src/interface/constructors'),
			Components: path.resolve(process.cwd(), './src/interface/components'),
			Assets: path.resolve(process.cwd(), './assets'),
			Root: process.cwd(),
		},
	},
	target: 'electron-renderer',
	externals: ['node-pty', 'node-jsonrpc-lsp', 'chokidar'],
	output: {
		filename: 'main.js',
		path: path.resolve(process.cwd(), 'dist_ui'),
	},
}

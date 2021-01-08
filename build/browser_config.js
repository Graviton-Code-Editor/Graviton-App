const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/'

module.exports = {
	name: 'browser',
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
			filename: path.resolve(process.cwd(), 'dist_browser', 'index.html'),
			hash: true,
			templateContent: `
					<html>
						<head>
							<meta charset="UTF-8" />
							<link rel="shortcut icon" type="image/svg" href="dist/logo.svg"/>
							<meta name="viewport" content="initial-scale=1, maximum-scale=1">
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
				{ from: path.resolve(process.cwd(), 'assets'), to: path.resolve(process.cwd(), 'dist_browser') },
				{ from: path.resolve(process.cwd(), 'plugins/iconpacks'), to: path.resolve(process.cwd(), 'dist_browser') },
				{ from: path.resolve(process.cwd(), 'plugins/themes'), to: path.resolve(process.cwd(), 'dist_ui') },
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
							publicPath: PUBLIC_PATH,
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
		fallback: {
			path: require.resolve('path-browserify'),
		},
	},
	target: 'web',
	output: {
		filename: 'main.js',
		path: path.resolve(process.cwd(), 'dist_browser'),
		publicPath: PUBLIC_PATH,
	},
}

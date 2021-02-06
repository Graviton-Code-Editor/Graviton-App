const fs = require('fs-extra')
const path = require('path')
const webpack = require('webpack')
const rimraf = require('rimraf')
const { Bundler } = require('@gveditor/sdk')
const { spawn, exec } = require('child_process')
const { ncp } = require('ncp')
const download = require('download-git-repo')
const useWebpack = require('tasca-webpack')
const useElectron = require('tasca-electron')
const useServe = require('tasca-serve')
const useElectronBuilder = require('tasca-electron-builder')

const pluginsSourceFolder = path.resolve(__dirname, '..', 'plugins', 'dynamic')
const pluginsDistFolder = path.resolve(__dirname, '..', 'pluginsDist')
const pluginsBrowserDistFolder = path.resolve(__dirname, '..', 'dist_browser_plugins')
const remotePluginTemp = path.resolve(__dirname, '..', 'temp_remote_plugin')

const buildData = {
	date: new Date().toDateString(),
	channelBuild: global.channel || 'dev',
	env: process.env.NODE_ENV || 'production',
}

function createBuildFile(cb) {
	const BUILD_DIR = path.join(__dirname, '..', 'assets', 'build.json')

	fs.writeFile(BUILD_DIR, JSON.stringify(buildData))
		.then(() => {
			cb() // Ok
		})
		.catch(err => {
			console.log(err)
		})
}

function updatePluginsDependencies(cb) {
	fs.readdir(pluginsSourceFolder).then(pluginsFolders => {
		pluginsFolders.forEach((pluginName, i) => {
			const pluginDir = path.join(pluginsSourceFolder, pluginName)
			const proc = spawn('npm', ['install'], {
				cwd: pluginDir,
				shell: true,
			})
			proc.on('close', () => {
				if (pluginsFolders.length - 1 === i) {
					cb()
				}
			})
		})
	})
}

async function removePluginsDist(cb) {
	if (fs.existsSync(pluginsDistFolder)) {
		rimraf(pluginsDistFolder, () => {
			cb()
		})
	} else {
		cb()
	}
}

function createPluginsFolder(cb) {
	if (!fs.existsSync(pluginsDistFolder)) {
		fs.mkdirSync(pluginsDistFolder)
	}
	cb()
}

function createPluginFolder(pluginName) {
	if (!fs.existsSync(path.join(pluginsDistFolder, pluginName))) {
		fs.mkdirSync(path.join(pluginsDistFolder, pluginName))
	}
}

async function pluginsWebpack(cb) {
	const pluginsFolders = await fs.readdir(pluginsSourceFolder)
	pluginsFolders.forEach((pluginName, i) => {
		createPluginFolder(pluginName)
		webpack(require(path.join(pluginsSourceFolder, pluginName, 'webpack.config.js')), function () {
			if (pluginsFolders.length - 1 === i) {
				cb()
			}
		})
	})
}

async function pluginsSDK(cb) {
	const pluginsFolders = await fs.readdir(pluginsSourceFolder)
	pluginsFolders.forEach(async (pluginName, i) => {
		const bundle = new Bundler({
			projectPath: path.join(pluginsSourceFolder, pluginName),
			distPath: path.join(pluginsDistFolder, pluginName),
		})
		await bundle.bundle().then(err => {
			if (err) throw err
		})
		await bundle.copyAssets()
		if (pluginsFolders.length - 1 === i) {
			cb()
		}
	})
}

async function pluginsTasks(cb) {
	const pluginsFolders = await fs.readdir(pluginsSourceFolder)
	pluginsFolders.forEach(async (pluginName, i) => {
		const distFolder = path.join(pluginsDistFolder, pluginName)
		const { tasks } = require(path.join(pluginsSourceFolder, pluginName, 'graviton.config.js'))
		tasks.forEach(task => {
			task({
				distFolder,
			})
		})
		if (pluginsFolders.length - 1 === i) {
			cb()
		}
	})
}

async function copyLSPCMIcons(cb) {
	ncp(path.join(__dirname, '..', 'node_modules/lsp-codemirror/lib/icons'), path.join(__dirname, '..', 'dist_ui', 'icons'), err => {
		if (err) throw err
		cb()
	})
}

async function removeBrowserPluginsDist(cb) {
	if (fs.existsSync(pluginsBrowserDistFolder)) {
		rimraf(pluginsBrowserDistFolder, () => {
			cb()
		})
	} else {
		cb()
	}
}

function createBrowserPluginsDist(cb) {
	if (!fs.existsSync(pluginsBrowserDistFolder)) {
		fs.mkdirSync(pluginsBrowserDistFolder)
	}
	cb()
}

async function cloneRemotePlugin(cb) {
	download('Graviton-Code-Editor/remote-plugin', remotePluginTemp, () => {
		cb()
	})
}

function installRemoteDeps(cb) {
	const installProcess = spawn('npm', ['install'], {
		cwd: remotePluginTemp,
		shell: true,
	})

	installProcess.on('close', (err, output) => {
		if (err === 1) console.log(output)
		const installDevProcess = spawn('npm', ['install', '--only=dev'], {
			cwd: remotePluginTemp,
			shell: true,
		})

		installDevProcess.on('close', (err, output) => {
			if (err === 1) console.log(output)
			cb()
		})
	})
}

async function buildRemote(cb) {
	const buildProcess = spawn('npm', ['run build'], {
		cwd: remotePluginTemp,
		shell: true,
	})

	buildProcess.on('close', (err, output) => {
		if (err === 1) console.log(output)
		cb()
	})
}

async function copyRemoteDist(cb) {
	ncp(path.join(remotePluginTemp, 'dist'), path.join(pluginsBrowserDistFolder, 'remote-plugin'), err => {
		if (err) console.log(err)
		cb()
	})
}

function BasicTasks() {
	return [createBuildFile]
}

function ElectronTasks() {
	return [updatePluginsDependencies, removePluginsDist, createPluginsFolder, pluginsWebpack, pluginsSDK, pluginsTasks]
}

function BrowserTasks() {
	return [createBrowserPluginsDist, cloneRemotePlugin, installRemoteDeps, buildRemote, copyRemoteDist]
}

const CommonTasks = [BasicTasks, ElectronTasks, BrowserTasks].flat()
const MiscTasks = [copyLSPCMIcons]

exports.default = CommonTasks

function BuildWebpackMain() {
	this.use(useWebpack(path.join(__dirname, './main_config')))
}
function WatchWebpackRenderer() {
	this.use(
		useWebpack(path.join(__dirname, './renderer_config'), {
			watch: true,
		}),
	)
}
function BuildElectronBuilder() {
	let options = {}

	if (info['32bits']) {
		options.ia32 = true
	}

	if (info['platform']) {
		options.linux = info['platform']
	}

	if (info['outpacked']) {
		options.dir = true
	}

	if (info['publish']) {
		options.publish = info['publish']
	}

	this.use(useElectronBuilder(path.join(__dirname, '..'), path.join(__dirname, '..'), options))
}
function BuildWebpackRenderer() {
	this.use(useWebpack(path.join(__dirname, './renderer_config')))
}
function ServeElectronInterface() {
	this.use(
		useServe(path.join(__dirname, '..', 'dist_ui'), {
			port: 9000,
		}),
	)
}
function RunElectron() {
	this.use(useElectron(path.join(__dirname, '..'), path.join(__dirname, '..', 'dist_main', 'main.js'), ['--no-sandbox']))
}
function BuildWebpackPreload() {
	this.use(useWebpack(path.join(__dirname, './preload_config')))
}
function WatchWebpackBrowser() {
	this.use(
		useWebpack(path.join(__dirname, './browser_config'), {
			watch: true,
		}),
	)
}
function BuildWebpackBrowser() {
	this.use(useWebpack(path.join(__dirname, './browser_config')))
}
function ServeBrowserInterface() {
	this.use(
		useServe(path.join(__dirname, '..', 'dist_browser'), {
			port: 7500,
			host: '0.0.0.0',
		}),
	)
}
function WatchWebpackServer() {
	this.use(
		useWebpack(path.join(__dirname, './server_config'), {
			watch: true,
		}),
	)
}
function BuildWebpackTesting() {
	this.use(useWebpack(path.join(__dirname, './test_config')))
}
function BuildWebpackServer() {
	this.use(useWebpack(path.join(__dirname, './server_config')))
}

exports.watchElectron = [...CommonTasks, BuildWebpackMain, WatchWebpackRenderer, ServeElectronInterface, RunElectron, BuildWebpackPreload, BuildWebpackBrowser, ...MiscTasks]

exports.buildElectron = [...CommonTasks, BuildWebpackMain, BuildWebpackRenderer, BuildWebpackPreload, BuildWebpackBrowser, ...MiscTasks, BuildElectronBuilder]

exports.buildAllWebpackConfigs = [BuildWebpackMain, BuildWebpackRenderer, BuildWebpackPreload, BuildWebpackBrowser, BuildWebpackTesting, ...MiscTasks]

exports.watchBrowser = [...CommonTasks, ServeBrowserInterface, WatchWebpackBrowser]

exports.buildBrowser = [...CommonTasks, BuildWebpackBrowser]

exports.watchServer = [...CommonTasks, WatchWebpackServer, WatchWebpackBrowser]

exports.buildServer = [...CommonTasks, BuildWebpackServer, BuildWebpackBrowser]

exports.buildTest = [...CommonTasks, ...MiscTasks, BuildWebpackMain, BuildWebpackRenderer, BuildWebpackPreload, BuildWebpackBrowser, BuildWebpackTesting]

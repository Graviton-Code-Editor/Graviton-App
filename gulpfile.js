const fs = require('fs-extra')
const path = require('path')
const { series } = require('gulp')
const webpack = require('webpack')
const rimraf = require('rimraf')
const { Bundler } = require('@gveditor/sdk')
const { spawn, exec } = require('child_process')
const { ncp } = require('ncp')
const download = require('download-git-repo')
const TargetPlatform = process.env.GRAVITON_PLATFORM

const pluginsSourceFolder = path.resolve(__dirname, 'plugins', 'dynamic')
const pluginsDistFolder = path.resolve(__dirname, 'pluginsDist')
const pluginsBrowserDistFolder = path.resolve(__dirname, 'pluginsBrowserDist')

function updatePluginsDependencies(cb) {
	fs.readdir(pluginsSourceFolder).then(pluginsFolders => {
		pluginsFolders.forEach((pluginName, i) => {
			const pluginDir = path.join(pluginsSourceFolder, pluginName)
			const proc = spawn('npm', ['install'], {
				cwd: pluginDir,
				stdio: 'inherit',
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

async function pluginsWebpack() {
	return await new Promise(async resolve => {
		const pluginsFolders = await fs.readdir(pluginsSourceFolder)
		pluginsFolders.forEach((pluginName, i) => {
			createPluginFolder(pluginName)
			webpack(require(path.join(pluginsSourceFolder, pluginName, 'webpack.config.js')), function () {
				if (pluginsFolders.length - 1 === i) {
					resolve()
				}
			})
		})
	})
}

async function pluginsSDK() {
	return await new Promise(async resolve => {
		const pluginsFolders = await fs.readdir(pluginsSourceFolder)
		pluginsFolders.forEach(async (pluginName, i) => {
			const bundle = new Bundler({
				projectPath: path.join(pluginsSourceFolder, pluginName),
				distPath: path.join(pluginsDistFolder, pluginName),
			})
			await bundle.bundle().then(err => {
				if (err) console.log(err)
			})
			await bundle.copyAssets()
			if (pluginsFolders.length - 1 === i) {
				resolve()
			}
		})
	})
}

async function pluginsTasks() {
	return await new Promise(async resolve => {
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
				resolve()
			}
		})
	})
}

async function copyLSPCMIcons() {
	return await new Promise(async resolve => {
		ncp(path.join(__dirname, 'node_modules/lsp-codemirror/lib/icons'), path.join(__dirname, 'dist_ui', 'icons'), () => {
			resolve()
		})
	})
}

async function removeBrowserPluginsDist(cb) {
	if (fs.existsSync(pluginsBrowserDistFolder)) {
		rimraf(pluginsBrowserDistFolder, () => {
			cb()
		})
	}
}

function createBrowserPluginsDist(cb) {
	if (!fs.existsSync(pluginsBrowserDistFolder)) {
		fs.mkdirSync(pluginsBrowserDistFolder)
	}
	cb()
}

async function cloneRemotePlugin() {
	return new Promise(res => {
		download('Graviton-Code-Editor/remote-plugin', path.join(__dirname, 'remote-plugin-temp'), () => {
			res()
		})
	})
}

async function installRemoteDeps() {
	return new Promise(res => {
		exec(
			'npm install',
			{
				cwd: path.join(__dirname, 'remote-plugin-temp'),
			},
			() => {
				res()
			},
		)
	})
}

async function buildRemote() {
	return new Promise(res => {
		exec(
			'npm run build',
			{
				cwd: path.join(__dirname, 'remote-plugin-temp'),
			},
			() => {
				res()
			},
		)
	})
}

async function copyRemoteDist() {
	return new Promise(res => {
		ncp(path.join(__dirname, 'remote-plugin-temp', 'dist'), path.join(pluginsBrowserDistFolder, 'remote-plugin'), err => {
			if (err) console.log(err)
			res()
		})
	})
}

const electronTasks = [updatePluginsDependencies, removePluginsDist, createPluginsFolder, pluginsWebpack, pluginsSDK, pluginsTasks, copyLSPCMIcons]
const browserTasks = [createBrowserPluginsDist, cloneRemotePlugin, installRemoteDeps, buildRemote, copyRemoteDist]

if (TargetPlatform === 'electron') {
	exports.default = series(...electronTasks)
} else if (TargetPlatform === 'browser') {
	exports.default = series(...browserTasks)
} else if (TargetPlatform === 'all') {
	exports.default = series(...electronTasks, ...browserTasks)
}

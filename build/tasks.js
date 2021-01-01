const fs = require('fs-extra')
const path = require('path')
const webpack = require('webpack')
const rimraf = require('rimraf')
const { Bundler } = require('@gveditor/sdk')
const { spawn, exec } = require('child_process')
const { ncp } = require('ncp')
const download = require('download-git-repo')

const pluginsSourceFolder = path.resolve(__dirname, '..', 'plugins', 'dynamic')
const pluginsDistFolder = path.resolve(__dirname, '..', 'pluginsDist')
const pluginsBrowserDistFolder = path.resolve(__dirname, '..', 'dist_browser_plugins')
const remotePluginTemp = path.resolve(__dirname, '..', 'temp_remote_plugin')

const buildData = {
	date: new Date().toDateString(),
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
			if (err) console.log(err)
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
	ncp(path.join(__dirname, 'node_modules/lsp-codemirror/lib/icons'), path.join(__dirname, 'dist_ui', 'icons'), () => {
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

async function installRemoteDeps(cb) {
	exec(
		'npm install',
		{
			cwd: remotePluginTemp,
		},
		() => {
			cb()
		},
	)
}

async function buildRemote(cb) {
	exec(
		'npm run build',
		{
			cwd: remotePluginTemp,
		},
		() => {
			cb()
		},
	)
}

async function copyRemoteDist(cb) {
	ncp(path.join(remotePluginTemp, 'dist'), path.join(pluginsBrowserDistFolder, 'remote-plugin'), err => {
		if (err) console.log(err)
		cb()
	})
}

function CommonTasks() {
	return [createBuildFile]
}

function ElectronTasks() {
	return [updatePluginsDependencies, removePluginsDist, createPluginsFolder, pluginsWebpack, pluginsSDK, pluginsTasks, copyLSPCMIcons]
}

function BrowserTasks() {
	return [createBrowserPluginsDist, cloneRemotePlugin, installRemoteDeps, buildRemote, copyRemoteDist]
}

exports.default = [CommonTasks, ElectronTasks, BrowserTasks].flat()

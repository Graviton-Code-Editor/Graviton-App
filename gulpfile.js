const fs = require('fs-extra')
const path = require('path')
const { series } = require('gulp')
const webpack = require('webpack')
const rimraf = require('rimraf')
const { bundleSource, copyPackageToDist } = require('@gveditor/sdk')
const { spawn } = require('child_process')
const { ncp } = require('ncp')

const pluginsSourceFolder = path.resolve(__dirname, 'plugins', 'dynamic')
const pluginDistFolder = path.resolve(__dirname, 'pluginsDist')

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
	if (fs.existsSync(pluginDistFolder)) {
		rimraf(pluginDistFolder, () => {
			cb()
		})
	}
}

function createPluginsFolder(cb) {
	if (!fs.existsSync(pluginDistFolder)) {
		fs.mkdirSync(pluginDistFolder)
	}
	cb()
}

function createPluginFolder(pluginName) {
	if (!fs.existsSync(path.join(pluginDistFolder, pluginName))) {
		fs.mkdirSync(path.join(pluginDistFolder, pluginName))
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
			const bundleConfig = {
				entryProject: path.join(pluginsSourceFolder, pluginName, 'package.json'),
				distDir: path.join(pluginDistFolder, pluginName),
			}
			await bundleSource(bundleConfig)
			const copyConfig = {
				entryProject: path.join(pluginsSourceFolder, pluginName, 'package.json'),
				dirFolder: path.join(pluginDistFolder, pluginName),
			}
			await copyPackageToDist(copyConfig)
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
			const distFolder = path.join(pluginDistFolder, pluginName)
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

exports.default = series(updatePluginsDependencies, removePluginsDist, createPluginsFolder, pluginsWebpack, pluginsSDK, pluginsTasks, copyLSPCMIcons)

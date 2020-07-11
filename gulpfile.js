const fs = require('fs-extra')
const path = require('path')
const { series } = require('gulp')
const webpack = require('webpack')
const rimraf = require('rimraf')
const { bundleSource, copyPackageToDist } = require('@gveditor/sdk')

const pluginsSourceFolder = path.resolve(__dirname, 'plugins')
const pluginDistFolder = path.resolve(__dirname, 'pluginsDist')

async function removePluginsDist(cb) {
	return new Promise(async (resolve, reject) => {
		if (fs.existsSync(pluginDistFolder)) {
			rimraf(pluginDistFolder, () => {
				resolve()
			})
		}
	})
}

function createPluginsFolder(cb) {
	if (!fs.existsSync(pluginDistFolder)) {
		fs.mkdirSync(pluginDistFolder)
	}
	cb()
}

function createPluginFolder(pluginName) {
	fs.mkdirSync(path.join(pluginDistFolder, pluginName))
}

async function pluginsWebpack() {
	return new Promise(async (resolve, reject) => {
		const pluginsFolders = await fs.readdir(pluginsSourceFolder)
		pluginsFolders.forEach((pluginName, i) => {
			createPluginFolder(pluginName)
			webpack(require(path.join(pluginsSourceFolder, pluginName, 'webpack.config.js')), async function (a, b) {
				if (pluginsFolders.length - 1 === i) {
					resolve()
				}
			})
		})
	})
}

async function pluginsSDK() {
	return new Promise(async (resolve, reject) => {
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
	return new Promise(async (resolve, reject) => {
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

exports.default = series(removePluginsDist, createPluginsFolder, pluginsWebpack, pluginsSDK, pluginsTasks)

const fs = require('fs-extra')
import simpleGit from 'simple-git'
import normalizeDir from '../utils/directory_normalizer'
import { join } from 'path'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'

/*
	This provides a tiny later between the GUI and the filesystem.
	This is used to access, read and mofify the local filesystem.
*/

const LocalExplorer = {
	name: 'Local',
	listDir: async function (path: string) {
		return new Promise(async res => {
			const items = await fs.readdir(path)
			const makeTransparentHiddenItems = StaticConfig.data.editorMakeTransparentHiddenItems
			res(
				await Promise.all(
					items
						.map(async (item: string) => {
							let error = null
							let isFolder = false
							let dir = join(path, item)
							try {
								isFolder = await new Promise(res => {
									fs.lstat(join(path, item), (err: string, result: any) => {
										if (err) {
											res(false)
										} else {
											res(result.isDirectory())
										}
									})
								})
							} catch (err) {
								error = err
							}
							if (!error) {
								let isHidden = false
								if (makeTransparentHiddenItems === true && item[0] === '.') {
									isHidden = await new Promise(res => {
										const hidefile = window.require('hidefile')
										hidefile.isHidden(dir, (err: string, result: boolean) => {
											if (err) {
												res(false)
											} else {
												res(result)
											}
										})
									})
								}
								return {
									name: item,
									isFolder,
									isHidden,
								}
							}
						})
						.filter(Boolean),
				),
			)
		})
	},
	readFile: async function (path: string) {
		return fs.readFile(path, 'UTF-8')
	},
	writeFile: function (path: string, data: string) {
		return fs.writeFile(path, data, 'UTF-8')
	},
	renameDir: function (oldPath: string, newPath: string) {
		return fs.rename(oldPath, newPath)
	},
	mkdir: function (path: string) {
		return fs.mkdir(path)
	},
	exists: function (path: string) {
		return fs.exists(path)
	},
	info: function (path: string) {
		return fs.lstatSync(path)
	},
	isGitRepo: async function (path: string) {
		if (!RunningConfig.data.isGitInstalled) return false
		const repoPath = normalizeDir(path)
		const simpleInstance = simpleGit(repoPath)
		return simpleInstance.checkIsRepo()
	},
	getGitStatus(path: string) {
		const simpleInstance = simpleGit(path)
		return simpleInstance.status()
	},
	getGitFileLastCommit(projectPath: string, path) {
		const simpleInstance = simpleGit(projectPath)
		return simpleInstance.log([path])
	},
	getGitFileContentByObject(projectPath, object, path) {
		const computedPath = path.replace(/\\/gm, '/')
		const simpleInstance = simpleGit(projectPath)
		return simpleInstance.show([`${object}:${computedPath}`])
	},
	getGitLastCommit(repoPath) {
		const simpleInstance = simpleGit(repoPath)
		return simpleInstance.log(['--name-status', 'HEAD^..HEAD'])
	},
	decorator: null,
}

export default LocalExplorer

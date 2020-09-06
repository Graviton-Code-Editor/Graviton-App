const fs = require('fs-extra')
import simpleGit from 'simple-git'
import normalizeDir from '../utils/directory.normalizer'
import { join } from 'path'

const LocalExplorer = {
	name: 'Local',
	listDir: async function (path: string) {
		return new Promise(async res => {
			const items = await fs.readdir(path)
			res(
				items.map((item: string) => {
					return {
						name: item,
						isFolder: fs.lstatSync(join(path, item)).isDirectory(),
					}
				}),
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
	info: function (path: string) {
		return fs.lstatSync(path)
	},
	isGitRepo: async function (path: string) {
		const repoPath = normalizeDir(path)
		const simpleInstance = simpleGit(repoPath)
		return simpleInstance.checkIsRepo()
	},
	getGitStatus(path: string) {
		const simpleInstance = simpleGit(path)
		return simpleInstance.status()
	},
	decorator: null,
}

export default LocalExplorer

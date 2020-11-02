import Core from 'Core'
import normalizeDir from '../utils/directory_normalizer'
import { join } from 'path'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'

const { fs, chokidar, simpleGit } = Core

/*
	This provides a tiny layer between the GUI and the filesystem.
	This is used to access, read and mofify the local filesystem.
*/
const LocalExplorer = {
	name: 'Local',
	listDir: async function (path: string) {
		return new Promise(async res => {
			const items = await Core.fs.readdir(path)
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
									;(Core.fs as any).lstat(join(path, item), (err: string, result: any) => {
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
										hidefile.isHidden(dir, (result: boolean) => {
											res(result)
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
		return (fs as any).exists(path)
	},
	info: function (path: string) {
		return fs.lstatSync(path)
	},
	/*
	 * Returns if the project is a git repository
	 */
	isGitRepo: async function (projectPath: string) {
		if (!RunningConfig.data.isGitInstalled) return false
		const repoPath = normalizeDir(projectPath)
		const simpleInstance = simpleGit(repoPath)
		return simpleInstance.checkIsRepo()
	},
	/*
	 * Return the the current git status
	 */
	getGitStatus(projectPath: string) {
		const simpleInstance = simpleGit(projectPath)
		return simpleInstance.status()
	},
	/*
	 * Return the latest commit of an specific file
	 */
	getGitFileLastCommit(projectPath: string, path) {
		const simpleInstance = simpleGit(projectPath)
		return simpleInstance.log([path])
	},
	/*
	 * Return a file's content in a specific commit
	 */
	getGitFileContentByObject(projectPath: string, object, path) {
		const computedPath = path.replace(/\\/gm, '/')
		const simpleInstance = simpleGit(projectPath)
		return simpleInstance.show([`${object}:${computedPath}`])
	},
	/*
	 * Return lastest commit
	 */
	getGitLastCommit(projectPath: string) {
		const simpleInstance = simpleGit(projectPath)
		return simpleInstance.log(['--name-status', 'HEAD^..HEAD'])
	},
	/*
	 * Return all commits in a project
	 */
	getGitAllCommits(projectPath: string) {
		const simpleInstance = simpleGit(projectPath)
		return simpleInstance.log()
	},
	/*
	 * Add files to the index
	 */
	gitAdd(projectPath: string, files: string[]) {
		const simpleInstance = simpleGit(projectPath)
		return simpleInstance.add(files)
	},
	/*
	 * Create a commit
	 */
	gitCommit(projectPath: string, commitContent: string) {
		const simpleInstance = simpleGit(projectPath)
		return simpleInstance.commit(commitContent)
	},
	/*
	 * Pull changes
	 */
	gitPull(projectPath: string, branch: string) {
		const simpleInstance = simpleGit(projectPath)
		return simpleInstance.pull('origin', branch)
	},
	/*
	 * Return a event-emitter like which emits changes in a folder
	 */
	watchDir(projectPath: string, options) {
		return chokidar.watch(projectPath, options)
	},
	decorator: null,
}

export default LocalExplorer

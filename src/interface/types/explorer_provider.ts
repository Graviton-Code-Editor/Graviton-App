/*
 * Custom FS API's Interface
 */

export interface ExplorerProvider {
	providerName: string
	decorator: string | null
	listDir: (
		path: string,
	) => Promise<{
		name: string
		isFolder: boolean
		isHidden: boolean
	}>
	readFile: (path: string) => Promise<string>
	writeFile: (path: string, data: string) => Promise<boolean>
	renameDir: (oldPath: string, newPath: string) => Promise<boolean>
	mkdir: (oldPath: string) => Promise<boolean>
	exists: (path: string) => Promise<boolean>
	info: (path: string) => Promise<any>
	isGitRepo: (projectPath: string) => Promise<boolean> | boolean
	getGitStatus: (projectPath: string) => Promise<any>
	getGitFileLastCommit: (projectPath: string, path: string) => Promise<any>
	getGitFileContentByObject: (projectPath: string, object: string, path: string) => Promise<any>
	getGitLastCommit: (projectPath: string) => Promise<any>
	getGitAllCommits: (projectPath: string) => Promise<any>
	gitAdd: (projectPath: string, files: string[]) => Promise<any>
	gitCommit: (projectPath: string, commitContent: string) => Promise<any>
	gitPull: (projectPath: string, branch: string) => Promise<any>
	gitPush: (projectPath: string, remote: string, branch: string) => Promise<any>
	watchDir: (projectPath: string, options: any) => Promise<any>
}

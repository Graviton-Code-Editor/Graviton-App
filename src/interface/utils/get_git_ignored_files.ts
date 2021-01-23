import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import * as path from 'path'

const sanitizePath = str => str.replace(/\//gm, '\\/').replace(/\./gm, '\\.').replace(/\*/gm, '\\*')

/*
 * Return an array of the ignored files specified a .gitignore
 */
export default async function getGitIgnoredFiles(projectPath: string): Promise<string[]> {
	if (!StaticConfig.data.editorFSIgnoreIgnoredGitFiles) return []

	const fs = RunningConfig.data.explorerProvider
	const dot_ignore = path.join(projectPath, '.gitignore')

	if (await fs.exists(dot_ignore)) {
		const content = await fs.readFile(dot_ignore)
		return content.split('\n').map(sanitizePath)
	}
	return []
}

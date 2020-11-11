import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import LocalExplorer from '../defaults/local.explorer'
import { WorkspaceFoldername, WorkspaceFilename } from 'Constants'
import * as path from 'path'
import { setWorkspaceSettings } from 'FileSystem'

if (StaticConfig.data.appCheckWorkspaceExistsWhenOpeningFolders) {
	RunningConfig.on('addFolderToRunningWorkspace', async ({ folderPath, replaceOldExplorer = false }) => {
		/*
		 * Only search for a workspace config file if the user manually opened the folder,
		 * it won't act if the folder is opened from a workspace since the workspace
		 * itself already provides it's own settings
		 */
		if (replaceOldExplorer) {
			const files: any = await LocalExplorer.listDir(folderPath)
			files.forEach(async ({ isFolder, name }) => {
				// Check if .gveditor exists
				if (isFolder && name === WorkspaceFoldername) {
					const workspaceSettingsPath = path.join(folderPath, WorkspaceFoldername, WorkspaceFilename)
					// Find if settings exists under .gveditor in the opened folder
					if (await LocalExplorer.exists(workspaceSettingsPath)) {
						// Retrieve workspace's settings
						const workspaceConfig = window.require(workspaceSettingsPath)
						// Apply workspace's settings
						setWorkspaceSettings(workspaceConfig.settings)
						RunningConfig.data.workspacePath = workspaceSettingsPath
						RunningConfig.data.workspaceConfig = {
							...workspaceConfig,
							folders: [
								{
									name: path.dirname(folderPath),
									path: folderPath,
								},
							],
						}
					}
				}
			})
		}
	})
}

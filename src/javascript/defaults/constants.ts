import isDev from 'electron-is-dev'
import path from 'path'
import StaticConfig from 'StaticConfig'

const WorkspaceFilename = 'gv-workspace.json'
const pluginsIternalDir = isDev ? path.resolve(__dirname, '..', '..', '..', 'pluginsDist') : path.resolve(__dirname, '..', '..', '..', 'resources', 'pluginsDist')
const pluginsExternalDir = path.join(StaticConfig.data.appConfigPath, 'plugins')

export  {
	WorkspaceFilename,
	pluginsIternalDir,
	pluginsExternalDir
}
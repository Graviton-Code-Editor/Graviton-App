import isDev from 'electron-is-dev'
import path from 'path'
import StaticConfig from 'StaticConfig'

export const APIEndpoint = 'https://graviton-api.herokuapp.com'
export const APIPluginsEndpoint = `${APIEndpoint}/plugins`

export const WorkspaceFilename = 'graviton.wp.json'

export const pluginsIternalDir = isDev ? path.resolve(__dirname, '..', '..', '..', 'pluginsDist') : path.resolve(process.resourcesPath, 'pluginsDist')
export const pluginsExternalDir = path.join(StaticConfig.data.appConfigPath, 'plugins')

export const filesWatcherExcludedDirs = ['.git', 'dist', 'node_modules', '.cache']

export const NotificationsLifeTime = 6000
export const NotificationsMaxCount = 3

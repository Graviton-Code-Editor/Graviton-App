import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import * as path from 'path'

export const APIEndpoint = 'https://graviton-api.herokuapp.com'
export const APIPluginsEndpoint = `${APIEndpoint}/plugins`

export const WorkspaceFilename = 'graviton.wp.json'

export const pluginsIternalDir = window.process ? (RunningConfig.data.isDev ? path.resolve(__dirname, '..', '..', '..', 'pluginsDist') : path.join(window.process.resourcesPath, 'pluginsDist')) : ''
export const pluginsExternalDir = window.process ? path.join(StaticConfig.data.appConfigPath, 'plugins') : ''

export const filesWatcherExcludedDirs = ['.git', 'dist', 'node_modules', '.cache', '.next', 'bin', 'package-lock.json', 'yarn.lock']

export const NotificationsLifeTime = 6000
export const NotificationsMaxCount = 3

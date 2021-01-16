import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import * as path from 'path'

/*
 * API's endpoints
 */
export const APIEndpoint = 'https://graviton-api.herokuapp.com'
export const APIPluginsEndpoint = `${APIEndpoint}/plugins`

/*
 * Workspaces configs
 */
export const WorkspaceFilename = 'settings.json'
export const WorkspaceFoldername = '.gveditor'

/*
 * Default ignored files in the files watcher
 */
export const filesWatcherExcludedDirs = ['.git', 'dist', 'node_modules', '.cache', '.next', 'bin', 'package-lock.json', 'yarn.lock']

/*
 * Notification configs
 */
export const NotificationsLifeTime = 6000
export const NotificationsMaxCount = 3

/*
 * Length of lines considered large
 */
export const LargeFileLinesLength = 15000

/*
 * Length of characters considered large
 */
export const LargeFileCharsLength = 170000

import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import * as path from 'path'

export function pluginsInternalDir() {
	const { isBrowser, isDev } = RunningConfig.data
	if (isBrowser) {
		return ''
	} else {
		if (isDev) {
			return path.resolve(__dirname, '..', '..', '..', 'pluginsDist')
		} else {
			return path.join((window as any).process.resourcesPath, 'pluginsDist')
		}
	}
}

export function pluginsExternalDir() {
	return window.process ? path.join(StaticConfig.data.appConfigPath, 'plugins') : ''
}

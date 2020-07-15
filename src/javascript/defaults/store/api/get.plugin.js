import { APIPluginsEndpoint } from 'Constants'
import axios from 'axios'
import throwError from '../utils/throw.error'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'

const PLUGIN_CACHE_LIVETIME = 21600 // 6 hours

function notFoundError() {
	if (!RunningConfig.data.isDev) throwError('Cannot find this plugin in the Store.')
}

const pluginReserved = pluginID => pluginID === 'arctic-theme' || pluginID == 'night-theme'

function getPluginById(pluginId) {
	return new Promise((resolve, reject) => {
		if (!pluginId) {
			notFoundError()
			return resolve({})
		}
		if (pluginReserved(pluginId)) return resolve({})
		const cachedPlugin = pluginExistsInCache(pluginId)
		if (cachedPlugin) {
			resolve(cachedPlugin)
		} else {
			axios({
				method: 'get',
				url: `${APIPluginsEndpoint}/${pluginId}`,
			})
				.then(async function (response) {
					resolve(response.data.plugin || {})
					if (response.data.plugin) {
						addPluginToCache(response.data.plugin)
					}
				})
				.catch(axiosResponse => {
					const { status } = axiosResponse.response
					if (status === 404) {
						//Throw not found error but still resolve
						notFoundError()
						return resolve({})
					}
					if (status === 429) {
						//Throw error 'too many request'
						return throwError('Too many requests, wait.')
					}
				})
		}
	})
}

const pluginExistsInCache = pluginId => {
	const storeCache = StaticConfig.data.appCache.store
	let cachedPlugin = false
	if (storeCache) {
		storeCache.plugins.map(plugin => {
			if (plugin.id == pluginId && plugin.timestamp + PLUGIN_CACHE_LIVETIME > Math.floor(Date.now() / 1000)) {
				cachedPlugin = plugin
			}
		})
	}
	return cachedPlugin
}

const addPluginToCache = plugin => {
	const storeCache = StaticConfig.data.appCache.store
	storeCache.plugins.push({
		timestamp: Math.floor(Date.now() / 1000),
		...plugin,
	})
	StaticConfig.triggerChange()
}

export default getPluginById

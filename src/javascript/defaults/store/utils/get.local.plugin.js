import PluginsRegistry from 'PluginsRegistry'

function getLocalPluginById(pluginId) {
	const pluginsList = PluginsRegistry.registry.data.list
	return (
		pluginsList[
			Object.keys(pluginsList).find(pluginName => {
				const pluginInfo = pluginsList[pluginName]
				return pluginInfo.id === pluginId
			})
		] || {}
	)
}

export default getLocalPluginById

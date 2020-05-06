import PluginsRegistry from 'PluginsRegistry'
import getLocalPluginById from './get.local.plugin'

function isPluginInstalled(pluginId) {
	return typeof getLocalPluginById(pluginId).id == 'string'
}

export default isPluginInstalled

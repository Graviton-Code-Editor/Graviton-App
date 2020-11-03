import { state } from '@mkenzo_8/puffin'
import { PuffinState } from 'Types/puffin.state'

const registry: PuffinState = new state({
	list: {},
	colorsSchemes: {},
})

function add(pluginPackage): void {
	registry.data.list[pluginPackage.name] = pluginPackage
	registry.data.colorsSchemes[pluginPackage.name] = pluginPackage.colorsScheme
}

function remove(pluginName): void {
	delete registry.data.list[pluginName]
	delete registry.data.colorsSchemes[pluginName]
}

const PluginsRegistry = {
	registry,
	add,
	remove,
}

export default PluginsRegistry

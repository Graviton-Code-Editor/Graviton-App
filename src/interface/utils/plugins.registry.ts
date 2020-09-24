import { state } from '@mkenzo_8/puffin'
import { PuffinState } from 'Types/puffin.state'

const registry: PuffinState = new state({
	list: {},
	colorsSchemes: {},
})

function add(pkg): void {
	registry.data.list[pkg.name] = pkg
	registry.data.colorsSchemes[pkg.name] = pkg.colorsScheme
}

const PluginsRegistry = {
	registry,
	add,
}

export default PluginsRegistry

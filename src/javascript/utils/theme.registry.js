import { puffin } from '@mkenzo_8/puffin'

const registry = new puffin.state({
    list:{},
    colorsSchemes:{}
})

function add(pkg){
    registry.data.list[pkg.name] = pkg
    registry.data.colorsSchemes[pkg.name] = pkg.colorsScheme
}

const ThemeRegistry = {
    registry,
    add
}

export default ThemeRegistry
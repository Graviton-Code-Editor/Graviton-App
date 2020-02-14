import { puffin } from '@mkenzo_8/puffin'
import StaticConfig from 'StaticConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'
import path from 'path'
import requirePath from './require'
const fs = requirePath("fs-extra")

function getExtension(path){
    return require(path)
}

function loadExtension(path){
   return require(path).main({Window,puffin,Menu})
}

function initExtension(extension){
    return extension.entry()
}

function loadAutomatically(){
    const pluginsPath = path.join(StaticConfig.data.configPath,'plugins')

    fs.readdir(pluginsPath).then(function(paths){
        paths.map(function(pluginName){
            const pckPluginPath = path.join(pluginsPath,pluginName,'package.json')
            if(fs.existsSync(pckPluginPath)){
                ExtensionsRegistry.add(
                    getExtension(pckPluginPath)
                )
            }
        })
    })
}

export { loadExtension, initExtension, loadAutomatically }

/**
 * entry() ->  Initial extension's function, called when the plugin is executed
 */
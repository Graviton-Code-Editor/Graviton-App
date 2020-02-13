import { puffin } from '@mkenzo_8/puffin'

function loadExtension(path){
   return require(path).main({Window,puffin,Menu})
}

function initExtension(extension){
    return extension.entry()
}

export { loadExtension, initExtension }

/**
 * entry() ->  Initial extension's function, called when the plugin is executed
 */
import { puffin } from '@mkenzo_8/puffin'
import { getConfiguration } from './configurator'

const cachedConfiguration = getConfiguration()

let editorConf = Object.assign({},cachedConfiguration.config)

const StaticConfig = new puffin.state(editorConf)

StaticConfig.changed(function(data){
    cachedConfiguration.store.set('config',StaticConfig.data)
})

export default StaticConfig
import {puffin} from '@mkenzo_8/puffin'
import {initConfiguration , getConfiguration} from './configurator'

initConfiguration()
const cachedConfiguration = getConfiguration()

let editorConf = Object.assign({},cachedConfiguration.editor)

const StaticConfig = puffin.state(editorConf)

StaticConfig.changed(function(data){
    cachedConfiguration.store.set('editor',data)
})

export default StaticConfig
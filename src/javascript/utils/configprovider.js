import {puffin} from '@mkenzo_8/puffin'
import ThemeProvider from './themeprovider'
import {initConfiguration , getConfiguration} from './configurator'

initConfiguration()
const cachedConfiguration = getConfiguration()

let editorConf = Object.assign({},cachedConfiguration.editor)

const ConfigProvider = puffin.state(editorConf)

ConfigProvider.changed(function(data){
    cachedConfiguration.store.set('editor',data)
})

export default ConfigProvider
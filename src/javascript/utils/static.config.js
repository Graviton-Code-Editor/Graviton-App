import { puffin } from '@mkenzo_8/puffin'
import { getConfiguration } from './configurator'
import requirePath from './require'
const { webFrame } = requirePath('electron')
const cachedConfiguration = getConfiguration()

function saveConfiguration(){
    cachedConfiguration.store.set('config',StaticConfig.data)
}

const StaticConfig = new puffin.state(
    Object.assign({},cachedConfiguration.config)
)

StaticConfig.changed(function(data){
    saveConfiguration()
})

StaticConfig.on('setZoom',(zoom)=> {
    webFrame.setZoomFactor(zoom)
})

StaticConfig.emit('setZoom',StaticConfig.data.zoom) //Set default zoom

console.log(StaticConfig)

export default StaticConfig
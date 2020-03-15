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

StaticConfig.keyChanged('appZoom',(value)=> {
    webFrame.setZoomFactor(value)
})


StaticConfig.keyChanged('editorFSWatcher',(status)=>{
	if( status ){
		StaticConfig.emit('startWatchers')
	}else{
		StaticConfig.emit('stopWatchers')
	}
})


console.log(StaticConfig)

export default StaticConfig
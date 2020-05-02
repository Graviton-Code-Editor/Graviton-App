import { puffin } from '@mkenzo_8/puffin'
import { getConfiguration } from './configurator'
const { webFrame } = window.require('electron')
const cachedConfiguration = getConfiguration()
import RunningConfig from 'RunningConfig'

function saveConfiguration(){
	cachedConfiguration.store.set('config', StaticConfig.data )
}

const StaticConfig = new puffin.state(
	Object.assign( {}, cachedConfiguration.config )
)

StaticConfig.changed( (a,b) => {
	if( !RunningConfig.data.currentStaticConfig.hasOwnProperty(b) && !RunningConfig.data.isDebug ){
		saveConfiguration()
	}
})

StaticConfig.keyChanged('appZoom', value => {
	webFrame.setZoomFactor( value )
})

StaticConfig.keyChanged('editorFSWatcher', status =>{
	if( status ){
		StaticConfig.emit('startWatchers')
	}else{
		StaticConfig.emit('stopWatchers')
	}
})

webFrame.setZoomFactor( StaticConfig.data.appZoom )

console.log (StaticConfig )

export default StaticConfig
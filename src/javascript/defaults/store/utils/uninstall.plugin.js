import path from 'path'
import StaticConfig from 'StaticConfig'

const rimraf = window.require('rimraf')

function uninstallPlugin({ id }){
	return new Promise( ( resolve, reject) => {
		const pluginDir = path.join( StaticConfig.data.appConfigPath,'plugins', id)
		rimraf(pluginDir, () => {
			resolve()
		})
	})
}

export default uninstallPlugin
import { state } from '@mkenzo_8/puffin'
import { getConfiguration } from './configurator'
const { webFrame } = window.require('electron')
const cachedConfiguration = getConfiguration()
import RunningConfig from 'RunningConfig'
import PluginsRegistry from 'PluginsRegistry'
const path = require('path')
import PuffinState from '../types/puffin.state'

function saveConfiguration() {
	cachedConfiguration.store.set('config', StaticConfig.data)
}

const StaticConfig: PuffinState = new state(Object.assign({}, cachedConfiguration.config))

StaticConfig.changed((a, b) => {
	if (!RunningConfig.data.currentStaticConfig.hasOwnProperty(b) && !RunningConfig.data.isDebug) {
		saveConfiguration()
	}
})

StaticConfig.keyChanged('appZoom', value => {
	webFrame.setZoomFactor(value)
})

StaticConfig.keyChanged('editorFSWatcher', status => {
	if (status) {
		StaticConfig.emit('startWatchers')
	} else {
		StaticConfig.emit('stopWatchers')
	}
})

StaticConfig.keyChanged('appIconpack', value => {
	setIconpack(value)
})

function setIconpack(value) {
	const iconpackData = PluginsRegistry.registry.data.list[value]
	const icons = iconpackData.icons
	Object.keys(icons).map(iconItem => {
		const { icon, type = 'fileformat', openedIcon } = icons[iconItem]
		const pluginPath = iconpackData.PATH
		switch (type) {
			case 'fileformat':
				RunningConfig.data.iconpack[`${iconItem}.lang`] = path.join(pluginPath, icon)
				break
			case 'filetype':
				RunningConfig.data.iconpack[`${iconItem}.type`] = path.join(pluginPath, icon)
				break
			case 'filename':
				RunningConfig.data.iconpack[`file.${iconItem}`] = path.join(pluginPath, icon)
				break
			case 'foldername':
				RunningConfig.data.iconpack[`folder.closed.${iconItem}`] = path.join(pluginPath, icon)
				RunningConfig.data.iconpack[`folder.opened.${iconItem}`] = path.join(pluginPath, openedIcon)
				break
			case 'basicfolder':
				RunningConfig.data.iconpack[`folder.closed`] = path.join(pluginPath, icon)
				RunningConfig.data.iconpack[`folder.opened`] = path.join(pluginPath, openedIcon)
				break
			case 'basicfile':
				RunningConfig.data.iconpack[`unknown.file`] = path.join(pluginPath, icon)
				break
			case 'basicimage':
				RunningConfig.data.iconpack[`image`] = path.join(pluginPath, icon)
				break
		}
	})
	RunningConfig.emit('updatedIconpack', RunningConfig.data.iconpack)
}

RunningConfig.on('allPluginsLoaded', () => {
	if (!PluginsRegistry.registry.data.list[StaticConfig.data.appIconpack]) {
		StaticConfig.data.appIconpack = 'Graviton'
	}
	setIconpack(StaticConfig.data.appIconpack)
})

StaticConfig.keyChanged('editorFontFamily', value => {
	setFontFamily(value)
})

function setFontFamily(value) {
	document.body.style.setProperty('--codeFont', value)
}

webFrame.setZoomFactor(StaticConfig.data.appZoom)
setFontFamily(StaticConfig.data.editorFontFamily)

console.log(StaticConfig)

export default StaticConfig

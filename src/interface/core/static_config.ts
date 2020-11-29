import { state } from '@mkenzo_8/puffin'
import { getConfiguration, updateConfiguration } from './configurator'
import RunningConfig from 'RunningConfig'
import PluginsRegistry from 'PluginsRegistry'
import * as path from 'path'
import { PuffinState } from 'Types/puffin.state'
import Core from 'Core'
const {
	electron: { webFrame },
} = Core

const isBrowser = RunningConfig.data.isBrowser

function saveConfiguration() {
	let config = {}
	Object.keys(StaticConfig.data).forEach(key => {
		if (!RunningConfig.data.ignoredStaticConfig.hasOwnProperty(key)) {
			config[key] = StaticConfig.data[key]
		}
	})
	updateConfiguration(config)
}

const StaticConfig: PuffinState = new state(Object.assign({}, getConfiguration()))
/*
 * Save the user's configuration when anything gets changed
 */
StaticConfig.changed((data, keyName) => {
	if (!RunningConfig.data.ignoredStaticConfig.hasOwnProperty(keyName) && !RunningConfig.data.isDebug) {
		saveConfiguration()
	}
})

/*
 * Update GUI's zoom when it gets changed
 */

if (!isBrowser) {
	StaticConfig.keyChanged('appZoom', value => {
		webFrame.setZoomFactor(value)
	})
}

/*
 * Update Runtime's iconpack when it gets changed
 */
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
		// Fallback to Graviton's Iconpack if any iconpack is configured
		StaticConfig.data.appIconpack = 'Graviton'
	}
	// Load the configured iconpack
	setIconpack(StaticConfig.data.appIconpack)
})

/*
 * Apply the new font when it's changed
 */
StaticConfig.keyChanged('editorFontFamily', value => {
	setFontFamily(value)
})

function setFontFamily(value) {
	document.body.style.setProperty('--codeFont', value)
}

//if (!isBrowser) webFrame.setZoomFactor(StaticConfig.data.appZoom)

setFontFamily(StaticConfig.data.editorFontFamily)

export default StaticConfig

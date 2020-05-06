import StaticConfig from 'StaticConfig'
let AppPlatform

if (StaticConfig.data.appPlatform === 'auto') {
	AppPlatform = window.require('electron').remote.process.platform
} else {
	AppPlatform = StaticConfig.data.appPlatform
}

export default AppPlatform

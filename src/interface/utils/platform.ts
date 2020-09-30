import StaticConfig from 'StaticConfig'
let AppPlatform: string

if (StaticConfig.data.appPlatform === 'auto') {
	AppPlatform = process.platform
} else {
	AppPlatform = StaticConfig.data.appPlatform
}

export default AppPlatform

import StaticConfig from 'StaticConfig'
let AppPlatform: string
import isBrowser from '../utils/is_browser'

if (StaticConfig.data.appPlatform === 'auto') {
	AppPlatform = isBrowser ? '' : process.platform
} else {
	AppPlatform = StaticConfig.data.appPlatform
}

export default AppPlatform

import StaticConfig from 'StaticConfig'
let AppPlatform: string
import isBrowser from '../utils/is_browser'

if (isBrowser) {
	if (navigator.platform.includes('Win32')) {
		AppPlatform = 'win32'
	} else if (navigator.platform.includes('Mac')) {
		AppPlatform = 'darwin'
	} else if (navigator.platform.includes('Linux')) {
		AppPlatform = 'linux'
	}
} else {
	if (StaticConfig.data.appPlatform === 'auto') {
		AppPlatform = process.platform
	} else {
		AppPlatform = StaticConfig.data.appPlatform
	}
}

export default AppPlatform

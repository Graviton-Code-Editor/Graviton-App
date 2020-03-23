import requirePath from './require'
import StaticConfig from 'StaticConfig'
let AppPlatform = null;
if( StaticConfig.data.appPlatform == 'auto' ){
	AppPlatform = requirePath("electron").remote.process.platform
}else{
	AppPlatform = StaticConfig.data.appPlatform 
}

export default AppPlatform
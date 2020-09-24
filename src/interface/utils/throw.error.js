import RunningConfig from 'RunningConfig'
const isDev = window.require('electron-is-dev')

function throwError(message, err) {
	if (RunningConfig.data.isDebug || isDev) {
		throw Error(err)
	} else {
		console.log(`%cERR::%c ${message}`, 'color:rgb(255,35,35)', 'color:white')
	}
}

export default throwError

import RunningConfig from 'RunningConfig'

function throwError(message, err) {
	if (RunningConfig.data.isDebug || RunningConfig.data.isDev) {
		throw Error(err)
	} else {
		console.log(`%cERR::%c ${message}`, 'color:rgb(255,35,35)', 'color:white')
	}
}

export default throwError

import RunningConfig from 'RunningConfig'

export default function throwError(message: string, err: any) {
	if (RunningConfig.data.isDebug || RunningConfig.data.isDev) {
		throw Error(err)
	} else {
		console.log(`%cERR::%c ${message}`, 'color:rgb(255,35,35)', 'color:white')
	}
}

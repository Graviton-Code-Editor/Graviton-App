import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import Window from 'Constructors/window'
import Dialog from 'Constructors/dialog'
import Notification from 'Constructors/notification'
import * as puffin from '@mkenzo_8/puffin'

if (!RunningConfig.data.isBrowser) {
	if (eval('window.process.env.NODE_ENV') !== 'test') {
		console.log(RunningConfig)
		console.log(StaticConfig)
	} else {
		// Expose API globally, so can be accessed from the tests file
		;(window as any).test = {
			RunningConfig,
			StaticConfig,
			Window,
			Dialog,
			puffin,
			Notification,
		}
		RunningConfig.on('allPluginsLoaded', () => {
			setTimeout(function () {
				RunningConfig.emit('test.bootedUp', {})
			}, 1000)
		})
	}
}

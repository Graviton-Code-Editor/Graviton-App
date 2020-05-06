import StatusBarItem from '../../constructors/status.bar.item'
import RunningConfig from 'RunningConfig'
import { element } from '@mkenzo_8/puffin'

if (RunningConfig.data.isDebug) {
	const DebugModeStatusBarItem = new StatusBarItem({
		label: 'Debug',
		position: 'left',
		important: true,
	})
	RunningConfig.on('appLoaded', () => {
		DebugModeStatusBarItem.show()
	})
}

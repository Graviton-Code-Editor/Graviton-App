import StatusBarItem from '../../constructors/status.bar.item'
import RunningConfig from 'RunningConfig'
import { element } from '@mkenzo_8/puffin'

RunningConfig.once('appLoaded', () => {
	if (RunningConfig.data.isDebug) {
		const DebugModeStatusBarItem = new StatusBarItem({
			label: 'Debug',
			position: 'left',
			important: true,
			hint: 'This window is running in debug mode.',
		})
		DebugModeStatusBarItem.show()
	}
})

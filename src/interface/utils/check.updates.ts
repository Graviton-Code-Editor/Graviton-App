import gravitonHasUpdate from '../defaults/store/utils/app.update'
import Core from 'Core'
const {
	electron: {
		shell: { openExternal },
	},
} = Core
import RunningConfig from 'RunningConfig'
import Notification from '../constructors/notification'

function checkForUpdates(ifNoUpdate?: () => void): any {
	if (RunningConfig.data.isDev && !ifNoUpdate) return
	gravitonHasUpdate()
		.then(({ res, version, channelBuild }) => {
			if (res) {
				new Notification({
					title: 'Update available',
					content: `Version ${version} is available`,
					buttons: [
						{
							label: 'misc.Update',
							action() {
								if (channelBuild === 'dev') {
									openExternal(`https://github.com/Graviton-Code-Editor/Graviton-App/releases/tag/v${version}`)
								} else {
									openExternal('https://graviton.netlify.app/download')
								}
							},
						},
						{
							label: 'misc.Ignore',
						},
					],
				})
			} else {
				ifNoUpdate && ifNoUpdate()
			}
		})
		.catch(err => {
			console.log('Couldnt fetch updates.', err)
		})
}

export default checkForUpdates

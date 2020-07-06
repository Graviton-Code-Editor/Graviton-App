import RunningConfig from 'RunningConfig'
const fs = window.require('fs')
import { join } from 'path'

RunningConfig.data.envs.push({
	name: 'npm',
	prefix: 'npm run',
	filter(dir) {
		if (fs.existsSync(join(dir, 'package.json'))) {
			return window.require(join(dir, 'package.json'))
		}
		return false
	},
})

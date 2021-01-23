import RunningConfig from 'RunningConfig'
import Core from 'Core'
const { fs } = Core
import { join } from 'path'

RunningConfig.data.envs.push({
	name: 'npm',
	prefix: 'npm run',
	filter(dir) {
		if (fs.existsSync(join(dir, 'package.json'))) {
			return processPackage(window.require(join(dir, 'package.json')))
		}
		return false
	},
})

const processPackage = packageData => {
	let finalPackage = {}

	Object.keys(packageData).forEach(str => {
		const val = packageData[str]

		if (typeof val === 'string' || typeof val === 'boolean') {
			finalPackage[str] = {
				icon: 'unknown',
				value: `${str}: ${val}`,
			}
		} else {
			finalPackage[str] = {
				icon: 'unknown',
				value: val,
			}
		}
	})

	return {
		...finalPackage,
		scripts: (() => {
			let res = {}
			Object.keys(packageData.scripts || {}).forEach(scp => {
				res[scp] = packageData.scripts[scp]
			})
			return res
		})(),
	}
}

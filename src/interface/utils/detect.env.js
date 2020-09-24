import { join } from 'path'
import RunningConfig from 'RunningConfig'

function detectEnv(folder) {
	return new Promise(resolve => {
		const registeredEnvs = RunningConfig.data.envs
		for (const { name, prefix, filter } of registeredEnvs) {
			const pass = filter(folder)
			if (pass instanceof Promise) {
				pass
					.then(data => {
						if (data) {
							resolve({
								env: name,
								prefix,
								info: data,
							})
						}
					})
					.catch(() => {
						//Continue searching
					})
			} else {
				if (pass) {
					resolve({
						env: name,
						prefix,
						info: pass,
					})
				}
			}
		}
	})
}

export default detectEnv

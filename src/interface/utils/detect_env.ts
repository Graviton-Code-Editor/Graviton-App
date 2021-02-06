import { join } from 'path'
import RunningConfig from 'RunningConfig'

/*
 * This function is used to display the first-matched environment filter in the Environments Panel when a folder is created.
 */

interface EnvResult {
	env: string
	prefix: string
	info: any
}

function detectEnv(folder): Promise<EnvResult> {
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

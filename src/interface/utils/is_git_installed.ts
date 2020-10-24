const isBrowser = !eval('window.process')
import Core from 'Core'
const {
	childProcess: { exec },
} = Core

/*
 * Check if git is installed
 */

export default function isGitInstalled(): Promise<boolean> {
	return new Promise(res => {
		if (isBrowser) res(false) //Return false when it's running in browser
		exec('git', {}, (err: any, stdout: string) => {
			if (stdout.includes('usage: git')) {
				res(true)
			} else {
				res(false)
			}
		})
	})
}

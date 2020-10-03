import { exec } from 'child_process'

/*
 * Check if git is installed
 */

export default function isGitInstalled(): Promise<boolean> {
	return new Promise(res => {
		exec('git', {}, (err: any, stdout: string) => {
			if (stdout.includes('usage: git')) {
				res(true)
			} else {
				res(false)
			}
		})
	})
}

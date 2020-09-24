const { exec } = window.require('child_process')

export default () => {
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

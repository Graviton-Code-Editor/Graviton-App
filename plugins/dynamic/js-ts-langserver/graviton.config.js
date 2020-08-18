const path = require('path')
const { ncp } = require('ncp')
const fs = require('fs-extra')

module.exports.tasks = [
	async function ({ distFolder }) {
		await copy(path.resolve(__dirname, './node_modules/typescript/lib/'), path.join(distFolder, 'tslib'))
	},
]

const copy = (from, to) => {
	return new Promise(res => {
		ncp(
			from,
			to,
			{
				filter(filePath) {
					const fileName = path.basename(filePath)
					const fileStats = fs.lstatSync(filePath)
					if (fileStats.isDirectory() && fileName !== 'lib') return false
					if (fileName === 'README.md' || fileName === 'watchGuard.js' || fileName === 'watchGuard.js') return false
					if (fileName.match('typescript')) return false
					return true
				},
			},
			() => {
				res()
			},
		)
	})
}

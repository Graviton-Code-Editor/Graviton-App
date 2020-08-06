const path = require('path')
const fs = require('fs')
const { ncp } = require('ncp')

module.exports.tasks = [
	async function ({ distFolder }) {
		const jaegeridl = path.resolve(__dirname, './node_modules/jaeger-client/dist/src/jaeger-idl')
		await copy(jaegeridl, path.join(distFolder, 'jaeger-idl'))
	},
]

const copy = (from, to) => {
	return new Promise((res, rej) => {
		ncp(from, to, err => {
			res()
		})
	})
}

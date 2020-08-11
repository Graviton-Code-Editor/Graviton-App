const fs = require('fs-extra')
const path = require('path')

const BUILD_DIR = path.join(__dirname, '..', 'assets', 'build.json')
const buildData = {
	date: new Date().toDateString(),
}

fs.writeFile(BUILD_DIR, JSON.stringify(buildData))
	.then(() => {
		console.log(`✨ Created build's JSON.`)
	})
	.catch(err => {
		console.log(err)
	})

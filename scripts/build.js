const fs = require('fs-extra')
const path = require('path')
const contributors = require('contributor-faces')

const BUILD_DIR = path.join(__dirname, '..', 'assets', 'build.json')
const buildData = {
	date: new Date().toDateString(),
}

contributors().then(contributors => {
	buildData.contributors = contributors.map(({ login }) => {
		return {
			name: login,
		}
	})
	fs.writeFile(BUILD_DIR, JSON.stringify(buildData))
		.then(() => {
			console.log(`✨ Created build's JSON.`)
		})
		.catch(err => {
			console.log(err)
		})
})

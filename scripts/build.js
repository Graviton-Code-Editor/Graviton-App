const fs = require("fs-extra")
const path = require("path")

const BUILD_DIR = path.join(__dirname,'..','assets','build.json')
const buildData = JSON.stringify({
	date:new Date().toDateString()
})

fs.writeFile(BUILD_DIR,buildData).then(()=>{
	console.log(`✨ Created build's JSON.`)
}).catch((err)=>{
	console.log(err)
})
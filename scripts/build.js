const fs = require("fs-extra")
const path = require("path")

fs.writeFile(path.join(__dirname,'..','assets','build.json'),JSON.stringify({
	date:new Date().toDateString()
})).then(()=>{
	console.log(`✨ Created build's JSON.`)
}).catch((err)=>{
	console.log(err)
})
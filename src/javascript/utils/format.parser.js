import path from 'path'

function getFormat(dir){
	const array = path.extname(dir).split(".")
	return array != undefined?array[array.length-1]:path.basename(dir)
}

export default getFormat
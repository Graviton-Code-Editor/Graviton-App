import requirePath from './require'

const path = requirePath("path")

function parseDirectory(directory){
    let nameFolder = path.basename(directory)

    if(process.platform == "win32"){
            nameFolder = path.basename(directory.replace(/\\/g,'\\\\'))
    }

    return nameFolder
}

export default parseDirectory
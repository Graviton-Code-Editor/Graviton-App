const fs = window.require('fs')
const { join } = window.require('path')

function detectEnv( folder ){
	if( fs.existsSync( join(folder,'package.json') ) ){
		return {
			env: 'node',
			info: require( join(folder,'package.json'))
		}
	}
	return {
		env: null,
		info:{}
	}
}

export default detectEnv
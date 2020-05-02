import Endpoints from '../api/api.endpoints'
import axios from 'axios'
import packageJSON from '../../../../../package.json'
import semver from 'semver'

function gravitonHasUpdate(){
	return new Promise((resolve,reject) => {
		axios({
			method: 'get',
			url: Endpoints.API
		}).then(async function (response) {
			const gravitonVersion = response.data['gravitonVersion']

			if( semver.gt(gravitonVersion, packageJSON.version ) ){
				resolve({
					res: true,
					version: gravitonVersion
				})
			}else {
				resolve({
					res: false,
					version:  packageJSON.version
				})
			}
		}).catch( err => {
			reject(err)
		})
	})
}

export default gravitonHasUpdate
import Endpoints from '../api/api.endpoints'
import axios from 'axios'
import packageJSON from '../../../../../package.json'
import semver from 'semver'
const isDev = window.require('electron-is-dev')

function gravitonHasUpdate() {
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: Endpoints.API,
		})
			.then(async function (response) {
				const { betaVersion, stableVersion } = response.data.graviton
				let gravitonVersion = betaVersion
				if (semver.gt(gravitonVersion, packageJSON.version)) {
					resolve({
						res: true,
						version: gravitonVersion,
					})
				} else {
					resolve({
						res: false,
						version: packageJSON.version,
					})
				}
			})
			.catch(err => {
				reject(err)
			})
	})
}

export default gravitonHasUpdate

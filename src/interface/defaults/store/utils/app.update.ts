import { APIEndpoint } from 'Constants'
import axios from 'axios'
import packageJSON from '../../../../../package.json'
import semver from 'semver'
import buildJSON from '../../../../../assets/build.json'
import RunningConfig from 'RunningConfig'

enum ChannelsMap {
	dev = 'devVersion',
	beta = 'betaVersion',
	stable = 'stableVersion',
}

function gravitonHasUpdate() {
	return new Promise((resolve, reject) => {
		if (RunningConfig.data.isBrowser) {
			resolve({
				res: false,
				version: packageJSON.version,
				channelBuild: buildJSON.channelBuild,
			})
		}

		axios({
			method: 'get',
			url: APIEndpoint,
		})
			.then(async function (response) {
				const ReleasesVersions = response.data.graviton
				let gravitonVersion = ReleasesVersions[ChannelsMap[buildJSON.channelBuild]]
				if (semver.gt(gravitonVersion, packageJSON.version)) {
					resolve({
						res: true,
						version: gravitonVersion,
						channelBuild: buildJSON.channelBuild,
					})
				} else {
					resolve({
						res: false,
						version: packageJSON.version,
						channelBuild: buildJSON.channelBuild,
					})
				}
			})
			.catch(err => {
				reject(err)
			})
	})
}

export default gravitonHasUpdate

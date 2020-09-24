import { APIPluginsEndpoint } from 'Constants'
import axios from 'axios'

function getList() {
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: APIPluginsEndpoint,
		})
			.then(async function (response) {
				resolve(response.data.plugins)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export default getList

import Endpoints from './api.endpoints.js'
import axios from 'axios'
import throwError from '../utils/throw.error'

function getPluginById(pluginId) {
	return new Promise((resolve, reject) => {
		if (!pluginId) {
			throwError('Cannot find this plugin in the Store.')
			return resolve({})
		}
		if (pluginId == 'arctic' || pluginId == 'night') {
			return resolve({})
		}
		axios({
			method: 'get',
			url: `${Endpoints.Search}/${pluginId}`,
		})
			.then(async function (response) {
				console.log(response)
				resolve(response.data.plugin || {})
			})
			.catch((a, b) => {
				throwError('Too many requests, wait.')
			})
	})
}

export default getPluginById

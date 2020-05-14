import Endpoints from './api.endpoints.js'
import axios from 'axios'
import throwError from '../utils/throw.error'

function notFoundError() {
	throwError('Cannot find this plugin in the Store.')
}

function getPluginById(pluginId) {
	return new Promise((resolve, reject) => {
		if (!pluginId) {
			notFoundError()
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
				resolve(response.data.plugin || {})
			})
			.catch(({ response }) => {
				const { status } = response
				if (status === 404) {
					//Throw not found error but still resolve
					notFoundError()
					return resolve({})
				}
				if (status === 429) {
					//Throw error 'too many request'
					return throwError('Too many requests, wait.')
				}
			})
	})
}

export default getPluginById

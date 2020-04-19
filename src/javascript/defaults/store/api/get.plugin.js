import Endpoints from './api.endpoints.js'
import axios from 'axios'
import throwError from '../utils/throw.error'

function getPluginById(pluginId){
	return new Promise((resolve,reject)=>{
		axios({
			method:'get',
			url:`${Endpoints.Search}/${pluginId}`
		}).then(async function (response) {
			resolve(response.data.plugin || {})
		}).catch((err)=>{
			throwError('Too many requests, wait.')
		})
	})
}

export default getPluginById
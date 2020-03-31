import Endpoints from './api.endpoints.js'
import axios from 'axios'

function getList(){
	return new Promise((resolve,reject)=>{
		axios({
			method:'get',
			url:Endpoints.List
		}).then(async function (response) {
			resolve(response.data.list)
		}).catch((err)=>{
			reject(err)
		})
	})
}

export default getList
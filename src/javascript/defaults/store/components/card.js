import { puffin } from '@mkenzo_8/puffin'
import { Titles , Card} from '@mkenzo_8/puffin-drac'
import Dialog from '../../../constructors/dialog'
import Notification from '../../../constructors/notification'
import Endpoints from '../api/api.endpoints.js'
import axios from 'axios'

const StoreCard = ()=>{
	return puffin.element(`
		<Card click="$clicked" class="${puffin.style.css`
			&{
				min-width:140px;
				max-width:140px;
				width:140px;
				height:100px;
			}
		`}">
			<H5>{{name}}</H5>
		</Card>
	`,{
		components:{
			Card,
			H5:Titles.h5
		},
		props:[
			{
				name:'name',
				value:'loading...'
			},
			"installed"
		],
		methods:{
			clicked(){
				const pluginName = this.getAttribute("name")
				const isInstalled = eval(this.getAttribute("isinstalled"))
				if( !isInstalled ){
					const installDialog = new Dialog({
						title:`Install ${pluginName} ?`,
						buttons:[
							{
								label:'Cancel'
							},
							{
								label:'Install',
								action: async function(){
									const pluginInfo = await getPlugin(pluginName)
									installPlugin(pluginInfo).then(()=>{
										new Notification({
											title:`${pluginName} has been installed.`
										})
									})
								}
							}
						]
					})
					installDialog.launch()
				}
			}
		}
	})
}

function getPlugin(pluginName){
	return new Promise((resolve,reject)=>{
		axios({
			method:'get',
			url:`${Endpoints.Search}/${pluginName}`
		}).then(async function (response) {
			resolve(response.data.plugin)
		}).catch((err)=>{
			console.log(err)
		})
	})
}

function installPlugin(plugin){
	return new Promise((resolve,reject)=>{
		const { ipcRenderer } = requirePath('electron')
		ipcRenderer.on('plugin-installed', (data)=>{
			resolve(data)
		})
		ipcRenderer.send('download-plugin', {
			url:plugin.lastRelease,
			name:plugin.name
		})
	})
}

export default StoreCard
import { puffin } from '@mkenzo_8/puffin'
import { Titles , Card, Button, Text } from '@mkenzo_8/puffin-drac'
import { LanguageState, getTranslation } from 'LanguageConfig'
import Window from '../../../constructors/window'
import Notification from '../../../constructors/notification'
import Endpoints from '../api/api.endpoints.js'
import axios from 'axios'
import SideMenu from '../../../components/window/side.menu'
import installPlugin from '../utils/install.plugin'
import uninstallPlugin from '../utils/uninstall.plugin'
import getPluginById from '../api/get.plugin'
import getLocalPluginById from '../utils/get.local.plugin'
import path from 'path'

const StoreCard = () => {
	return puffin.element(`
		<Card click="$clicked" class="${puffin.style.css`
			&{
				min-width:140px;
				max-width:140px;
				width:140px;
				height:100px;
			}
		`}">
			<H5>{{displayName}}</H5>
		</Card>
	`,{
		components:{
			Card,
			H5: Titles.h5
		},
		props:[
			{
				name:'displayName',
				value:'loading...'
			},
			'id',
			'installed'
		],
		methods:{
			clicked: async function(){
				const pluginId = this.getAttribute('id')
				const isInstalled = eval(this.getAttribute('isinstalled'))
				const pluginInfo = await getPluginById(pluginId) //Get Store's API info
				const pluginLocalInfo = getLocalPluginById(pluginId) //Get installed version info
				openWindow(pluginInfo,pluginLocalInfo,isInstalled)
			}
		}
	})
}

const pluginReserved = pluginName => pluginName == 'Arctic' ||  pluginName == 'Night'

function openWindow({
	name,
	lastRelease,
	version = 'Unknown',
	id,
	repository,
	author = 'Unknown'
},{
	name: localName,
	version: localVersion = 'Unknown',
	id: localId,
	author: localAuthor = 'Unknown'
}, isInstalled){
	
	const pluginInfo = arguments[0]
	const pluginLocalInfo = arguments[1]
	const pluginInfoValid = Object.assign( pluginInfo, pluginLocalInfo )
		
	const component = puffin.element(`
		<SideMenu default="about">
			<div>
				<H2>${ pluginInfoValid.name }</H2>
				<label to="about" lang-string="About"></label>
			</div>
			<div>
				<div href="about">
					<Text>
						<b>Made by: ${ pluginInfoValid.author }</b>
					</Text>
					<Text>Last version: ${ version }</Text>
					<Text>Installed version: ${ localVersion }</Text>
					${ isInstalled ? '' : ` <Button click="$install">Install</Button>` }
					${ !isInstalled || pluginReserved(pluginInfoValid.name) ? '' : `<Button click="$uninstall">Uninstall</Button>` }
				</div>
			</div>
		</SideMenu>
	`,{
		methods:{
			install(){
				installPlugin( pluginInfo ).then(()=>{
					pluginInstalledNotification( name )
				})
			},
			uninstall(){
				uninstallPlugin( pluginInfo ).then(()=>{
					pluginUninstalledNotification( name )
				})
			}
		},
		components:{
			H2: Titles.h2,
			Button,
			SideMenu,
			Text
		},
		addons:{
			lang:puffin.lang( LanguageState )
		}
	})
	const pluginWindow = new Window({
		component,
		height: '55%',
		width: '45%'
	})
	pluginWindow.launch()
}

function pluginInstalledNotification( pluginName ){
	new Notification({
		title:`Installed ${ pluginName }`
	})
}

function pluginUninstalledNotification( pluginName ){
	new Notification({
		title:`Uninstalled ${ pluginName }`
	})
}

export default StoreCard
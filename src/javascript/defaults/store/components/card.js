import { element, style } from '@mkenzo_8/puffin'
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
import installButton from './install.button'
import path from 'path'

function StoreCard(props){
	const { pluginId, displayName, isInstalled } = props.data
	return element({
		components:{
			Card,
			H5: Titles.h5
		}
	})`
		<Card :click="${clicked}" class="${style`
			&{
				min-width:140px;
				max-width:140px;
				width:140px;
				height:100px;
			}
		`}">
			<H5>${displayName}</H5>
		</Card>
	`
	async function clicked(){
		const pluginInfo = await getPluginById(pluginId) //Get Store's API info
		const pluginLocalInfo = getLocalPluginById(pluginId) //Get installed version info
		openWindow(pluginInfo,pluginLocalInfo,isInstalled)
	}
}

const pluginReserved = pluginName => pluginName == 'Arctic' ||  pluginName == 'Night'

const getPluginInfo = ( object, key) => {
	if( object[key] ){
		return object[key]
	}else{
		return 'Unknown'
	}
}

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
	
	const component = element({
		components:{
			H2: Titles.h2,
			SideMenu,
			Text
		}
	})`
		<SideMenu default="about">
			<div>
				<H2>${ getPluginInfo(pluginInfoValid,'name') }</H2>
				<label to="about" lang-string="About">About</label>
			</div>
			<div>
				<div href="about">
					<div style="overflow:auto; min-height:calc( 100% - 50px); max-height:calc( 100% - 50px)">
						<Text>
							<b>Made by: ${ getPluginInfo(pluginInfoValid,'author') }</b>
						</Text>
						<Text>Last version: ${ version }</Text>
						<Text>Installed version: ${ localVersion }</Text>
					</div>
					<div style="min-height:50px;">
						${ getInstallButton() }
						${ getUninstallButton() }
					</div>
				</div>
			</div>
		</SideMenu>
	`
	function getInstallButton(){
		if( !isInstalled ){
			return element({
				components:{
					installButton
				}
			})` <installButton :click="${install}">Install</installButton>`
		}
		return element`<p/>`
	}
	function getUninstallButton(){
		if( !isInstalled || pluginReserved(pluginInfoValid.name) ){
			return element`<p/>`
		}else{
			return element({
				components:{
					Button
				}
			})`<Button :click="${uninstall}">Uninstall</Button>`
		}
	}
	function install(){
		installPlugin( pluginInfo ).then(()=>{
			pluginInstalledNotification( name )
		})
	}
	function uninstall(){
		uninstallPlugin( pluginInfo ).then(()=>{
			pluginUninstalledNotification( name )
		})
	}
	const pluginWindow = new Window({
		component:()=>component,
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
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
import storeButton from './button'
import path from 'path'
import semver from 'semver'
import packageJSON from '../../../../../package.json'

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

function hasUpdate(pluginVersion, localPluginVersion){
	if( semver.valid(pluginVersion) && semver.valid(localPluginVersion) ){
		return semver.gt(pluginVersion, localPluginVersion)
	}
	return false
}

const styleWrapper = style`
	& .content {
		overflow: hidden;
	}
	& .content > div{
		overflow:auto; 
		min-height: calc( 100% - 100px);
	}
	& .content > .buttons{
		max-height: 140px;
		min-height: 50px;
	}
	& .content > .buttons *{
		min-height: 36px;
	}
`


function openWindow({
	name,
	lastRelease,
	version = 'Unknown',
	id,
	repository,
	author = 'Unknown',
	target = packageJSON.version
},{
	name: localName,
	version: localVersion = 'Unknown',
	id: localId,
	author: localAuthor = 'Unknown'
}, isInstalled){
	
	const pluginInfo = arguments[0]
	const pluginLocalInfo = arguments[1]
	const pluginInfoValid = Object.assign({}, pluginInfo, pluginLocalInfo )
	
	const newUpdate = hasUpdate(version,localVersion)
	
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
				<label to="about" lang-string="misc.About"/>
			</div>
			<div class="${styleWrapper}">
				<div href="about" class="content">
					<div>
						<Text>
							<b lang-string="misc.Author" string="{{misc.Author}}: ${ getPluginInfo(pluginInfoValid,'author') }"/>
						</Text>
						<Text lang-string="misc.LastVersion" string="{{misc.LastVersion}}: ${version}"/>
						<Text lang-string="misc.InstalledVersion" string="{{misc.InstalledVersion}}: ${localVersion}"/>
					</div>
					<div class="buttons">
						${ getUpdateButton() }
						${ getUninstallButton() || getInstallButton() || element`<div/>` }
					</div>
				</div>
			</div>
		</SideMenu>
	`
	function getUpdateButton(){
		if( newUpdate ){
			return element({
				components:{
					storeButton
				}
			})` <storeButton :click="${install}" lang-string="windows.Store.Update"/>`
		}
		return element`<div/>`
	}
	function getInstallButton(){
		if( !isInstalled && semver.gte(packageJSON.version,target) ){
			return element({
				components:{
					storeButton
				}
			})` <storeButton :click="${install}" lang-string="windows.Store.Install"/>`
		}
		return null
	}
	function getUninstallButton(){
		if( isInstalled && !pluginReserved(pluginInfoValid.name) ){
			return element({
				components:{
					storeButton
				}
			})`<storeButton :click="${uninstall}" lang-string="windows.Store.Uninstall"/>`
		}else{
			return null
		}
	}
	function update(){
		installPlugin( pluginInfoValid ).then(()=>{
			pluginUpdatedNotification( pluginInfoValid.name )
		})
	}
	function install(){
		installPlugin( pluginInfoValid ).then(()=>{
			pluginInstalledNotification( pluginInfoValid.name )
		})
	}
	function uninstall(){
		uninstallPlugin( pluginInfoValid ).then(()=>{
			pluginUninstalledNotification( pluginInfoValid.name )
		})
	}
	const pluginWindow = new Window({
		component: () => component,
		height: '55%',
		width: '45%'
	})
	pluginWindow.launch()
}

function pluginUpdatedNotification( pluginName ){
	new Notification({
		title: `Updated ${ pluginName }`
	})
}

function pluginInstalledNotification( pluginName ){
	new Notification({
		title: `Installed ${ pluginName }`
	})
}

function pluginUninstalledNotification( pluginName ){
	new Notification({
		title: `Uninstalled ${ pluginName }`
	})
}

export default StoreCard
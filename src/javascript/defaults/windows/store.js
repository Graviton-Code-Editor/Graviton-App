import { puffin } from '@mkenzo_8/puffin'
import { Titles , RadioGroup, Text, Button } from '@mkenzo_8/puffin-drac'
import { LanguageState, getTranslation } from 'LanguageConfig'
import Window from '../../constructors/window'
import StaticConfig from 'StaticConfig'
import PluginsRegistry from 'PluginsRegistry'
import SideMenu from '../../components/window/side.menu'
import getList from '../store/api/get.list'
import Languages from '../../../../languages/*.json'
import Card from '../store/components/card'
import Loader from '../../components/loader'
import CenteredLayout from '../../components/centered.layout'
import isPluginInstalled from '../store/utils/is.plugin.installed'

function Store(){
	const StorePage = puffin.element(`
		<SideMenu default="home">
			<div>
				<H1 lang-string="Store"></H1>
				<label to="home">Home</label>
				<label to="installed">Installed</label>
			</div>
			<div>
				<div class="home" href="home">
					<CenteredLayout>
						<Loader/>
					</CenteredLayout>
				</div>
				<div class="installed" href="installed"/>
			</div>
		</SideMenu>
	`,{
		components:{
			H1:Titles.h1,
			H4:Titles.h4,
			SideMenu,
			Text,
			Loader,
			CenteredLayout
		},
		events:{
			mounted(){
				const installedPage = this.getElementsByClassName('installed')[0]
				const homePage = this.getElementsByClassName('home')[0]
				
				displayHome( homePage ) //Display Home page by default
				
				installedPage.addEventListener('loaded',()=>{
					displayInstalled(installedPage)
				})
				
			}
		},
		addons:{
			lang:puffin.lang( LanguageState )
		}
	}) 
	const StoreWindow = new Window({
		title:'store',
		component:StorePage
	})
	return StoreWindow
}

function displayHome(container){
	const loader = new Promise(async( resolve, reject )=>{
		getList().then( list => {
			const cardsList =  list.map( pluginId =>{
				const isInstalled = isPluginInstalled( pluginId )
				return `<Card isInstalled="${ isInstalled }" id="${ pluginId }" displayName="${ pluginId }"/>`
			}).join('')
			resolve( cardsList )
		}).catch( err =>{
			resolve(`<p>An error ocurred, try later.</p>`)
		})
	})
	loader.then( content =>{
		const Home = puffin.element(`<div>${ content }</div>`,{
			components:{
				Card:Card()
			}
		})
		puffin.render( Home, container, {
			removeContent:true
		})
	})
}

function displayInstalled( container ){
	const list = PluginsRegistry.registry.data.list
	const Home = puffin.element(`
		<div>
			${Object.keys(list).map(function(pluginId){
				const pluginInfo = list[pluginId]
				return `
					<Card isInstalled="${true}" id="${pluginInfo.id}" displayName="${pluginInfo.name}"/>
				`
			}).join('')}
		</div>
	`,{
		components:{
			Card:Card()
		}
	})
	puffin.render( Home, container, {
		removeContent:true
	})
}

export default Store
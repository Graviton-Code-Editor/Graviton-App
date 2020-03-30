import { puffin } from '@mkenzo_8/puffin'
import Window from '../../constructors/window'
import { Titles , RadioGroup, Text, Button } from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'
import SideMenu from '../../components/window/side.menu'
import getList from '../store/api/get.list'
import Languages from '../../../../languages/*.json'
import { LanguageState, getTranslation } from 'LanguageConfig'
import Card from '../store/components/card'
import Loader from '../../components/loader'
import CenteredLayout from '../../components/centered.layout'

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
				<div class="installed" href="installed">
					
				</div>
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
				const installedPage = this.getElementsByClassName("installed")[0]
				const homePage = this.getElementsByClassName("home")[0]
				
				displayHome(homePage) //Display Home page by default
				
				installedPage.addEventListener('loaded',()=>{
					displayInstalled(installedPage)
				})
				
			}
		},
		addons:{
			lang:puffin.lang(LanguageState)
		}
	}) 
	const StoreWindow = new Window({
		title:'store',
		component:StorePage
	})
	return StoreWindow
}

function displayHome(container){
	const loader = new Promise(async(resolve,reject)=>{
		getList().then(list=>{
			const lol =  list.map((pluginName)=>{
				return `<Card isInstalled="${false}" name="${pluginName}"/>`
			}).join("")
			resolve(lol)
		})
	})
	loader.then((content)=>{
		const Home = puffin.element(`<div>${content}</div>`,{
			components:{
				Card:Card()
			}
		})
		puffin.render(Home,container,{
			removeContent:true
		})
	})
}

function displayInstalled(container){
	const list = ExtensionsRegistry.registry.data.list
	
	const Home = puffin.element(`
		<div>
			${Object.keys(list).map(function(extension){
				return `
					<Card isInstalled="${true}" name="${extension}"/>
				`
			})}
		</div>
	`,{
		components:{
			Card:Card()
		}
	})
	puffin.render(Home,container,{
		removeContent:true
	})
}

export default Store
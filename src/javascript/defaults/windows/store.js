import { element, style, render } from '@mkenzo_8/puffin'
import { Titles, RadioGroup, Text, Button } from '@mkenzo_8/puffin-drac'
import { LanguageState, getTranslation } from 'LanguageConfig'
import Window from '../../constructors/window'
import StaticConfig from 'StaticConfig'
import PluginsRegistry from 'PluginsRegistry'
import SideMenu from '../../components/window/side.menu'
import getList from '../store/api/get.list'
import Languages from '../../../../languages/*.json'
import StoreCard from '../store/components/card'
import Loader from '../../components/loader'
import CenteredLayout from '../../components/centered.layout'
import isPluginInstalled from '../store/utils/is.plugin.installed'

function Store() {
	const StorePage = element({
		components: {
			H1: Titles.h1,
			H4: Titles.h4,
			SideMenu,
			Text,
			Loader,
			CenteredLayout,
		},
	})`
		<div mounted="${mounted}" style="min-width:100%;">
			<SideMenu default="home" style="min-height:100%;">
				<div>
					<H1 lang-string="windows.Store.Store"/>
					<label to="home" lang-string="windows.Store.Home.Home"/>
					<label to="installed" lang-string="windows.Store.Installed.Installed"/>
				</div>
				<div>
					<div class="home" href="home">
						<CenteredLayout>
							<Loader/>
						</CenteredLayout>
					</div>
					<div class="installed" :loaded="${e => displayInstalled(e.target)}" href="installed"/>
				</div>
			</SideMenu>
		</div>
	`
	function mounted() {
		const homePage = this.getElementsByClassName('home')[0]
		displayHome(homePage) //Display Home page by default
	}
	const StoreWindow = new Window({
		title: 'store',
		component: () => StorePage,
	})
	return StoreWindow
}

function displayHome(container) {
	const loader = new Promise(async (resolve, reject) => {
		getList()
			.then(list => {
				const cardsList = list.map(({ id, name, description }) => {
					const isInstalled = isPluginInstalled(id)
					return element({
						components: {
							StoreCard,
						},
					})`<StoreCard data="${{
						isInstalled,
						pluginID: id,
						description,
						displayName: name,
					}}"/>`
				})
				resolve(cardsList)
			})
			.catch(err => {
				const errorComp = element`<p>An error ocurred, try later.</p>`
				resolve(errorComp)
			})
	})
	loader.then(contentComp => {
		const Home = element`<div>${contentComp}</div>`
		container.innerHTML = ''
		render(Home, container)
	})
}

function displayInstalled(container) {
	const list = PluginsRegistry.registry.data.list
	const Home = element`
		<div>
			${Object.keys(list).map(pluginId => {
				const pluginInfo = list[pluginId]
				const pluginData = {
					isInstalled: true,
					pluginID: pluginInfo.id,
					displayName: pluginInfo.name,
					description: pluginInfo.description,
				}
				return element({
					components: {
						StoreCard,
					},
				})`
					<StoreCard data="${pluginData}"/>
				`
			})}
		</div>
	`
	container.innerHTML = ''
	render(Home, container)
}

export default Store

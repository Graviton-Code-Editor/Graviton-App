import { element, style, render } from '@mkenzo_8/puffin'
import { Titles, RadioGroup, Text, Button } from '@mkenzo_8/puffin-drac'
import { LanguageState } from 'LanguageConfig'
import Window from 'Constructors/window'
import getList from '../api/get.list'
import Loader from '../../../components/loader'
import CenteredLayout from '../../../components/store/centered.layout'
import isPluginInstalled from '../utils/is.plugin.installed'
import StoreCard from '../../../components/store/card'

import { PuffinComponent } from 'Types/puffin.component'

export default function HomePage(): PuffinComponent {
	return element({
		components: {
			Loader,
			CenteredLayout,
		},
	})`
		<div mounted="${mounted}" class="home" href="home">
			<CenteredLayout>
				<Loader/>
			</CenteredLayout>
		</div>
	`
	function mounted() {
		displayHome(this)
	}
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

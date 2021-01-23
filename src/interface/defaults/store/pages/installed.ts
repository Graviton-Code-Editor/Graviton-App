import { element, style, render } from '@mkenzo_8/puffin'
import { Titles, RadioGroup, Text, Button } from '@mkenzo_8/puffin-drac'
import { LanguageState } from 'LanguageConfig'
import getList from '../api/get.list'
import StoreCard from '../../../components/store/card'
import PluginsRegistry from 'PluginsRegistry'
import * as path from 'path'

import { PuffinComponent } from 'Types/puffin.component'

export default function InstalledPage(): PuffinComponent {
	return element`
		<div class="installed" :loaded="${e => displayInstalled(e.target)}" href="installed"/>
	`
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
					icon: pluginInfo.icon ? path.join(pluginInfo.PATH, pluginInfo.icon) : null,
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

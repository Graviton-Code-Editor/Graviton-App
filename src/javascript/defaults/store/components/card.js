import { element, style } from '@mkenzo_8/puffin'
import { Titles, Card, Button, Text } from '@mkenzo_8/puffin-drac'
import { LanguageState, getTranslation } from 'LanguageConfig'
import getPluginById from '../api/get.plugin'
import getLocalPluginById from '../utils/get.local.plugin'
import pluginWindow from './window'

const CardStyle = style`
	&{
		min-width:160px;
		width:150px;
		height:90px;
		overflow: auto;
	}
	& h5 {
		margin: 3px;
	}
	& h5, & p {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 13px;
	}
`

function StoreCard(props) {
	const { pluginId, displayName, isInstalled, description = '' } = props.data
	return element({
		components: {
			Card,
			H5: Titles.h5,
			Text,
		},
	})`
		<Card :click="${clicked}" class="${CardStyle}">
			<H5>${displayName}</H5>
			<Text>${description}</Text>
		</Card>
	`
	async function clicked() {
		const pluginInfo = await getPluginById(pluginId) //Get Store's API info
		const pluginLocalInfo = getLocalPluginById(pluginId) //Get installed version info
		new pluginWindow(pluginInfo, pluginLocalInfo, isInstalled)
	}
}

export default StoreCard

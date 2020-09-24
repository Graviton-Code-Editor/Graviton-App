import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'
import { Titles, Card, Button, Text } from '@mkenzo_8/puffin-drac'
import { LanguageState, getTranslation } from 'LanguageConfig'
import getPluginById from '../../defaults/store/api/get.plugin'
import getLocalPluginById from '../../defaults/store/utils/get.local.plugin'
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

const pluginReserved = pluginID => pluginID === 'arctic-theme' || pluginID === 'night-theme' || pluginID === 'js-ts-langserver'

function StoreCard(props) {
	const { pluginID, displayName, isInstalled, description = '' } = props.data
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
		const isReserved = pluginReserved(pluginID)
		let pluginInfo = {}
		if (!isReserved) {
			//Prevent to search for Arctic and Night themes
			pluginInfo = await getPluginById(pluginID) //Get Store's API info
		}
		const pluginLocalInfo = getLocalPluginById(pluginID) //Get installed version info
		new pluginWindow(pluginInfo, pluginLocalInfo, isInstalled, isReserved)
	}
}

export default StoreCard

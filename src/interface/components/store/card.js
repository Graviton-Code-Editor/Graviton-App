import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import { Titles, Card, Button, Text } from '@mkenzo_8/puffin-drac'
import { LanguageState, getTranslation } from 'LanguageConfig'
import getPluginById from '../../defaults/store/api/get.plugin'
import getLocalPluginById from '../../defaults/store/utils/get.local.plugin'
import pluginWindow from './window'
import DefaultPluginIcon from '../icons/plugin_store'

const CardStyle = style`
	padding: 3px 11px !important;
	& > div {
		height: 85px;
		display: flex;
		align-items: center;
		min-width:160px;
		width:150px;
		height:90px;
		overflow: auto;
		& > div {
			flex: 1;
			max-width: calc(100% - 56px);
		}
	}
	& .plugin_icon {
		height: 50px;
		width: 50px;
		max-width: 50px;
		border-radius: 6px;
		box-shadow: 0px 2px 5px rgba(0,0,0,0.15);
		margin: 3px;
		background: var(--windowBackground);
		& > * {
			width: 20px;
			height: 20px;
		}
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

const pluginReserved = pluginID => pluginID === 'arctic-theme' || pluginID === 'night-theme' || pluginID === 'js-ts-langserver' || pluginID === 'graviton-iconpack'

function getPluginIcon(iconPath) {
	if (iconPath) {
		return () => element`
				<img src="${iconPath}"/>
			`
	} else {
		//Fallback icon
		return DefaultPluginIcon
	}
}

function StoreCard(props) {
	const { pluginID, displayName, isInstalled, description = '', icon } = props.data
	return element({
		components: {
			Card,
			H5: Titles.h5,
			Text,
			Icon: getPluginIcon(icon),
		},
	})`
		<Card :click="${clicked}" class="${CardStyle}">
			<div>
				<Icon class="plugin_icon"/>
				<div>
					<H5>${displayName}</H5>
					<Text>${description}</Text>
				</div>
			</div>
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

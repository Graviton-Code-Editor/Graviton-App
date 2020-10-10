import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'
import { Titles, Card, Text } from '@mkenzo_8/puffin-drac'
import PluginsRegistry from 'PluginsRegistry'
import path from 'path'

const getIconPath = (name, icon) => {
	const { PATH, icons } = PluginsRegistry.registry.data.list[name]
	return path.join(PATH, icons[icon].icon)
}

const styleWrapper = style`
	& div {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	& img {
		height: 20px;
	}
`

function IconpackCard({ info }) {
	return element({
		components: {
			Card,
			H3: Titles.h3,
			Text,
		},
	})`
	<Card class="${styleWrapper}">
		<H3>${info.name}</H3>
		<div>
			<img src="${getIconPath(info.name, 'folder')}"/>
			<img src="${getIconPath(info.name, 'js')}"/>
			<img src="${getIconPath(info.name, 'md')}"/>
		</div>
	</Card>`
}

export default IconpackCard

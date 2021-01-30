import PluginsRegistry from 'PluginsRegistry'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import ThemeCard from '../../../components/settings/theme.card'
import IconpackCard from '../../../components/settings/iconpack.card'

export default function () {
	const pluginsList = PluginsRegistry.registry.data.list

	return {
		customization: [
			{
				type: 'title',
				label: 'windows.Settings.Customization.Themes',
			},
			{
				type: 'radioGroup',
				styled: false,
				key: 'appTheme',
				direction: 'horizontally',
				translated: false,
				radios: Object.keys(pluginsList)
					.map(plugin => {
						const pluginInfo = pluginsList[plugin]
						if (pluginInfo.type === 'theme') {
							return {
								styled: false,
								component: () => ThemeCard({ info: pluginInfo }),
								hiddenRadio: true,
								key: plugin,
								checked: StaticConfig.data.appTheme == plugin,
							}
						}
					})
					.filter(Boolean),
			},
			{
				type: 'title',
				label: 'windows.Settings.Customization.Iconpacks',
			},
			{
				type: 'radioGroup',
				styled: false,
				key: 'appIconpack',
				direction: 'horizontally',
				translated: false,
				radios: Object.keys(pluginsList)
					.map(plugin => {
						const pluginInfo = pluginsList[plugin]
						if (pluginInfo.type === 'iconpack') {
							return {
								styled: false,
								component: () => IconpackCard({ info: pluginInfo }),
								hiddenRadio: true,
								key: plugin,
								checked: StaticConfig.data.appIconpack == plugin,
							}
						}
					})
					.filter(Boolean),
			},
			{
				type: 'title',
				label: 'misc.Miscellaneous',
				disabled: RunningConfig.data.isBrowser,
			},
			{
				type: 'section',
				disabled: RunningConfig.data.isBrowser,
				content: [
					{
						type: 'slider',
						label: 'menus.Window.Zoom.Zoom',
						key: 'appZoom',
						min: 0.7,
						max: 2,
						default: StaticConfig.data.appZoom,
						disabled: RunningConfig.data.isBrowser,
					},
					{
						type: 'slider',
						label: 'windows.Settings.Customization.Blur',
						key: 'appBlurEffect',
						min: 0,
						max: 15,
						default: StaticConfig.data.appBlurEffect,
					},
				],
			},
		],
	}
}

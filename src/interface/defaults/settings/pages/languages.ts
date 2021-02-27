import Languages from '../../../collections/languages'
import StaticConfig from 'StaticConfig'

export default function () {
	return {
		languages: [
			{
				type: 'radioGroup',
				key: 'appLanguage',
				liveUpdate: true,
				radios: Object.keys(Languages).map(lang => {
					const label = Languages[lang].name
					return {
						label,
						key: lang,
						checked: StaticConfig.data.appLanguage === lang,
					}
				}),
			},
			{
				type: 'section',
				content: [
					{
						type: 'title',
						key: 'appUseSystemLanguage',
						label: 'windows.Settings.Settings',
					},
					{
						type: 'switch',
						key: 'appUseSystemLanguage',
						label: 'windows.Settings.Languages.UseSystemLanguage',
						liveUpdate: true,
					},
				],
			},
		],
	}
}

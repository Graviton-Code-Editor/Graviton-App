import Languages from '../../../collections/languages'
import StaticConfig from 'StaticConfig'

export default function () {
	return {
		languages: [
			{
				type: 'radioGroup',
				key: 'appLanguage',
				radios: Object.keys(Languages).map(lang => {
					const label = Languages[lang].name
					return {
						label,
						key: lang,
						checked: StaticConfig.data.appLanguage === lang,
					}
				}),
			},
		],
	}
}

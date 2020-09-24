import { element } from '@mkenzo_8/puffin'
import { RadioGroup } from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'
import Languages from '../../../collections/languages'

import { PuffinComponent } from 'Types/puffin.component'

export default function LanguagesPage({ closeWindow }): PuffinComponent {
	return element({
		components: {
			RadioGroup,
		},
	})`
		<div href="languages">
			<div href="languages">
				<RadioGroup :radioSelected="${selectedLanguage}">
					${Object.keys(Languages).map(lang => {
						const languageName = Languages[lang].name
						return element`
							<label name="${lang}" checked="${StaticConfig.data.appLanguage === lang}">${languageName}</label>
						`
					})}
				</RadioGroup>
			</div>
		</div>
	`
}

function selectedLanguage(e): any {
	const newLanguage = e.detail.target.getAttribute('name')
	if (StaticConfig.data.appLanguage != newLanguage) StaticConfig.data.appLanguage = newLanguage
}

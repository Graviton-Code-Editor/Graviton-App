import { element, lang } from '@mkenzo_8/puffin'
import { Titles, Text, RadioGroup } from '@mkenzo_8/puffin-drac'
import IntroductionPage from '../../../components/introduction/slider_page'
import { LanguageState } from 'LanguageConfig'
import Languages from '../../../collections/languages'
import StaticConfig from 'StaticConfig'

export default function LanguagesPage() {
	const languagesOptions = Object.keys(Languages).map(lang => {
		const label = Languages[lang].name
		return {
			label,
			key: lang,
			checked: StaticConfig.data.appLanguage === lang,
		}
	})

	function onSelected(e) {
		const languageSelected = e.detail.key
		StaticConfig.data.appLanguage = languageSelected
	}

	return element({
		addons: [lang(LanguageState)],
		components: {
			Title: Titles.h2,
			Text,
			IntroductionPage,
			RadioGroup,
		},
	})`
		<IntroductionPage>
			<Title class="title" lang-string="misc.Languages"/>
			<div style="overflow: auto; width: 90%;">
				<RadioGroup :radioSelected="${onSelected} translated="${true}" options="${languagesOptions}"/>
			</div>
		</IntroductionPage>
	`
}

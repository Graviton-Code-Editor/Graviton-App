import { element, render, lang } from '@mkenzo_8/puffin'
import { Titles, Text } from '@mkenzo_8/puffin-drac'
import { css as style } from '@emotion/css'
import Link from '../../../components/link'
import IntroductionPage from '../../../components/introduction/slider_page'
import { LanguageState } from 'LanguageConfig'

export default function Finished() {
	return element({
		addons: [lang(LanguageState)],
		components: {
			Title: Titles.h2,
			Text,
			IntroductionPage,
		},
	})`
		<IntroductionPage>
			<Title class="title" lang-string="windows.Introduction.Finished.Finished" string="{{windows.Introduction.Finished.Finished}} 🎉"/>
			<Text lang-string="windows.Introduction.Finished.HaveAGreatExperience"/>
		</IntroductionPage>
	`
}

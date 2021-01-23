import { element, render, lang } from '@mkenzo_8/puffin'
import { Titles, Text, Button } from '@mkenzo_8/puffin-drac'
import { css as style } from '@emotion/css'
import Link from '../../../components/link'
import IntroductionPage from '../../../components/introduction/slider_page'
import { LanguageState } from 'LanguageConfig'

export default function Welcome() {
	return element({
		addons: [lang(LanguageState)],
		components: {
			Title: Titles.h2,
			Text,
			Link,
			IntroductionPage,
		},
	})`
		<IntroductionPage>
			<Title class="title" lang-string="windows.Introduction.Welcome.WelcomeToGraviton" string="{{windows.Introduction.Welcome.WelcomeToGraviton}} 🎉" />
			<Text lang-string="windows.Settings.About.GravitonDescription"/>
			<table>
				<tr>
					<td><Link to="https://graviton.netlify.app" lang-string="menus.Help.Website"/></td>
					<td><Link to="https://graviton.netlify.app/docs" lang-string="menus.Help.Documentation"/></td>
				</tr>
				<tr>
					<td>
						<Link to="https://discord.com/invite/gg6CTYA">Discord</Link>
					</td>
					<td>
						<Link to="https://t.me/gravitongroup">Telegram</Link>
					</td>
				</tr>
			</table>
		</IntroductionPage>
	`
}

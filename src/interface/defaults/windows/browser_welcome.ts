import { element } from '@mkenzo_8/puffin'
import { Titles, Text, Button } from '@mkenzo_8/puffin-drac'
import SideMenu from '../../components/window/side_menu'
import Window from '../../constructors/window'
import { css as style } from '@emotion/css'
import { WindowInstance } from 'Types/window'

const styleWrapper = style`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	& h2 {
		margin-bottom: 30px;
	}
	& p{
		margin: 0 40px;
	}
	& button {
		margin-top: 20px;
	}
`

export default function BrowserWelcome(): WindowInstance {
	const BrowserWelcomePage = element({
		components: {
			H2: Titles.h2,
			Text: Text,
			Button,
		},
	})`
		<div class="${styleWrapper}">
			<div>
				<H2 lang-string="windows.BrowserWelcome.WelcomeTitle"/>
				<Text lang-string="windows.BrowserWelcome.WelcomeMessage"/>
				<Button lang-string="misc.Understood" :click="${() => BrowserWelcomeWindow.close()}"/>
			</div>
		</div>
    `

	const BrowserWelcomeWindow = new Window({
		title: 'browser_welcome',
		component: () => BrowserWelcomePage,
		height: '400px',
		width: '600px',
	})
	return BrowserWelcomeWindow
}

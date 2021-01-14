import { element, render, lang } from '@mkenzo_8/puffin'
import { Titles, Text } from '@mkenzo_8/puffin-drac'
import { css as style } from '@emotion/css'
import Window from '../../constructors/window'
import PagesSlider from '../../components/window/pages_container'

import WelcomePage from '../introduction/pages/welcome'
import ThemingPage from '../introduction/pages/theming'
import FinishedPage from '../introduction/pages/finished'

export default function Introduction() {
	const IntroductionWindow = new Window({
		title: 'introduction',
		component: IntroductionPage,
		height: '400px',
		width: '550px',
	})

	function IntroductionPage() {
		return PagesSlider({
			pages: [WelcomePage, ThemingPage, FinishedPage],
			closeWindow: () => IntroductionWindow.close(),
		})
	}
	return IntroductionWindow
}

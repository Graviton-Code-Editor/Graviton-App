import { element } from '@mkenzo_8/puffin'
import { Titles, Text } from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'

import { PuffinComponent } from 'Types/puffin.component'

export default function AboutPage({ closeWindow }): PuffinComponent {
	return element({
		components: {
			H4: Titles.h4,
			Text,
		},
	})`
		<div href="about">
			<div href="about">
				<H4 lang-string="windows.Settings.About.About"/>
				<Text lang-string="windows.Settings.About.GravitonDescription"/>
			</div>
		</div>
	`
}

import { element } from '@mkenzo_8/puffin'
import { Titles, Text, Button } from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'
const { openExternal: openLink } = window.require('electron').shell

import { PuffinComponent } from 'Types/puffin.component'

export default function AboutPage({ closeWindow }): PuffinComponent {
	return element({
		components: {
			H3: Titles.h3,
			H4: Titles.h4,
			Text,
		},
	})`
		<div href="about">
			<div href="about">
				<H3 lang-string="windows.Settings.About.About"/>
				<Text lang-string="windows.Settings.About.GravitonDescription"/>
				<Text><a href="#":click="${openDocs}">Documentation</a></Text>
			</div>
		</div>
	`
}

function openDocs() {
	openLink('https://graviton.netlify.app')
}

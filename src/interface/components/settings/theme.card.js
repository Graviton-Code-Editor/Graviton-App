import { element } from '@mkenzo_8/puffin'
import { Titles, Card, Text } from '@mkenzo_8/puffin-drac'
import { ThemeProvider, getProperty } from 'ThemeProvider'

function ThemeCard({ info }) {
	return element({
		components: {
			Card,
			H3: Titles.h3,
			Text,
		},
	})`
	<Card>
		<H3 style="margin-left: 0; font-size: 15px;">${info.name}</H3>
		<Text style="margin: 0px;">Author: ${info.author}</Text>
		<svg height="50" width="50">
			<circle cx="15" cy="25" stroke-width="2" stroke="${getProperty('textColor', info.colorsScheme)}" fill="${getProperty('accentColor', info.colorsScheme)}" r="10"></circle>
			<circle cx="25" cy="25" stroke-width="2" stroke="${getProperty('textColor', info.colorsScheme)}" fill="${getProperty('bodyBackground', info.colorsScheme)}" r="10"></circle>
			<circle cx="35" cy="25" stroke-width="2" stroke="${getProperty('textColor', info.colorsScheme)}" fill="${getProperty('panelBorder', info.colorsScheme)}" r="10"></circle>
		</svg>
	</Card>`
}

export default ThemeCard

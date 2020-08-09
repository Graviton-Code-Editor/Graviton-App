import { element } from '@mkenzo_8/puffin'
import { Titles, Card, Text } from '@mkenzo_8/puffin-drac'
import { ThemeProvider, getProperty } from 'ThemeProvider'

function ThemeCard({ themeInfo }) {
	return element({
		components: {
			Card,
			H3: Titles.h3,
			Text,
		},
	})`
	<Card>
		<H3 style="margin-left: 0;">${themeInfo.name}</H3>
		<Text>Author: ${themeInfo.author}</Text>
		<svg height="50" width="50">
			<circle cx="15" cy="25" stroke-width="2" stroke="${getProperty('textColor', themeInfo.colorsScheme)}" fill="${getProperty('accentColor', themeInfo.colorsScheme)}" r="10"></circle>
			<circle cx="25" cy="25" stroke-width="2" stroke="${getProperty('textColor', themeInfo.colorsScheme)}" fill="${getProperty('bodyBackground', themeInfo.colorsScheme)}" r="10"></circle>
			<circle cx="35" cy="25" stroke-width="2" stroke="${getProperty('textColor', themeInfo.colorsScheme)}" fill="${getProperty('panelBorder', themeInfo.colorsScheme)}" r="10"></circle>
		</svg>
	</Card>`
}

export default ThemeCard

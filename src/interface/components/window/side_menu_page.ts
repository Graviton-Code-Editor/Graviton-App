import { element, render, lang } from '@mkenzo_8/puffin'
import { LanguageState } from 'LanguageConfig'

export default function SideMenuPage({ component }) {
	function renderPage() {
		if (this.children.length === 0) {
			render(
				element({
					addons: [lang(LanguageState)],
				})`<div>${component()}</div>`,
				this,
			)
		}
	}

	return element`<div :loaded="${renderPage}"/>`
}

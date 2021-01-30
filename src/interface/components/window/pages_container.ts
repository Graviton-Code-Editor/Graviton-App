import { element, render, lang } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import { Button } from '@mkenzo_8/puffin-drac'
import { LanguageState } from 'LanguageConfig'

const styleWrapper = style`
	& {
		width: 100%;
		display: flex;
		padding: 20px;
		flex-direction: column;
		& > div {
			width: 100%;
		}
	}
	& .pages {
		flex: 1;
		overflow: auto;
		& > div {
			width: 100%;
			height: 100%;
		}
	}
	& .navbar {
		padding: 8px;
		height: 34px;
		& > .go_back {
			position: absolute;
			left: 20px;
		}
		& > .go_next {
			position: absolute;
			right: 20px;
		}
}
`

export default function PagesSlider({ pages, closeWindow }) {
	let index = 0

	const next = function () {
		index++
		this.parentElement.parentElement.children[0].update()
		this.parentElement.update()
	}

	const back = function () {
		index--
		this.parentElement.parentElement.children[0].update()
		this.parentElement.update()
	}

	return element({
		addons: [lang(LanguageState)],
		components: {
			Button,
		},
	})`
	<div class="${styleWrapper}">
		<div class="pages">
			${() => pages[index]()}
		</div>
		<div class="navbar">
			${() => {
				let buttons = []
				if (index > 0) {
					buttons.push(
						element({
							components: {
								Button,
							},
						})`<Button :click="${back}" class="go_back" lang-string="misc.Back"/>`,
					)
				}
				if (index < pages.length - 1) {
					buttons.push(
						element({
							components: {
								Button,
							},
						})`<Button :click="${next}" class="go_next" lang-string="misc.Next" />`,
					)
				} else {
					buttons.push(
						element({
							components: {
								Button,
							},
						})`<Button :click="${closeWindow}" class="go_next" lang-string="misc.Okay"/>`,
					)
				}
				return buttons
			}}
		</div>
	</div>
	`
}

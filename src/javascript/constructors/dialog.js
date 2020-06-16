import DialogBody from '../components/dialog/dialog'
import WindowBackground from '../components/window/background'
import { element, style, render, lang } from '@mkenzo_8/puffin'
import { Text, Titles, Button } from '@mkenzo_8/puffin-drac'
import Window from './window'
import { LanguageState } from '../utils/lang.config'

function Dialog({ title = '', content, component, buttons = [], height = '200px', width = '300px' }) {
	const computedMethods = {
		...buttons.map(btn => {
			if (btn.action) {
				return btn.action
			} else {
				return function () {
					dialogWindow.close()
				}
			}
		}),
	}
	const DialogComp = element({
		components: {
			DialogBody,
			WindowBackground,
			H2: Titles.h2,
			Text,
		},
		addons: [lang(LanguageState)],
	})`
		<DialogBody>
			<div>
				<H2>${title}</H2>
				<Text>${content ? content : component()}</Text>
			</div>
			<div>
				${buttons.map((btn, index) => {
					return element({
						components: {
							Button,
						},
					})`<Button important="${btn.important || false}" index="${index}" :click="${closeWindow}" lang-string="${btn.label}"/>`
				})}
			</div>
		</DialogBody>
	`
	function closeWindow() {
		const buttonIndex = Number(this.props.index)
		computedMethods[buttonIndex]()
		dialogWindow.close()
	}
	const dialogWindow = new Window({
		component: () => DialogComp,
		height,
		width,
	})
	return {
		launch: () => dialogWindow.launch(),
		close: () => dialogWindow.close(),
	}
}

export default Dialog

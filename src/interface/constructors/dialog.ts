import { element } from '@mkenzo_8/puffin'
import { Text, Titles, Button } from '@mkenzo_8/puffin-drac'
import { LanguageState } from 'LanguageConfig'
import Window from './window'
import DialogBody from '../components/dialog/dialog'

import { DialogOptions, DialogButton } from '../types/dialog'
import { WindowInstance } from '../types/window'
import { PuffinState, PuffinEventInstance } from 'Types/puffin.state'

class Dialog {
	private WindowInstance: WindowInstance
	private DialogComponent: object
	constructor({ title = '', content, component, buttons = [], height = '200px', width = '300px', id = '' }: DialogOptions) {
		this.DialogComponent = element({
			components: {
				DialogBody,
				H2: Titles.h2,
				Text,
			},
		})`
			<DialogBody>
				<div>
					<H2 lang-string="${title}"/>
					<Text isComponent="${!!component}" lang-string="${content || ''}">${content ? '' : component()}</Text>
				</div>
				<div>
					${buttons.map((btn, index) => {
						return element({
							components: {
								Button,
							},
						})`<Button important="${btn.important || false}" index="${index}" :click="${() => this.closeFromButton.bind(this)(btn.action)}" lang-string="${btn.label}"/>`
					})}
				</div>
			</DialogBody>
		`
		this.WindowInstance = new Window({
			id,
			component: () => this.DialogComponent,
			height,
			width,
		})
	}
	public on(event: any, callback: () => void): PuffinEventInstance {
		return this.WindowInstance.on(event, callback)
	}
	public launch(): any {
		this.WindowInstance.launch()
	}
	public close(): any {
		this.WindowInstance.close()
	}
	private closeFromButton(buttonAction: () => void): any {
		if (buttonAction) buttonAction()
		this.close()
	}
}

export default Dialog

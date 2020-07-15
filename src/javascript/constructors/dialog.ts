import { element } from '@mkenzo_8/puffin'
import { Text, Titles, Button } from '@mkenzo_8/puffin-drac'
import { LanguageState } from '../utils/lang.config'

import Window from './window'
import DialogBody from '../components/dialog/dialog'

import { DialogOptions } from '../types/dialog'
import { WindowInstance } from '../types/window'

class Dialog {
	private WindowInstance: WindowInstance;
	private DialogComponent: object;
	private ButtonsActions: object[];
	constructor({ 
		title = '', 
		content,
		component, 
		buttons = [], 
		height = '200px', 
		width = '300px', 
		id = '' 
	}: DialogOptions){
		this.ButtonsActions = {
			...buttons.map(btn => {
				if (btn.action) {
					return btn.action
				} else {
					return function () {
						this.WindowInstance.close()
					}
				}
			}),
		}
		this.DialogComponent = element({
			components: {
				DialogBody,
				H2: Titles.h2,
				Text,
			}
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
						})`<Button important="${btn.important || false}" index="${index}" :click="${() => this.close(btn.action)}" lang-string="${btn.label}"/>`
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
	public launch() {
		this.WindowInstance.launch()
	}
	private closeWindow(){
		this.WindowInstance.close()
	}
	public close(buttonAction) {
		buttonAction()
		this.closeWindow()
	}
}

export default Dialog

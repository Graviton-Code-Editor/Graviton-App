import { element } from '@mkenzo_8/puffin'
import Dialog from '../../constructors/dialog'
import { Input, TextArea } from '@mkenzo_8/puffin-drac'

/*
 * This Dialog provides a easy way to ask something to the user.
 */

function InputDialog({ title, placeHolder = '', type = 'input' }): Promise<string> {
	return new Promise((resolve, reject) => {
		const randomSelector = Math.random()
		function onEnter(e) {
			if (e.keyCode === 13) {
				e.preventDefault()
				const inputValue = this.value
				if (inputValue != '') {
					resolve(inputValue)
				} else {
					reject()
				}
				DialogInstance.close()
			}
		}
		function inputMounted() {
			setTimeout(() => this.focus(), 1)
		}

		let inputComponent

		switch (type) {
			case 'input':
				inputComponent = Input
				break
			case 'textarea':
				inputComponent = TextArea
				break
		}

		const component = () => element({
			components: {
				inputComponent,
			},
		})`
			<div id="${randomSelector}">
				<inputComponent mounted="${inputMounted}" placeHolder="${placeHolder}" :keyup="${onEnter}"/>
			</div>
		`
		const DialogInstance = new Dialog({
			title,
			component,
			buttons: [
				{
					label: 'misc.Continue',
					action() {
						const inputValue: string = (document.getElementById(randomSelector.toString()).children[0] as HTMLInputElement).value
						if (inputValue != '') {
							resolve(inputValue)
						} else {
							reject()
						}
					},
				},
			],
		})
		DialogInstance.launch()
	})
}

export default InputDialog

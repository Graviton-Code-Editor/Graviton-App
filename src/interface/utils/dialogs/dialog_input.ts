import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import Dialog from '../../constructors/dialog'
import { Input, TextArea, Text } from '@mkenzo_8/puffin-drac'
import InputDialogOptions from 'Types/input_dialog'

const customStyle = style`
	& textarea {
		resize: none;
		width: calc(100% - 10px);
		height: 100px;
	}
	& p {
		font-size: 13px;
	}
	& input {
		margin-left: 8px;
	}
`

/*
 * This Dialog provides a easy way to ask something to the user.
 */

function InputDialog({ title, placeHolder = '', type = 'input', content }: InputDialogOptions): Promise<string> {
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
			<div  class="${customStyle}" >
				${
					content
						? element({
								components: {
									Text,
								},
						  })`<Text>${content}</Text>`
						: ''
				}
				<inputComponent id="${randomSelector}" mounted="${inputMounted}" placeHolder="${placeHolder}" :keyup="${onEnter}"/>
			</div>
		`
		const DialogInstance = new Dialog({
			title,
			component,
			height: type === 'textarea' ? '250px' : '200px',
			buttons: [
				{
					label: 'misc.Continue',
					action() {
						const inputValue: string = (document.getElementById(randomSelector.toString()) as HTMLInputElement).value
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

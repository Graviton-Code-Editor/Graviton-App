import { element } from '@mkenzo_8/puffin'
import Dialog from './dialog'
import { Input } from '@mkenzo_8/puffin-drac'

function InputDialog({ title, placeHolder = '' }) {
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
		const component = () => element({
			components: {
				Input,
			},
		})`
			<div id="${randomSelector}">
				<Input autofocus="true" placeHolder="${placeHolder}" :keyup="${onEnter}"/>
			</div>
		`
		const DialogInstance = new Dialog({
			title,
			component,
			buttons: [
				{
					label: 'misc.Continue',
					action() {
						const inputValue = document.getElementById(randomSelector).children[0].value
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

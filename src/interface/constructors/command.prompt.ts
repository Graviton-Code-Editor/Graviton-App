import { state, render, element } from '@mkenzo_8/puffin'
import CommandPromptBody from '../components/command.prompt/command.prompt'
import WindowBackground from '../components/window/background'

import { PuffinState } from 'Types/puffin.state'
import { CommandPromptOptions, CommandPromptOption } from 'Types/command.prompt'

class CommandPrompt {
	private CPCompletedEvent: (x) => void
	private CPSelectedEvent: (a, b) => void
	private CPScrolledEvent: (a, b) => void
	private CPWritingEvent: (a, b) => void
	private CPTabPressedEvent: (a, b) => void
	private CPCloseOnTab: boolean
	private CPState: PuffinState
	private CPOptions: CommandPromptOption[]
	private CPOptionsElement: HTMLElement
	private CPInputValue: String
	private CPDefaultOption: number
	private CPElement: HTMLElement

	constructor({
		name = Math.random(),
		showInput = true,
		inputPlaceHolder = '',
		inputDefaultText = '',
		options = [],
		scrollOnTab = false,
		closeOnTab = true,
		closeOnKeyUp = false,
		onCompleted = x => {},
		onSelected = x => {},
		onScrolled = x => {},
		onWriting = (a, b) => {},
		onTabPressed = (a, b) => {},
		defaultOption = 0,
	}: CommandPromptOptions) {
		const finalName = `${name}_cp`
		if (document.getElementById(finalName)) return // Check if there are any command prompts already opened

		const self = this

		this.CPCompletedEvent = onCompleted
		this.CPSelectedEvent = onSelected
		this.CPScrolledEvent = onScrolled
		this.CPWritingEvent = onWriting
		this.CPTabPressedEvent = onTabPressed
		this.CPState = new state({
			hoveredOption: null,
		})
		this.CPCloseOnTab = closeOnTab
		this.CPOptions = options
		this.CPInputValue = ''
		this.CPDefaultOption = defaultOption

		const CommandPromptComponent = element({
			components: {
				CommandPromptBody,
				WindowBackground,
			},
		})`
		<CommandPromptBody mounted="${mounted}" id="${finalName}" :keydown="${scrolling}">
			<WindowBackground window="${finalName}" closeWindow="${() => this.closeCP()}"/>
			<div class="container">
				<input value="${inputDefaultText}" style="${showInput ? '' : 'opacity:0; height:1px; margin:0;padding:0; border:0px;'}" placeHolder="${inputPlaceHolder}" :keydown="${keydown}" :keyup="${writing}"/>
				<div/>
			</div>
		</CommandPromptBody>
		`
		function keydown(e: KeyboardEvent) {
			switch (e.key) {
				case 'ArrowUp':
					e.preventDefault()
			}
		}

		function writing(e: KeyboardEvent) {
			e.preventDefault()
			const command = this.value
			self.CPInputValue = command
			switch (e.keyCode) {
				case 9:
					self.CPTabPressedEvent(
						{
							value: command,
							option: self.CPState.data.hoveredOption.lastChild.textContent,
						},
						self._hooks(),
					)

					if (scrollOnTab) {
						break
					}
					if (self.CPCloseOnTab) {
						self._selectOption(self.CPState.data.hoveredOption)
						self.closeCP()
					}

				case 17:
					if (!scrollOnTab) {
						break
					}
				case 13:
					self._selectOption(self.CPState.data.hoveredOption)
					self.closeCP()
					break

				case 27:
				case 38:
				case 40:
					self._focusInput()
					break
				default:
					self._renderOptions(filterOptions(this.value, options))
					self.CPWritingEvent(
						{
							value: command,
						},
						self._hooks(),
					)
			}
		}
		function scrolling(e: KeyboardEvent) {
			switch (e.keyCode) {
				case 38:
					self._scrollOptions('up')
					break
				case 9:
					e.preventDefault()
					if (!scrollOnTab) {
						break
					}
				case 40:
					self._scrollOptions('down')
					break
			}
		}
		function mounted() {
			self.CPElement = this
			const container = this.children[1].children[1]
			self.CPOptionsElement = container
			self._renderOptions(self.CPOptions)

			window.addEventListener('keydown', e => {
				//Close command prompt  when pressing ESC
				if (e.keyCode === 27) {
					self.closeCP()
				}
			})

			self._focusInput()
		}
		render(CommandPromptComponent, document.getElementById('windows'))
	}

	private _selectOption(option) {
		if (option) {
			const optionObj = findOptionAction(this.CPOptions, option)
			if (optionObj.action) optionObj.action()
			if (this.CPSelectedEvent)
				this.CPSelectedEvent(
					{
						label: option.lastChild.textContent,
						data: option.props.data,
					},
					this._hooks(),
				)
		}
		if (this.CPCompletedEvent) this.CPCompletedEvent(this.CPInputValue)
	}
	/*
	 * Focus input
	 */
	private _focusInput() {
		const input: any = this.CPElement.children[1].children[0]
		input.blur()

		setTimeout(() => {
			input.selectionStart = input.selectionEnd = input.value.length
			input.focus()
		}, 1)
	}
	/*
	/* Hooks to be used in events like onWritting, or onScrolling
	*/
	private _hooks() {
		return {
			setOptions: (options: CommandPromptOption[]) => {
				this.CPOptions = options
				this._renderOptions(options)
			},
			setValue: (value: string) => {
				this.CPInputValue = value
				const input: any = this.CPElement.children[1].children[0]
				input.value = value

				this._focusInput()
			},
			refreshOptions: () => {
				const input: any = this.CPElement.children[1].children[0]

				this._renderOptions(filterOptions(input.value, this.CPOptions))
			},
		}
	}
	/*
	 * Render options to the command prompt list
	 */
	private _renderOptions(options) {
		const self = this
		let hoveredDefault = this.CPDefaultOption

		const optionsComp = element`
			<div>
				${options.map(({ selected, label, data, icon }, index) => {
					if (selected) hoveredDefault = index
					return element`<a :click="${onClicked}" data="${data}">
						${icon ? element`<img src="${icon}"/>` : ''} 
						<span>${label}</span>
					</a> `
				})}
			</div>
		`
		function onClicked() {
			self.closeCP()
			self._selectOption(this)
		}
		this.CPOptionsElement.innerHTML = ''
		render(optionsComp, this.CPOptionsElement)
		this.CPState.data.hoveredOption = this.CPOptionsElement.children[0].children[hoveredDefault]
		this._hoverOption(this.CPState.data.hoveredOption)
	}
	/*
	 * Select X option
	 */
	private _hoverOption(hoveredOption) {
		if (!hoveredOption) return
		const allOptions = [...hoveredOption.parentElement.children]
		allOptions.forEach(option => {
			if (option === hoveredOption) {
				option.classList.add('active')
				this.CPScrolledEvent(
					{
						label: option.lastChild.textContent,
						data: option.props.data,
					},
					this._hooks(),
				)
			} else {
				option.classList.remove('active')
			}
		})
	}
	/*
	 * Scroll 1 option down / up
	 */
	private _scrollOptions(scrollingDirection) {
		const hoveredOption = this.CPState.data.hoveredOption
		const allOptions = [...hoveredOption.parentElement.children]
		const hoveredOptionPosition = allOptions.indexOf(hoveredOption)
		if (scrollingDirection === 'up') {
			if (hoveredOptionPosition !== 0) {
				this.CPState.data.hoveredOption = allOptions[hoveredOptionPosition - 1]
			} else {
				this.CPState.data.hoveredOption = allOptions[allOptions.length - 1]
			}
		} else if (scrollingDirection === 'down') {
			if (hoveredOptionPosition !== allOptions.length - 1) {
				this.CPState.data.hoveredOption = allOptions[hoveredOptionPosition + 1]
			} else {
				this.CPState.data.hoveredOption = allOptions[0]
			}
		}
		this._hoverOption(this.CPState.data.hoveredOption)
	}
	/*
	 * Close the command prompt
	 */
	private closeCP() {
		if (this.CPElement) this.CPElement.remove()
	}
}

function filterOptions(search: string, options: CommandPromptOption[]) {
	return options
		.map(function (option) {
			if (option.label.match(new RegExp(search, 'i'))) return option
		})
		.filter(Boolean)
}

const findOptionAction = (options: CommandPromptOption[], option: HTMLElement) => {
	return options.find(opt => opt.label == option.lastChild.textContent)
}

export default CommandPrompt

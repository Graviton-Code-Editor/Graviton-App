import { state, render, element } from '@mkenzo_8/puffin'
import CommandPromptBody from '../components/command.prompt/command.prompt'
import WindowBackground from '../components/window/background'

import { PuffinState } from 'Types/puffin.state'
import { CommandPromptOptions } from 'Types/command.prompt'

class CommandPrompt {
	private CPName: string
	private CPCompletedEvent: (x) => void
	private CPSelectedEvent: (x) => void
	private CPScrolledEvent: (x) => void
	private CPState: PuffinState
	private CPOptions: any[]
	private CPOptionsElement: HTMLElement
	private CPInputValue: String
	private CPDefaultOption: number
	private CPElement: HTMLElement

	private _selectOption(option) {
		if (option) {
			const optionObj = findOptionAction(this.CPOptions, option)
			if (optionObj.action) optionObj.action()
			if (this.CPSelectedEvent)
				this.CPSelectedEvent({
					label: option.textContent,
					data: option.props.data,
				})
		}
		if (this.CPCompletedEvent) this.CPCompletedEvent(this.CPInputValue)
	}

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
			closeCommandPrompt(self.CPName)
			self._selectOption(this)
		}
		this.CPOptionsElement.innerHTML = ''
		render(optionsComp, this.CPOptionsElement)
		this.CPState.data.hoveredOption = this.CPOptionsElement.children[0].children[hoveredDefault]
		this._hoverOption(this.CPState.data.hoveredOption)
	}

	private _hoverOption(hoveredOption) {
		if (!hoveredOption) return
		const allOptions = [...hoveredOption.parentElement.children]
		allOptions.forEach(option => {
			if (option === hoveredOption) {
				option.classList.add('active')
				this.CPScrolledEvent({
					label: option.textContent,
					data: option.props.data,
				})
			} else {
				option.classList.remove('active')
			}
		})
	}

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

	constructor({
		name = Math.random(),
		showInput = true,
		inputPlaceHolder = '',
		inputDefaultText = '',
		options = [],
		scrollOnTab = false,
		closeOnKeyUp = false,
		onCompleted = x => {},
		onSelected = x => {},
		onScrolled = x => {},
		defaultOption = 0,
	}: CommandPromptOptions) {
		const finalName = `${name}_cp`
		if (document.getElementById(finalName)) return // Check if there are any command prompts already opened

		const self = this

		this.CPName = finalName
		this.CPCompletedEvent = onCompleted
		this.CPSelectedEvent = onSelected
		this.CPScrolledEvent = onScrolled
		this.CPState = new state({
			hoveredOption: null,
		})
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
			<WindowBackground window="${finalName}" closeWindow=${() => this.closeCP()}/>
			<div class="container">
				<input value="${inputDefaultText}" style="${showInput ? '' : 'opacity:0; height:1px; margin:0;padding:0; border:0px;'}" placeHolder="${inputPlaceHolder}" :keyup="${writing}"/>
				<div/>
			</div>
		</CommandPromptBody>
		`
		function writing(e: KeyboardEvent) {
			e.preventDefault()
			const command = this.value
			self.CPInputValue = command
			switch (e.keyCode) {
				case 9:
					if (scrollOnTab) {
						break
					}
					self._selectOption(self.CPState.data.hoveredOption)
					self.closeCP()
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
					break
				default:
					self._renderOptions(filterOptions(this.value, options))
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
			const container = this.children[1].children[1]
			self.CPOptionsElement = container
			self._renderOptions(self.CPOptions)
			window.addEventListener('keydown', e => {
				if (e.keyCode === 27) {
					self.closeCP()
				}
			})
			const input = this.children[1].children[0]
			input.selectionStart = input.selectionEnd = input.value.length
			setTimeout(() => input.focus(), 1)
		}
		this.CPElement = render(CommandPromptComponent, document.getElementById('windows'))
	}
	private closeCP() {
		if (this.CPElement) this.CPElement.remove()
	}
}

function closeCommandPrompt(CommandPromptID: string) {
	if (document.getElementById(CommandPromptID)) document.getElementById(CommandPromptID).remove()
}

function filterOptions(search: string, options: Array<{ label: string }>) {
	return options
		.map(function (option) {
			if (option.label.match(new RegExp(search, 'i'))) return option
		})
		.filter(Boolean)
}

const findOptionAction = (options: Array<{ label: string; action: () => void }>, option: HTMLElement) => {
	return options.find(opt => opt.label == option.lastChild.textContent)
}

export default CommandPrompt

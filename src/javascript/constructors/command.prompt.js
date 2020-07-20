import { state, render, element } from '@mkenzo_8/puffin'
import CommandPromptBody from '../components/command.prompt/command.prompt'
import WindowBackground from '../components/window/background'

function CommandPrompt({
	name = Math.random(),
	showInput = true,
	inputPlaceHolder = '',
	options = [],
	scrollOnTab = false,
	closeOnKeyUp = false,
	onCompleted = () => {},
	onSelected = () => {},
	onScrolled = () => {},
}) {
	name = `${name}_cp`
	if (document.getElementById(name)) return // Check if there are any command prompts already opened
	let CommandPromptState = new state({
		hoveredOption: null,
	})
	const configArguments = arguments[0]
	const CommandPromptComponent = element({
		components: {
			CommandPromptBody,
			WindowBackground,
		},
	})`
		<CommandPromptBody mounted="${mounted}" id="${name}" :keydown="${scrolling}">
			<WindowBackground window="${name}" closeWindow=${() => closeCommandPrompt(name)}/>
			<div class="container">
				<input style="${showInput ? '' : 'opacity:0; height:1px; margin:0;padding:0; border:0px;'}" placeHolder="${inputPlaceHolder}" :keyup="${writing}"/>
				<div/>
			</div>
		</CommandPromptBody>
	`
	function writing(e) {
		e.preventDefault()
		const command = this.value
		switch (e.keyCode) {
			case 9:
				if (scrollOnTab) {
					break
				}
				selectOption(CommandPromptState.data.hoveredOption, {
					options,
					onSelected,
					onCompleted,
				})
				closeCommandPrompt(name)
			case 17:
				if (!scrollOnTab) {
					break
				}
			case 13:
				selectOption(CommandPromptState.data.hoveredOption, {
					options,
					onSelected,
					onCompleted,
				})
				closeCommandPrompt(name)
				break
			case 38:
			case 40:
				break
			default:
				renderOptions(
					{
						...configArguments,
						options: filterOptions(this.value, {
							options,
						}),
					},
					{
						parent: this.parentElement.children[1],
						state: CommandPromptState,
						name,
					},
				)
		}
	}
	function scrolling(e) {
		switch (e.keyCode) {
			case 38:
				scrollOptions({
					state: CommandPromptState,
					scrollingDirection: 'up',
					...configArguments,
				})
				break
			case 9:
				e.preventDefault()
				if (!scrollOnTab) {
					break
				}
			case 40:
				scrollOptions({
					state: CommandPromptState,
					scrollingDirection: 'down',
					...configArguments,
				})
				break
		}
	}
	function mounted() {
		const target = this
		const container = target.children[1].children[1]
		renderOptions(
			{
				options,
				...configArguments,
			},
			{
				parent: container,
				state: CommandPromptState,
				name,
			},
		)
		window.addEventListener('keydown', e => {
			if (e.keyCode === 27) {
				closeCommandPrompt(name)
			}
		})
		const input = target.children[1].children[0]
		input.focus()
	}
	render(CommandPromptComponent, document.getElementById('windows'))
}

function closeCommandPrompt(CommandPromptComponent) {
	if (document.getElementById(CommandPromptComponent)) document.getElementById(CommandPromptComponent).remove()
}

function scrollOptions({ state, scrollingDirection, onScrolled }) {
	const hoveredOption = state.data.hoveredOption
	const allOptions = [...hoveredOption.parentElement.children]
	const hoveredOptionPosition = allOptions.indexOf(hoveredOption)
	if (scrollingDirection === 'up') {
		if (hoveredOptionPosition !== 0) {
			state.data.hoveredOption = allOptions[hoveredOptionPosition - 1]
		} else {
			state.data.hoveredOption = allOptions[allOptions.length - 1]
		}
	} else if (scrollingDirection === 'down') {
		if (hoveredOptionPosition !== allOptions.length - 1) {
			state.data.hoveredOption = allOptions[hoveredOptionPosition + 1]
		} else {
			state.data.hoveredOption = allOptions[0]
		}
	}
	hoverOption(state.data.hoveredOption, allOptions, onScrolled)
}

function hoverOption(hoveredOption, allOptions, onScrolled = () => {}) {
	allOptions.forEach(option => {
		if (option === hoveredOption) {
			option.classList.add('active')
			onScrolled({
				label: option.textContent,
				data: option.props.data,
			})
		} else {
			option.classList.remove('active')
		}
	})
}

function filterOptions(search, { options }) {
	return options
		.map(function (option) {
			if (option.label.match(new RegExp(search, 'i'))) return option
		})
		.filter(Boolean)
}

function renderOptions({ options, onSelected, onCompleted }, { state, parent, name }) {
	let content = ''
	let hoveredDefault = 0

	const optionsComp = element`
			<div>
				${options.map(({ selected, label, data }, index) => {
					if (selected) hoveredDefault = index
					return element`<a :click="${onClicked}" data="${data}">${label}</a> `
				})}
			</div>
		`
	function onClicked() {
		closeCommandPrompt(name)
		selectOption(this, {
			options,
			onSelected,
			onCompleted,
		})
	}
	parent.innerHTML = ''
	render(optionsComp, parent)
	state.data.hoveredOption = parent.children[0].children[hoveredDefault]
	hoverOption(state.data.hoveredOption, [...parent.children[0].children])
}

const findOptionAction = (options, option) => {
	return options.find(opt => opt.label == option.textContent)
}

function selectOption(option, { options, onSelected, onCompleted, command }) {
	if (option) {
		const optionObj = findOptionAction(options, option)
		if (optionObj.action) optionObj.action()
		if (onSelected)
			onSelected({
				label: option.textContent,
				data: option.props.data,
			})
	}
	if (onCompleted) onCompleted(command)
}

export default CommandPrompt

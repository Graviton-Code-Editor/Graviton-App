import { element, state, render } from '@mkenzo_8/puffin'
import { Button } from '@mkenzo_8/puffin-drac'
import { css as style } from 'emotion'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import * as XtermWebfont from 'xterm-webfont'
import { getProperty, ThemeProvider } from 'ThemeProvider'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import AddTermIcon from './icons/add_term'
import ButtonIcon from './button_icon'

import '../../../node_modules/xterm/css/xterm.css'

let sessionsCount = 0

const styled = style`
	box-shadow: inset 0 -1px 10px rgba(0,0,0,0.25);
	max-width: 100%;
	margin: 0;
	position: relative;
	width: auto;
	max-height: 100%;
	min-height: 100%;
	overflow: hidden;
	& p{
		color: var(--textColor);
		font-size: 13px;
	}
	& select {
		padding: 7px 5px;
		background: transparent;
		border:0;
		color: var(--textColor);
		border-bottom: 2px solid var(--textColor);
		& option {
			color: var(--contextmenuButtonText);
			background: var(--contextmenuButtonBackground);
		}
	}
	& .bar {
		height: 30px;
		padding: 5px;
		display: flex;

		& button {
			flex: 1;
			min-width: 40px;
			max-width: 40px;
		}
		& select {
			flex: 1;
			min-width: 35px;
			width: auto;
			max-width: 100px;
		}
		& div{
			flex: 1;
			min-width: 0px;
			max-width: 100%;
		}
	}
	& .terminal_container{
		max-width: 100%;
		margin: 0;
		position: relative;
		width: auto;
		min-height: calc( 100% - 50px);
		max-height: calc( 100% - 50px);
	}
	& .xterm {
		padding: 0px;
		& > * {
			z-index: 0 !important;
		}
	}
	& .shell_selector{
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		height: calc(100% - 40px);
	}
	& #terms_stack{
		padding: 10px;
	}
`

const shells: any = {}

RunningConfig.on('registerTerminalClient', ({ name, onCreated }) => {
	shells[name] = onCreated
})

const TerminalState = new state({
	shells,
	terminals: [],
	terminal: null,
})

const getConfig = () => {
	return {
		fontFamily: 'JetBrainsMono',
		theme: {
			background: getProp('terminalBackground'),
			foreground: getProp('terminalForeground'),
			selection: getProp('terminalSelection'),
			cursor: getProp('terminalCursor'),
		},
		cursorStyle: 'bar' as 'bar',
		cursorBlink: true,
		fontSize: 14,
		lineHeight: 1.4,
		windowsMode: process.platform === 'win32',
	}
}

export default function TerminalComp() {
	function mountedTerminal() {
		this.state = TerminalState
	}

	return element({
		components: {
			TerminalBar,
		},
	})`
		<div mounted="${mountedTerminal}" class="${styled}">
			<TerminalBar/>
			<div id="terms_stack">
				<p>Press the + to create a session</p>
			</div>
		</div>
	`
}

function XtermTerminal() {
	sessionsCount++

	const xtermState = new state({
		shell: null,
		name: `Session ${sessionsCount}`,
	})

	TerminalState.data.terminals.push({
		name: xtermState.data.name,
	})

	TerminalState.data.terminal = xtermState.data.name

	TerminalState.emit('newTerminal')

	const refreshOptions = term => {
		const newConfig = getConfig()

		Object.keys(newConfig).forEach(key => {
			term.setOption(key, newConfig[key])
		})
	}

	function bindTheme(term) {
		StaticConfig.keyChanged('appTheme', () => {
			refreshOptions(term)
		})
	}

	async function mounted() {
		TerminalState.keyChanged('terminal', name => {
			if (name != xtermState.data.name) {
				this.style.display = 'none'
			} else {
				this.style.display = 'block'
			}
		})

		await xtermState.on('shellSelected')

		setTimeout(() => {
			const terminalClient = xtermState.data.shell(xtermState)
			const xtermInstance = new Terminal(getConfig())
			const fit = new FitAddon()

			bindTheme(xtermInstance)

			xtermInstance.loadAddon(fit)
			xtermInstance.loadAddon(new XtermWebfont())

			xtermInstance.onData(data => {
				xtermState.emit('data', data)
			})

			xtermState.on('write', data => {
				xtermInstance.write(data)
			})

			xtermInstance.open(this)

			window.addEventListener('resize', () => {
				fit.fit()
			})

			TerminalState.on('resize', () => {
				fit.fit()
			})

			setTimeout(() => {
				xtermInstance.refresh(0, 0)
				xtermInstance.focus()
				fit.fit()
				refreshOptions(xtermInstance)
			}, 75)
		}, 1)
	}

	function onChange() {
		const selectedOption = this.options[this.selectedIndex].innerText

		xtermState.data.shell = shells[selectedOption]

		this.parentElement.parentElement.remove()
		xtermState.emit('shellSelected')
	}

	return element`
		<div class="terminal_container" mounted="${mounted}">
			<div class="shell_selector">
				<div>
					<p>Select a shell</p>
					<select :change="${onChange}">
						<option></option>
						${Object.keys(shells).map(shell => {
							return element`<option>${shell}</option>`
						})}
					</select>
				</div>
			<div>
		</div>
	`
}

function TerminalBar() {
	function onChange() {
		const selectedOption = this.options[this.selectedIndex].innerText
		TerminalState.data.terminal = selectedOption
	}

	function mountedSelect() {
		TerminalState.on('newTerminal', () => {
			this.update()
		})
	}

	function createTerminal() {
		const container = document.getElementById('terms_stack')
		if (container.innerText !== '') container.innerText = ''
		render(XtermTerminal(), container)
	}

	return element({
		components: {
			Button,
			AddTermIcon,
			ButtonIcon,
		},
	})`
		<div class="bar">
			<select :change="${onChange}" mounted="${mountedSelect}">
				${() => TerminalState.data.terminals.map(({ name }) => element`<option selected="${name === TerminalState.data.terminal}">${name}</option>`)}
			</select>
			<div/>
			<ButtonIcon :click="${createTerminal}">
				<AddTermIcon/>
			</ButtonIcon>
		</div>
	`
}

function getProp(prop) {
	return getProperty(prop, ThemeProvider.data)
}

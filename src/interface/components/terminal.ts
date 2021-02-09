import { element, state, render } from '@mkenzo_8/puffin'
import { Button } from '@mkenzo_8/puffin-drac'
import { css as style } from '@emotion/css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import * as XtermWebfont from 'xterm-webfont'
import { getProperty, ThemeProvider, getFallbackProp } from 'ThemeProvider'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import AddTermIcon from './icons/add_term'
import ButtonIcon from './button_icon'
import CrossIcon from './icons/cross'
import AppPlatform from 'AppPlatform'

import '../../../node_modules/xterm/css/xterm.css'

let sessionsCount = 0

const styled = style`
	max-width: 100%;
	margin: 0;
	position: relative;
	width: auto;
	max-height: 100%;
	min-height: 100%;
	overflow: hidden;
	padding: 4px;
	& p{
		color: var(--textColor);
		font-size: 13px;
	}
	& select {
		user-select: none;
		transition: 0.05s;
		padding: 7px 5px;
		background: transparent;
		border:0;
		color: var(--textColor);
		background: var(--selectBackground);
		border-radius: 4px;
		:hover{
			transition: 0.1s;
			box-shadow: 0px 1px 5px rgba(0,0,0,0.15);
		}
		:focus{
			transition: 0.1s;
			box-sizing: border-box;
			box-shadow:0px 1px 5px rgba(0,0,0,0.20);
		}
		& option {
			color: var(--contextmenuButtonText);
			background: var(--contextmenuButtonBackground);
		}
	}
	& .bar {
		height: 30px;
		padding: 5px;
		display: flex;
		& > button {
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
		& #terminal_accessories{
			display: flex;
			justify-content: center;
			& > div {
				display: flex;
				text-align: center;
				justify-content: center;
				font-size: 13px;
				color: var(--textColor);
				align-items: center;
			}
			& button {
				padding: 6px 9px;
			}
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
		height: calc(100% - 100px);
	}
	& #terms_stack{
		padding: 10px;
	}
`

RunningConfig.on('unregisterTerminalShell', ({ name }) => {
	delete RunningConfig.data.terminalShells[name]
})

RunningConfig.on('registerTerminalShell', ({ name, onCreated }) => {
	RunningConfig.data.terminalShells[name] = onCreated
})

RunningConfig.on('addLocalTerminalAccessory', ({ component }) => {
	RunningConfig.data.localTerminalAccessories.push({
		component,
	})
})

const getConfig = () => {
	return {
		fontFamily: 'JetBrainsMono',
		theme: {
			background: getProp('terminalBackground'),
			foreground: getProp('terminalForeground'),
			cursor: getProp('terminalCursor'),
			cursorAccent: getProp('terminalCursorAccent'),
			selection: getProp('terminalSelection'),
			black: getProp('terminalBlack'),
			red: getProp('terminalRed'),
			green: getProp('terminalGreen'),
			yellow: getProp('terminalYellow'),
			blue: getProp('terminalBlue'),
			magenta: getProp('terminalMagenta'),
			cyan: getProp('terminalCyan'),
			white: getProp('terminalWhite'),
			brightGreen: getProp('terminalBrightGreen'),
			brightYellow: getProp('terminalBrightYellow'),
			brightBlue: getProp('terminalBrightBlue'),
			brightMagenta: getProp('terminalMagenta'),
			brightCyan: getProp('terminalCyan'),
			brightWhite: getProp('terminalWhite'),
		},
		cursorStyle: 'bar' as 'bar',
		cursorBlink: true,
		fontSize: 14,
		lineHeight: 1.4,
		windowsMode: AppPlatform === 'win32',
	}
}

const DefaultText = () => element`<p id="terminal_tip">Press the + to create a session</p>`

export default function TerminalComp() {
	function TerminalMounted() {
		RunningConfig.on('aTerminalHasBeenClosed', () => {
			if (RunningConfig.data.openedTerminals.length === 0) {
				render(DefaultText(), this)
			}
		})
	}

	return element({
		components: {
			TerminalBar,
			DefaultText,
		},
	})`
		<div class="${styled}">
			<TerminalBar/>
			<div id="terms_stack" mounted="${TerminalMounted}">
				<DefaultText/>
			</div>
		</div>
	`
}

function XtermTerminal({ shell = null } = {}) {
	sessionsCount++

	const xtermState = new state({
		shell: null,
		name: `Session ${sessionsCount}`,
	})

	RunningConfig.data.openedTerminals.push({
		name: xtermState.data.name,
		state: xtermState,
	})

	RunningConfig.data.focusedTerminal = xtermState.data.name

	RunningConfig.emit('aTerminalHasBeenCreated')

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
		RunningConfig.keyChanged('focusedTerminal', name => {
			if (name != xtermState.data.name) {
				this.style.display = 'none'
			} else {
				this.style.display = 'block'
			}
		})

		xtermState.on('shellSelected').then(async () => {
			const terminalClient = xtermState.data.shell(xtermState)

			function mountedAccs() {
				const focusedTerminalWatcher = RunningConfig.keyChanged('focusedTerminal', name => {
					if (name != xtermState.data.name) {
						this.style.display = 'none'
					} else {
						this.style.display = 'block'
						xtermInstance.focus()
					}
				})
				xtermState.once('close', () => {
					this.remove()
					focusedTerminalWatcher.cancel()
				})
			}
			if (terminalClient) {
				if (terminalClient.accessories) {
					const accessoriesContainer = element`
					<div mounted="${mountedAccs}">
						${terminalClient.accessories.map(acc => {
							return acc.component(xtermState)
						})}
					</div>
					`
					render(accessoriesContainer, document.getElementById('terminal_accessories'))
				}
			}

			const xtermInstance = new Terminal(getConfig())
			const fit = new FitAddon()

			bindTheme(xtermInstance)

			xtermInstance.loadAddon(fit)
			xtermInstance.loadAddon(new XtermWebfont())

			xtermState.on('write', data => {
				// Write to the terminal when the shell sends an output
				xtermInstance.write(data)
			})

			xtermState.on('breakLine', () => {
				//Break the line on the xterm
				xtermInstance.writeln('')
			})

			xtermInstance.onData(data => {
				// Emit the data event when the terminal is being written
				xtermState.emit('data', data)
			})

			xtermInstance.onResize(args => {
				// Emit the resize event
				xtermState.emit('resize', args)
			})

			xtermInstance.onKey(e => {
				// Emit the keyPressed event
				xtermState.emit('keyPressed', e.key)
			})

			const resizingWatchers = RunningConfig.on<any>(['sidePanelHasBeenResized', 'mainBoxHasBeenResized'], () => {
				// Force resizing when the sidepanel of the mainbox gets resized
				fit.fit()
			})

			xtermState.once('close', () => {
				// When the terminal needs to be closed
				this.remove()
				const openedTerms = RunningConfig.data.openedTerminals
				const index = getTerminalIndex(xtermState.data.name)

				if (openedTerms.length === 1) {
					RunningConfig.data.focusedTerminal = null
				} else if (openedTerms[index - 1]) {
					RunningConfig.data.focusedTerminal = openedTerms[index - 1].name
				} else {
					RunningConfig.data.focusedTerminal = openedTerms[index + 1].name
				}

				resizingWatchers.cancel()

				RunningConfig.data.openedTerminals.splice(index, 1)
				RunningConfig.emit('aTerminalHasBeenClosed', { name })
			})

			await (xtermInstance as any).loadWebfontAndOpen(this)

			window.addEventListener('resize', () => {
				fit.fit()
			})

			xtermInstance.refresh(0, 0)
			xtermInstance.focus()
			fit.fit()
		})

		if (shell) {
			xtermState.data.shell = RunningConfig.data.terminalShells[shell]
			this.children[0].remove()
			xtermState.emit('shellSelected')
		}
	}

	function onChange() {
		const selectedOption = this.options[this.selectedIndex].innerText
		xtermState.data.shell = RunningConfig.data.terminalShells[selectedOption]
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
						${Object.keys(RunningConfig.data.terminalShells).map(shell => {
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
		// Selected a Terminal Shell
		const selectedOption = this.options[this.selectedIndex].innerText
		RunningConfig.data.focusedTerminal = selectedOption
	}

	function mountedSelect() {
		RunningConfig.on<any>(['aTerminalHasBeenCreated', 'aTerminalHasBeenClosed'], () => {
			//Terminal was created
			this.update()
		})
	}

	function createTerminal() {
		const container = document.getElementById('terms_stack')
		const terminalTip = document.getElementById('terminal_tip')
		if (terminalTip != null) terminalTip.remove()
		render(XtermTerminal(), container)
	}

	RunningConfig.on('createTerminalSession', ({ shell }) => {
		const container = document.getElementById('terms_stack')
		const terminalTip = document.getElementById('terminal_tip')
		if (terminalTip != null) terminalTip.remove()
		render(
			XtermTerminal({
				shell,
			}),
			container,
		)
	})

	function closeTerminal() {
		const focusedTerminal = RunningConfig.data.focusedTerminal

		if (RunningConfig.data.openedTerminals.length === 0) {
			//Hide terminal if there isn't any more shells opened
			StaticConfig.data.appShowTerminal = false
		}

		;[...RunningConfig.data.openedTerminals].find(({ name, state }) => {
			if (name === focusedTerminal) {
				state.emit('close')
				return
			}
		})
	}

	return element({
		components: {
			Button,
			AddTermIcon,
			ButtonIcon,
			CrossIcon,
		},
	})`
		<div class="bar">
			<select :change="${onChange}" mounted="${mountedSelect}">
				${() => RunningConfig.data.openedTerminals.map(({ name }) => element`<option ${name === RunningConfig.data.focusedTerminal ? 'selected=' : ''}>${name}</option>`)}
			</select>
			<ButtonIcon :click="${closeTerminal}">
				<CrossIcon/>
			</ButtonIcon>
			<div id="terminal_accessories"/>
			<ButtonIcon :click="${createTerminal}">
				<AddTermIcon/>
			</ButtonIcon>
		</div>
	`
}

function getTerminalIndex(name) {
	let index = null
	RunningConfig.data.openedTerminals.forEach((term, i) => {
		if (term.name === name) index = i
	})
	return index
}

function getProp(prop) {
	const value = getProperty(prop, ThemeProvider.data)
	return !!value ? value : getFallbackProp(prop)
}

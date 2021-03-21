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
import { Panel } from 'Constructors/panel'
import Tab from 'Constructors/tab'
import ContextMenu from 'Constructors/contextmenu'

import '../../../node_modules/xterm/css/xterm.css'

let sessionsCount = 0

const styled = style`
	max-width: 100%;
	margin: 0;
	position: relative;
	width: auto;
	max-height: 100%;
	min-height: 100%;
	background:var(--tabsbarBackground);
	& #terms_stack > div {
		border-left: 0px;
	}
	& .tabsbar {
		margin-right: 90px;
	}
	& .tabspanel {
		display: flex;
		& > div {
			background:var(--mainpanelBackground);
			flex: 1;
			max-width: 100%;
		}
	}
	& .bar {
		height: 0px;
		& > .buttons {
			flex: 1;
			position: absolute;
			top: 0;
			right: 0px;
			height: 37px;
			display: flex;
			justify-content: center;
			& > button {
				flex: 1;
				margin: 0 10px;
			}
		}
		& > div{
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
`

const term_style = style`
  min-width: calc(100% - 30px);
	max-width: calc(100% - 30px);
	margin: 0;
	min-height: calc( 100% - 50px);
	padding: 15px;
	background: var(--mainpanelBackground);
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
	& p{
		color: var(--textColor);
		font-size: 13px;
	}
`

RunningConfig.on('unregisterTerminalShell', ({ name }) => {
	delete RunningConfig.data.terminalShells[name]
})

RunningConfig.on('registerTerminalShell', ({ name, onCreated }) => {
	RunningConfig.data.terminalShells[name] = onCreated
})

RunningConfig.on('addLocalTerminalAccessory', ({ menu }) => {
	RunningConfig.data.localTerminalAccessories.push({
		menu,
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

let terminalPanel

export default function TerminalComp() {
	function TerminalMounted() {
		terminalPanel = new Panel(this, {
			autoFocus: false,
		}).element
	}

	return element({
		components: {
			TerminalBar,
		},
	})`
		<div class="${styled}">
			<TerminalBar/>
			<div id="terms_stack" mounted="${TerminalMounted}"/>
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
		xtermState.on('shellSelected').then(async () => {
			const terminalClient = xtermState.data.shell(xtermState)

			const focusedTabListener = terminalTab.tabState.on('focusedMe', () => {
				RunningConfig.data.focusedTerminal = xtermState.data.name
			})

			terminalTab.tabState.once('destroyed', () => {
				xtermState.emit('close')
			})

			terminalTab.addContextMenuListener(event => {
				new ContextMenu({
					list: terminalClient.accessories.map(acc => acc.menu(xtermState)).flat(),
					event,
					parent: document.body,
				})
			})

			function mountedAccs() {
				const focusedTerminalWatcher = RunningConfig.keyChanged('focusedTerminal', name => {
					if (name === xtermState.data.name) {
						xtermInstance.focus()
					}
				})
				xtermState.once('close', () => {
					this.remove()
					focusedTerminalWatcher.cancel()
				})
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

			const tabFocusedListener = terminalTab.tabState.on('focusedMe', () => {
				// Force resizing when the tab is focused (or dropped)
				fit.fit()
			})

			const resizingListeners = RunningConfig.on<any>(['sidePanelHasBeenResized', 'mainBoxHasBeenResized'], () => {
				// Force resizing when the sidepanel or the mainbox gets resized
				fit.fit()
			})

			const terminalShowedListener = StaticConfig.keyChanged('appShowTerminal', () => {
				// Force resizing when the mainbox is toggled
				fit.fit()
			})

			xtermState.once('close', () => {
				// When the terminal needs to be closed
				this.remove()
				const openedTerms = RunningConfig.data.openedTerminals
				const index = getTerminalIndex(xtermState.data.name)

				if (openedTerms.length === 1) {
					RunningConfig.data.focusedTerminal = null
				}

				resizingListeners.cancel()
				terminalShowedListener.cancel()
				tabFocusedListener.cancel()
				focusedTabListener.cancel()

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

	const terminalComponent = element`
		<div class="terminal_container ${term_style}" mounted="${mounted}">
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

	const terminalTab = new Tab({
		panel: terminalPanel,
		title: `Session ${sessionsCount}`,
		component: () => terminalComponent,
		id: Math.random().toString(),
	})
}

function TerminalBar() {
	function createTerminal() {
		XtermTerminal()
	}

	RunningConfig.on('createTerminalSession', ({ shell }) => {
		XtermTerminal({
			shell,
		})
	})

	function closeTerminal() {
		StaticConfig.data.appShowTerminal = false
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
			<div id="terminal_accessories"/>
			<div class="buttons">
				<ButtonIcon :click="${closeTerminal}">
					<CrossIcon/>
				</ButtonIcon>
				<ButtonIcon :click="${createTerminal}">
					<AddTermIcon/>
				</ButtonIcon>
			</div>
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

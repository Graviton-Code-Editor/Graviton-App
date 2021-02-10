import { element, createElement, lang, state } from '@mkenzo_8/puffin'
import { LanguageState } from 'LanguageConfig'
import RunningConfig from 'RunningConfig'

import WindowBody from '../components/window/body'
import WindowBackground from '../components/window/background'
import WindowContainer from '../components/window/container'

import PuffinElement from '../types/puffin.element'
import { PuffinState, PuffinEventInstance } from '../types/puffin.state'
import { WindowOptions } from '../types/window'

class Window {
	private WindowComponent: object
	public WindowElement: PuffinElement
	public WindowState: PuffinState
	/**
	 *  Initializes a Graviton window.
	 *
	 *  @param {string} title - Title for window.
	 *  @param {PuffinComponent} component - Puffin component to inject in window's body.
	 *  @param {string} height - Custom window's height.
	 *  @param {string} width - Custom window's width.
	 *  @param {string} id - Assign the window an unique identifier.
	 *
	 */
	constructor({ title = '', component: externalComponent, minHeight = 'auto', minWidth = 'auto', height = '80%', width = '85%', id = '' }: WindowOptions) {
		if (id !== '' && document.getElementById(id)) {
			return
		}
		const closeWindowExternally = this.close.bind(this)
		this.WindowState = new state({})
		this.WindowComponent = element({
			components: {
				WindowBody,
				WindowBackground,
				externalComponent,
				WindowContainer,
			},
			addons: [lang(LanguageState)],
		})`
		<WindowContainer id="${id}" win-title="${title}" class="window" closeWindowExternally="${closeWindowExternally}">
			<WindowBackground closeWindow="${closeWindowExternally}"/>
			<WindowBody style="min-width:${minWidth};min-height:${minHeight};height:${height};width:${width};">
				<externalComponent/>
			</WindowBody>
		</WindowContainer>
		`
	}
	/**
	 * Bind events to the window's state manager.
	 *
	 * @param {string} event - Event's name.
	 * @param {function} callback - Function to be executed when the event is emitted.
	 *
	 */
	public on(event: string, callback: () => void): PuffinEventInstance {
		return this.WindowState.on(event, callback)
	}
	/**
	 * Open the window.
	 */
	public launch(): void {
		const windowsContainer = <PuffinElement>document.getElementById('windows')
		this.WindowElement = createElement(this.WindowComponent)
		windowsContainer.appendChild(this.WindowElement)
		RunningConfig.data.openedWindows = RunningConfig.data.openedWindows + 1
		this.WindowState.emit('launched')
	}
	/**
	 * Close the window.
	 */
	public close(): void {
		if (this.WindowElement) {
			this.WindowElement.remove()
			this.WindowState.emit('closed')
			RunningConfig.data.openedWindows = RunningConfig.data.openedWindows - 1
		}
	}
}

export default Window

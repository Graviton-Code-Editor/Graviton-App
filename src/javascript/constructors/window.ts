import { element, style, createElement, lang, state } from '@mkenzo_8/puffin'
import { LanguageState } from 'LanguageConfig'
import RunningConfig from 'RunningConfig'

import WindowBody from '../components/window/body'
import WindowBackground from '../components/window/background'
import WindowContainer from '../components/window/container'

import PuffinElement from '../types/puffin.element'
import PuffinState from '../types/puffin.state'
import { WindowOptions } from '../types/window'

class Window{
	private WindowComponent: object;
	private WindowElement: PuffinElement;
	private WindowState: PuffinState;
	constructor({ 
		title = '', 
		component: externalComponent,
		height = '75%', 
		width = '80%',
		id = ''
	}: WindowOptions){
		if(document.getElementById(id)){
			return
		}
		const closeWindowExternally = this.close.bind(this)
		this.WindowState = new state({})
		this.WindowComponent = element({
			components: {
				WindowBody,
				WindowBackground,
				externalComponent,
				WindowContainer
			},
			addons: [
				lang(LanguageState)
			],
		})`
		<WindowContainer id="${id}" win-title="${title}" class="window" closeWindowExternally="${closeWindowExternally}">
			<WindowBackground closeWindow=${closeWindowExternally}/>
				<WindowBody style="height:${() => height};width:${() => width};">
				<externalComponent/>
			</WindowBody>
		</WindowContainer>
		`
	}
	public on(event: string, callback: () => void ): void{
		this.WindowState.on(event,callback)
	}
	public launch(): void {
		const windowsContainer = (<PuffinElement>document.getElementById('windows'))
		this.WindowElement = createElement(this.WindowComponent)
		windowsContainer.appendChild(this.WindowElement)
		RunningConfig.data.openedWindows = RunningConfig.data.openedWindows + 1
		this.WindowState.emit('launched')
	}
	public close(): void {
		if (this.WindowElement) {
			this.WindowElement.remove()
			this.WindowState.emit('closed')
			RunningConfig.data.openedWindows = RunningConfig.data.openedWindows - 1
		}
	}
}

export default Window

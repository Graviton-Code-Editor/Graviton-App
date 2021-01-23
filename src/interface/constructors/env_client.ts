import { state, element, render } from '@mkenzo_8/puffin'
import EnvCient from 'Components/env_client'
import { Text, Titles } from '@mkenzo_8/puffin-drac'
import Play from '../components/icons/play'
import Stop from '../components/icons/stop'
import Reload from '../components/icons/reload'
import Close from '../components/icons/close'
import { PuffinEventInstance, PuffinState } from 'Types/puffin.state'
import PuffinElement from 'Types/puffin.element'

class EnvClient {
	containerElement: PuffinElement
	clientState: PuffinState
	isClicked: boolean = false
	status: string
	data: any
	on(eventName: string, action: () => void): PuffinEventInstance {
		return <PuffinEventInstance>this.clientState.on(eventName, action)
	}
	emit(eventName: string, data: any): void {
		return this.clientState.emit(eventName, data)
	}
	onStart() {
		this.clientState.emit('start')
	}
	onStop() {
		this.clientState.emit('stop')
	}
	onReload() {
		this.clientState.emit('reload')
	}
	onClose() {
		this.clientState.emit('destroy')
		this.onStop()
	}
	constructor({ name }) {
		this.clientState = new state(arguments[0])
		this.data = this.clientState.data
		this.status = 'Stopped'

		const ClientWindow = element({
			components: {
				EnvCient,
				Play,
				Text,
				Stop,
				H5: Titles.h5,
				Reload,
				Close,
			},
		})`
		<EnvCient>
			<div :mousedown="${this.barClicked.bind(this)}"class="dragger">
				<H5>${name}</H5>
			</div>
			<div>
				<div class="buttons">
					<div :click="${this.onStart.bind(this)}">
						<Play/>
						<Text>Start</Text>
					</div>
					<div :click="${this.onStop.bind(this)}">
						<Stop/>
						<Text>Stop</Text>
					</div>
					<div :click="${this.onReload.bind(this)}">
						<Reload/>
						<Text>Reload</Text>
					</div>
					<div :click="${this.onClose.bind(this)}">
						<Close/>
						<Text>Close</Text>
					</div>
				</div>
			</div>
			<Text class="status" >Status: <span status="${() => this.status}">${() => this.status}</span></Text>
		</EnvCient>
		`

		this.containerElement = render(ClientWindow, document.getElementById('windows'))
		this.addListeners()
	}
	/*
	 * Dragging listeners
	 */
	barClicked() {
		this.isClicked = true
	}
	addListeners() {
		const StatusElement = <PuffinElement>this.containerElement.children[2].children[0]

		const barUnClicked = (e: MouseEvent) => {
			this.isClicked = false
		}

		const barMoved = (e: MouseEvent) => {
			if (this.isClicked) {
				this.containerElement.style.top = (e.pageY - 20).toString()
				this.containerElement.style.left = (e.pageX - 110).toString()
			}
		}

		window.addEventListener('mousemove', barMoved)
		window.addEventListener('mouseup', barUnClicked)

		// START event
		this.clientState.on('start', () => {
			this.status = 'Started'
			StatusElement.update()
		})

		// STOP Event
		this.clientState.on('stop', () => {
			this.status = 'Stopped'
			StatusElement.update()
		})

		// DESTROY event
		this.clientState.on('destroy', () => {
			this.status = 'Started'
			this.onStop()
			this.containerElement.remove()
			window.removeEventListener('mousemove', barMoved)
			window.removeEventListener('mouseup', barUnClicked)
		})
	}
}

export default EnvClient

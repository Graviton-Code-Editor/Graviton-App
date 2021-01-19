import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core
import { EventEmitter } from 'events'

/*
 * Simple interface to create and manage Node-pty's spawns from renderer process
 */

export default class LocalTerminalShell {
	id: number
	event: EventEmitter
	constructor(opts) {
		this.id = Math.random()
		this.event = new EventEmitter()

		ipcRenderer.invoke('create-local-shell', {
			id: this.id,
			...opts,
		})

		ipcRenderer.on('local-shell-data', (e, { id, data }) => {
			if (this.id === id) {
				this.event.emit('data', data)
			}
		})

		ipcRenderer.on('local-shell-closed', (e, { id }) => {
			if (this.id === id) {
				this.event.emit('closed', id)
			}
		})
	}
	on(eventName: string, callback: (data: string) => void) {
		this.event.on(eventName, callback)
	}
	resize(cols: number, rows: number) {
		this.send('local-shell-resize', {
			cols,
			rows,
		})
	}
	write(data: string) {
		this.send('local-shell-write', data)
	}
	send(event: string, content: any) {
		ipcRenderer.send(event, {
			id: this.id,
			content,
		})
	}
}

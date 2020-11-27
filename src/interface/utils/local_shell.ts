import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core
console.log(ipcRenderer)
import { EventEmitter } from 'events'

/*
 * Simple interface to create and manage  Node-pty's spawns
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
	}
	on(eventName, callback) {
		this.event.on(eventName, callback)
	}
	resize(cols, rows) {
		this.send('local-shell-resize', {
			cols,
			rows,
		})
	}
	write(data) {
		this.send('local-shell-write', data)
	}
	send(event, content) {
		ipcRenderer.send(event, {
			id: this.id,
			content,
		})
	}
}

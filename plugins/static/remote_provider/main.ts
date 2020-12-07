import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import CommandPrompt from 'Constructors/command.prompt'
import Notification from 'Constructors/notification'

let ConnectionInstance

interface Event {
	eventName: string
	callback: (any) => void
}

class Connection {
	ws: WebSocket
	events: Event[] = []
	constructor() {
		this.ws = new WebSocket(`ws://${StaticConfig.data.remoteServerIP}/api/ws`)

		this.ws.onmessage = ({ data }) => {
			const msg = JSON.parse(data)
			this.events.forEach(({ eventName, callback }, i) => {
				if (msg.type === eventName) {
					callback(msg.data)
				}
			})
		}
	}
	send(messageObject: Object) {
		this.ws.send(JSON.stringify(messageObject))
	}
	on(eventName: string, callback: (messageObject: Object) => void) {
		this.events.push({
			eventName,
			callback,
		})

		return () => {
			this.events.forEach((e, i) => {
				if (e.callback === callback) {
					this.events.splice(i, 1)
				}
			})
		}
	}
}

class remoteServer {
	static providerName = 'Remote Server'
	/*
	 * List a folder
	 *
	 * @param path - The folder's directory
	 * @returns A promise with the received items
	 */
	static listDir(path: string): Promise<boolean> {
		return new Promise(res => {
			ConnectionInstance.send({
				type: 'listDir',
				data: {
					path,
				},
			})

			const cancel = ConnectionInstance.on('listedDir', data => {
				if (data.path !== path) return
				res(data.list)
				cancel()
			})
		})
	}
	/*
	 * Read a file
	 *
	 * @param path - The file's path
	 * @returns A promise with the received content
	 */
	static readFile(path: string): Promise<string> {
		return new Promise(res => {
			ConnectionInstance.send({
				type: 'readFile',
				data: {
					path,
				},
			})

			const cancel = ConnectionInstance.on('fileReaded', data => {
				if (data.path !== path) return
				res(data.content)
				cancel()
			})
		})
	}
	/*
	 * Write a content to a file
	 *
	 * @beta
	 */
	static writeFile() {}
	/*
	 * Rename a item
	 *
	 * @beta
	 */
	static renameDir() {}
	/*
	 * Create a folder
	 *
	 * @beta
	 */
	static mkdir() {}
	/*
	 * Check if a file exists or not
	 *
	 * @param path - The items's path
	 * @returns A promise with the result
	 */
	static exists(path: string): Promise<boolean> {
		return new Promise(res => {
			ConnectionInstance.send({
				type: 'exists',
				data: {
					path,
				},
			})

			const cancel = ConnectionInstance.on('returnedExists', data => {
				if (data.path !== path) return
				res(data.exist)
				cancel()
			})
		})
	}
	/*
	 * Get information about the file
	 *
	 * @param path - The items's path
	 * @returns A promise with the result
	 */
	static info(path: string): Promise<Object> {
		return new Promise(res => {
			ConnectionInstance.send({
				type: 'info',
				data: {
					path,
				},
			})

			const cancel = ConnectionInstance.on('returnedInfo', data => {
				if (data.path !== path) return

				res({
					...data.info,
					isDirectory() {
						return true
					},
					isFile() {
						return false
					},
				})

				cancel()
			})
		})
	}
}

if (RunningConfig.data.isBrowser) {
	RunningConfig.emit('registeredExplorerProvider', remoteServer)
	RunningConfig.on('appLoaded', () => {
		if (StaticConfig.data.remoteServerIP && RunningConfig.data.explorerProvider.providerName === 'Remote Server') {
			ConnectionInstance = new Connection()
		}
	})

	RunningConfig.data.globalCommandPrompt.push({
		label: 'Configure Remote Provider',
		action() {
			const configuredIP = StaticConfig.data.remoteServerIP

			new CommandPrompt({
				name: 'remote_provider_conf',
				showInput: true,
				inputPlaceHolder: configuredIP ? configuredIP : `Server's IP`,
				options: [],
				onCompleted(serverIP) {
					StaticConfig.data.remoteServerIP = serverIP

					ConnectionInstance = new Connection()

					new Notification({
						title: 'Configured correctly',
						content: `Remote Server IP is now ${serverIP}`,
					})
				},
			})
		},
	})
}

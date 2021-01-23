import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import CommandPrompt from 'Constructors/command.prompt'

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
		this.ws.onopen = () => {
			ConnectedNotification()
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

export default class remoteServer {
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
	 * @param path - The file's path
	 *
	 * @param content - The file's new content
	 * @beta
	 */
	static writeFile(path: string, content: string) {
		return new Promise(res => {
			ConnectionInstance.send({
				type: 'writeFile',
				data: {
					path,
					content,
				},
			})

			const cancel = ConnectionInstance.on('returnedWriteFile', data => {
				if (data.path !== path) return
				res(data.error)
				cancel()
			})
		})
	}
	/*
	 * Rename a item
	 *
	 * @param path - The file's path
	 * @param newPath - The file's new path
	 *
	 * @beta
	 */
	static renameDir(path: string, newPath: string) {
		return new Promise(res => {
			ConnectionInstance.send({
				type: 'renameDir',
				data: {
					path,
					newPath,
				},
			})

			const cancel = ConnectionInstance.on('returnedRenameDir', data => {
				if (data.path !== path) return
				res(data.error)
				cancel()
			})
		})
	}
	/*
	 * Create a folder
	 *
	 * @param path - The file's path
	 *
	 * @beta
	 */
	static mkdir(path: string) {
		return new Promise(res => {
			ConnectionInstance.send({
				type: 'mkdir',
				data: {
					path,
				},
			})

			const cancel = ConnectionInstance.on('returnedMkdir', data => {
				if (data.path !== path) return
				res(data.error)
				cancel()
			})
		})
	}
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

	static isGitRepo() {
		return new Promise((resolve, reject) => {
			resolve(false)
		})
	}

	/*
	 * Get information about the file
	 *
	 * @param path - The items's path
	 * @returns A promise with the result
	 */
	static info(path: string): Promise<Object> {
		return new Promise((resolve, reject) => {
			ConnectionInstance.send({
				type: 'info',
				data: {
					path,
				},
			})

			const cancel = ConnectionInstance.on('returnedInfo', data => {
				if (data.path !== path) return
				if (data.error) {
					reject()
				}

				resolve({
					...data.info,
					isDirectory() {
						return data.isDirectory
					},
					isFile() {
						return data.isFile
					},
				})

				cancel()
			})
		})
	}
}

async function ConnectedNotification() {
	const { default: Notification } = await import('Constructors/notification')

	new Notification({
		title: `Connected to ${StaticConfig.data.remoteServerIP}`,
		content: `Press Ctrl+O to start exploring.`,
		buttons: [
			{
				label: 'Start exploring',
				action() {
					RunningConfig.emit('command.openExplorerCommandPrompt')
				},
			},
		],
	})
}

async function NoConnectionNotification() {
	const { default: Notification } = await import('Constructors/notification')

	new Notification({
		title: 'No server configured',
		lifeTime: Infinity,
		buttons: [
			{
				label: 'Configure',
				action() {
					goConfigure()
				},
			},
		],
	})
}

function goConfigure() {
	const configuredIP = StaticConfig.data.remoteServerIP

	new CommandPrompt({
		name: 'remote_provider_conf',
		showInput: true,
		inputPlaceHolder: configuredIP ? configuredIP : `Server's IP`,
		options: [
			{
				label: 'Default: localhost:8080 ',
				data: {
					key: 'default',
				},
				action() {},
			},
		],
		onSelected({ data: { key } }) {
			if (key === 'default') {
				StaticConfig.data.remoteServerIP = 'localhost:8080'

				ConnectionInstance = new Connection()
			}
		},
		onCompleted(serverIP) {
			if (serverIP == '') return

			StaticConfig.data.remoteServerIP = serverIP

			ConnectionInstance = new Connection()
		},
	})
}

window.addEventListener('load', () => {
	/*
	 * Only make the remote provider available in browser mode
	 */

	if (RunningConfig.data.isBrowser) {
		if (!StaticConfig.data.remoteServerIP && window.location.hostname !== 'graviton.netlify.app') {
			NoConnectionNotification()
		}

		if (StaticConfig.data.remoteServerIP && RunningConfig.data.explorerProvider.providerName === 'Remote Server') {
			ConnectionInstance = new Connection()
		}

		RunningConfig.data.globalCommandPrompt.push({
			label: 'Configure Remote Provider',
			action() {
				goConfigure()
			},
		})
	}
})

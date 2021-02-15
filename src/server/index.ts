import koa from 'koa'
import path from 'path'
import koaWs from 'koa-easy-ws'
import koaRouter from '@koa/router'
import koaStatic from 'koa-static'
import fs from 'fs-extra'
import koaLogger from 'koa-logger'
import koaCors from '@koa/cors'

const PORT = process.env.PORT || 8080

const app = new koa()
const router = koaRouter()

app.use(koaLogger())
app.use(koaWs())
app.use(koaCors())

app.use(koaStatic(path.resolve(__dirname, '..', 'dist_browser')))

/*
 * Check if a path is a folder or not
 *
 * @param path - Folder's directory
 * @returns A promise, it will resolve with the result
 */
function isFolder(path: string): Promise<Boolean> {
	return new Promise((res, rej) => {
		fs.lstat(path, (err, stats) => {
			if (err) return res(false)
			res(stats.isDirectory())
		})
	})
}

/*
 * Handle the incoming websockets requests
 */
router.get('/api/ws', async ctx => {
	if (!ctx.ws) return
	const ws = await ctx.ws()
	/*
	 * Send a message to the socket
	 * @param content - The message's object
	 */
	function sendMessage(content: object) {
		ws.send(JSON.stringify(content))
	}

	ws.on('message', (data: string) => {
		const messageObject = JSON.parse(data)

		switch (messageObject.type) {
			case 'listDir':
				fs.readdir(messageObject.data.path, async (err, items) => {
					if (err) {
						return sendMessage([])
					}
					sendMessage({
						type: 'listedDir',
						data: {
							path: messageObject.data.path,
							list: await Promise.all(
								items.map(async item => {
									const itemPath = path.join(messageObject.data.path, item)
									return {
										name: item,
										isFolder: await isFolder(itemPath),
										isHidden: false,
									}
								}),
							),
						},
					})
				})
				break
			case 'readFile':
				sendMessage({
					type: 'fileReaded',
					data: {
						path: messageObject.data.path,
						content: fs.readFileSync(messageObject.data.path, 'utf8'),
					},
				})
				break
			case 'info':
				fs.lstat(messageObject.data.path, (err, data) => {
					if (err) {
						sendMessage({
							type: 'returnedInfo',
							data: {
								path: messageObject.data.path,
								error: true,
							},
						})
					} else {
						sendMessage({
							type: 'returnedInfo',
							data: {
								path: messageObject.data.path,
								info: {
									...data,
									isDirectory: data.isDirectory(),
									isFile: data.isFile(),
								},
							},
						})
					}
				})
				break
			case 'renameDir':
				fs.rename(messageObject.data.path, messageObject.data.newPath, error => {
					sendMessage({
						type: 'returnedRenameDir',
						data: {
							path: messageObject.data.path,
							error,
						},
					})
				})
				break
			case 'writeFile':
				fs.writeFile(messageObject.data.path, messageObject.data.content, error => {
					sendMessage({
						type: 'returnedWriteFile',
						data: {
							path: messageObject.data.path,
							error,
						},
					})
				})
				break
			case 'mkdir':
				fs.mkdir(messageObject.data.path, error => {
					sendMessage({
						type: 'returnedMkdir',
						data: {
							path: messageObject.data.path,
							error,
						},
					})
				})
				break
			case 'exists':
				fs.stat(messageObject.data.path, err => {
					sendMessage({
						type: 'returnedExists',
						data: {
							path: messageObject.data.path,
							exist: !err,
						},
					})
				})
				break
		}
	})
})

app.use(router.routes())

app.listen(
	PORT,
	{
		host: '0.0.0.0',
	},
	() => {
		console.log(`
			\r Serving Graviton Server and Browser in port ${PORT}
			\n 
			\r NOTE: Be aware that Graviton Server is not completely secure, therefore is not recommended for public usage.
			\r You can discuss in: https://github.com/Graviton-Code-Editor/Graviton-App/discussions
		`)
	},
)

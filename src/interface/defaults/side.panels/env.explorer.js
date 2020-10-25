import SidePanel from '../../constructors/side.panel'
import RunningConfig from 'RunningConfig'
import { element, render } from '@mkenzo_8/puffin'
import EnvOutlined from '../../components/icons/env.outlined'
import Explorer from '../../constructors/explorer'
import { basename } from 'path'
import EnvClient from '../../constructors/env.client'
import Notification from '../../constructors/notification'
import detectEnv from '../../utils/detect_env'

/*
 * Only display it in Desktop version
 */
if (!RunningConfig.data.isBrowser) {
	RunningConfig.on('appLoaded', () => {
		const { panelNode } = new SidePanel({
			icon: EnvOutlined,
			panel: () => element`<div/>`,
			hint: 'Project inspector',
		})
		RunningConfig.on('addFolderToRunningWorkspace', async ({ folderPath }) => {
			const { env, prefix, info } = await detectEnv(folderPath)
			if (env && info) {
				const envExplorer = new Explorer({
					items: [
						{
							label: basename(folderPath),
							icon: 'file.package.json',
							decorator: {
								label: env,
							},
							items: getKeysToItems(info, folderPath, '', prefix),
						},
					],
				})
				const explorerNode = render(envExplorer, panelNode.children[0])
				RunningConfig.on('removeFolderFromRunningWorkspace', ({ folderPath: removedFolderPath }) => {
					if (folderPath == removedFolderPath) {
						explorerNode.remove()
					}
				})
			}
		})
	})
}

function getKeysToItems(keys, folder, fromKey, prefix = '') {
	return Object.keys(keys).map(key => {
		const keyValue = keys[key]

		const item = {
			label: key,
		}
		if (fromKey == 'scripts') {
			item.action = () => {
				executeScript(prefix, folder, key)
			}
		}
		if (typeof keyValue == 'object') {
			if (keyValue.icon === undefined && keyValue.value === undefined) {
				item.items = getKeysToItems(keyValue, folder, key, prefix)
			} else {
				if (typeof keyValue.value == 'object') {
					item.items = getKeysToItems(keyValue.value, folder, key, prefix)
				} else {
					item.label = keyValue.value
				}
			}
		}
		return item
	})
}

function executeScript(prefix, folder, script) {
	const { exec } = window.require('child_process')

	const scriptEnvClient = new EnvClient({
		name: script,
	})
	let scriptProcess
	scriptEnvClient.on('start', () => {
		scriptProcess = exec(`${prefix} ${script}`, {
			stdio: 'inherit',
			shell: true,
			detached: true,
			cwd: folder,
		})
		scriptProcess.stdout.on('data', data => {
			new Notification({
				title: script,
				content: data,
			})
		})
		scriptProcess.stdout.on('data', data => {
			new Notification({
				title: script,
				content: data,
			})
		})
		scriptProcess.on('close', () => {
			scriptEnvClient.emit('stop')
		})
	})
	scriptEnvClient.on('stop', () => {
		scriptProcess && scriptProcess.kill()
	})
}

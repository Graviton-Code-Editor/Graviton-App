import SidePanel from '../../constructors/side.panel'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import { element, render } from '@mkenzo_8/puffin'
import EnvOutlined from '../../components/icons/env.outlined'
import Explorer from '../../constructors/explorer'
import { basename } from 'path'
import EnvClient from '../../constructors/env_client'
import Notification from '../../constructors/notification'
import detectEnv from '../../utils/detect_env'
import Core from 'Core'
import { createProcess } from '../terminal_shells/local'
const {
	childProcess: { exec },
} = Core
import { ExplorerItemOptions } from 'Types/explorer'
import { Text } from '@mkenzo_8/puffin-drac'
import ContainerPanel from '../../components/container_panel'

/*
 * Only display it in Desktop version
 */
if (!RunningConfig.data.isBrowser && StaticConfig.data.appEnableProjectInspector) {
	RunningConfig.on('appLoaded', () => {
		const { panelNode } = new SidePanel({
			icon: EnvOutlined,
			panel: () => {
				return element({
					components: {
						Text,
						ContainerPanel,
					},
				})`
				<ContainerPanel empty="true">
					<Text lang-string="sidepanels.projectInspector.noProjectOpen"></Text>
				</ContainerPanel>
				`
			},
			hint: 'Project inspector',
		})
		RunningConfig.on('addFolderToRunningWorkspace', async ({ folderPath }) => {
			//Hide "No project open" message
			panelNode.children[0].setAttribute('empty', 'false')

			const { env, prefix, info } = await detectEnv(folderPath)
			if (env && info) {
				const envExplorer = Explorer({
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
		const item: ExplorerItemOptions = {
			label: key,
		}
		if (fromKey == 'scripts') {
			item.action = () => {
				executeScript(prefix, folder, key)
			}
		}
		if (Array.isArray(keys)) {
			item.label = `${key}. ${keys[key]}`
		} else if (typeof keyValue == 'object') {
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
	const scriptEnvClient = new EnvClient({
		name: script,
	})
	let spawnProcess
	scriptEnvClient.on('start', () => {
		RunningConfig.emit('registerTerminalShell', {
			name: script,
			onCreated(state) {
				spawnProcess = exec(`${prefix} ${script}`, {
					stdio: 'inherit',
					shell: true,
					detached: true,
					cwd: folder,
				})

				state.on('data', data => {
					state.emit('write', data)
				})

				spawnProcess.stdout.on('data', function (data) {
					data
						.trim()
						.split('\n')
						.forEach(line => {
							state.emit('write', `\r\n ${line}`)
						})
				})
			},
		})

		RunningConfig.emit('createTerminalSession', {
			shell: script,
		})

		if (!StaticConfig.data.appShowTerminal) {
			//Forcefully enable terminal
			StaticConfig.data.appShowTerminal = true
		}
	})
	scriptEnvClient.on('stop', () => {
		spawnProcess && spawnProcess.kill()
	})
}

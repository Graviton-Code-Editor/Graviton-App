import SidePanel from '../../constructors/side.panel'
import RunningConfig from 'RunningConfig'
import { element, render } from '@mkenzo_8/puffin'
import EnvOutlined from '../../components/icons/env.outlined'
import Explorer from '../../constructors/explorer'
const fs = window.require('fs')
const { join, basename } = window.require('path')
import EnvClient from '../../constructors/env.client'
import Notification from '../../constructors/notification'

RunningConfig.on('appLoaded',()=>{
	const { display, panelNode } = new SidePanel({
		icon: EnvOutlined,
		panel: ()=>element`<div></div>`
	})
	
	RunningConfig.on('addFolderToRunningWorkspace',({ folderPath })=>{
		
		const { env, info } = detectEnv(folderPath)
		
		switch( env ){
			case 'node':
				const envExplorer = new Explorer({
					items:[{
						label: basename(folderPath),
						items: getKeysToItems(info, folderPath) 
					}]
				})
				render(envExplorer, panelNode.children[0])
			break;
		}
	})
})

function detectEnv( folder ){
	if( fs.existsSync( join(folder,'package.json') ) ){
		return {
			env: 'node',
			info: require( join(folder,'package.json'))
		}
	}
	return {
		env: null,
		info:{}
	}
}

function getKeysToItems(keys, folder, fromKey ){
	return Object.keys(keys).map( key => {
		const item = {
			label: key
		}
		if( fromKey == 'scripts' ){
			item.action = () => {
				executeScript(folder, key)
			}
		}
		if( typeof keys[key] == 'object' ){
			item.items = getKeysToItems(keys[key],folder, key)
		}
		return item
	})
}

function executeScript( folder, script ){
	const { execFile } = window.require('child_process')
	
	const scriptEnvClient = new EnvClient({
		name: script,
	})
	let scriptProcess;
	scriptEnvClient.on('start',()=>{
		scriptProcess = execFile('npm run',[script],{
			stdio: 'inherit',
			shell: true,
			detached: true,
			cwd: folder
		})
		scriptProcess.stdout.on('data', data =>{
			new Notification({
				title: script,
				content: data
			})
		})
	})
	scriptEnvClient.on('stop',()=>{
		scriptProcess && scriptProcess.kill()
	})
}

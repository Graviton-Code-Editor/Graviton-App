import requirePath from './require'
import path from 'path';

const fs = requirePath('fs-extra')
const electronStore = requirePath('electron-store')
const getAppDataPath = requirePath('appdata-path')

const defaultConfiguration = {
	config:{
		'appTheme':'Arctic',
		'appLanguage':'english',
		'editorFontSize':'16',
		'appProjectsLog':[],
		'appConfigPath':path.join(getAppDataPath(),'.graviton2'),
		'appWorkspacesLog':[],
		'appZoom':1,
		'editorFSWatcher':true,
		'editorAutocomplete':true,
		'editorTabSize':4,
		'editorWrapLines':false,
		'appPlatform':'auto',
		'appShortCuts':{
			'SaveCurrentFile':{
				combos:['Ctrl+S']
			},
			'NewPanel':{
				combos:['Ctrl+N']
			},
			'CloseCurrentTab':{
				combos:['Ctrl+T']
			},
			'CloseCurrentPanel':{
				combos:['Ctrl+L']
			},
			'OpenCommandPrompt':{
				combos:['Ctrl+P']
			},
			'IterateCurrentPanelTabs':{
				combos:['Ctrl+Tab']
			}
		}
	}
}

function initConfiguration(){
	const configurationStore = new electronStore();
	console.log(configurationStore)
	Object.keys(defaultConfiguration.config).map(function(key){   
		if(!configurationStore.has(`config.${key}`)){
			configurationStore.set(
				`config.${key}`,
				defaultConfiguration.config[key]
			)
		}
	})
	if(!fs.existsSync(defaultConfiguration.config.appConfigPath)){ //If .graviton2 doesn't exist, it creates it
		fs.mkdirSync(defaultConfiguration.config.appConfigPath)
	}
	if(!fs.existsSync(path.join(defaultConfiguration.config.appConfigPath,'plugins'))){ //If .graviton2/plugins doesn't exist, it creates it
		fs.mkdirSync(path.join(defaultConfiguration.config.appConfigPath,'plugins'))
	}
	return {
		store:configurationStore
	}
}

function getConfiguration(){
	const { store } = initConfiguration()
	return {
		store:store,
		config:store.get('config')
	}
}

export {initConfiguration,getConfiguration}
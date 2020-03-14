import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'
import CursorPositionStatusBarItem from '../defaults/status.bar.items/cursor.position'
import Notification from './notification'
import requirePath from '../utils/require'
const path = requirePath("path")

function sortByRanking(language){
	const selectedEditor = RunningConfig.data.editorsRank.filter(function(Client){
		const {
			name,
			unknown=false
		} = Client.do('getLangFromExt',language)
		if( !unknown ) return Client
	})[0]
	if( selectedEditor != null ) {
		return selectedEditor
	}else{
		return RunningConfig.data.editorsRank[0]
	}
}

function Editor({
	bodyElement,
	tabElement,
	value,
	language,
	tabState,
	theme,
	directory
}){
	const Client = sortByRanking(language)
	const { instance } = Client.do('create',{
		element:bodyElement,
		language:Client.do('getLangFromExt',language),
		value,
		theme,
		fontSize:StaticConfig.data.fontSize,
		directory,
		CtrlPlusScroll:(direction)=> {
			if(direction == 'up'){
				StaticConfig.data.fontSize = Number(StaticConfig.data.fontSize)+2
			}else{
				if( StaticConfig.data.fontSize <=4) return
				StaticConfig.data.fontSize = Number(StaticConfig.data.fontSize)-2
			}
			Client.do('setFontSize',{
				instance:instance,
				element:bodyElement,
				fontSize:StaticConfig.data.fontSize
			})
		}
	})
	RunningConfig.on('aFileHasBeenChanged',({filePath,newData})=>{
		if( filePath == directory ){
			if(Client.do('getValue',instance) != newData){
				new Notification({
				title:path.basename(directory),
				content:'This file content has changed',
				buttons:[
					{
						label:'Update',
						action:()=>{
							Client.do('doChangeValue',{
								instance:instance,
								value:newData
							})
						}
					}
				]
			})
			}
		}
	})
	Client.do('clicked',{
		instance,
		action:()=> RunningConfig.emit('hideAllFloatingComps')
	})
	Client.do('onChanged',{
		instance:instance,
		action:()=>tabElement.props.state.emit('unsavedMe')
	})
	Client.do('onActive',{
		instance:instance,
		action:(instance)=>{
			tabElement.props.state.emit('focusedMe')
			focusEditor(Client,instance)
			RunningConfig.data.focusedPanel = tabState.data.panel
			if(CursorPositionStatusBarItem.isHidden()){
				CursorPositionStatusBarItem.show()
			}
			updateCursorPosition(Client,instance)
		}
	})
	StaticConfig.changed(function(){
		Client.do('setTheme',{
			instance:instance,
			theme:ExtensionsRegistry.registry.data.list[StaticConfig.data.theme].textTheme
		})
		Client.do('setFontSize',{
			instance:instance,
			element:bodyElement,
			fontSize:StaticConfig.data.fontSize
		})
	})
	if(CursorPositionStatusBarItem.isHidden()){
		CursorPositionStatusBarItem.show() //Display cursor position item in bottom bar
	}
	RunningConfig.changed(function(data){
		if(data.focusedEditor){
			CursorPositionStatusBarItem.show()
		}else{
			CursorPositionStatusBarItem.hide()
		}
	})
	tabState.on('focusedMe',()=>{
		focusEditor(Client,instance)
		updateCursorPosition(Client,instance)
		Client.do('doFocus',{instance})
		Client.do('doRefresh',{instance,element:bodyElement})
	})
	updateCursorPosition(Client,instance)
	focusEditor(Client,instance)
	return Client
}

function updateCursorPosition(Client,instance){
	const { line, ch } = Client.do('getCursorPosition',{instance:instance})
	CursorPositionStatusBarItem.setLabel(`Ln ${line}, Ch ${ch}`)
}

function focusEditor(Client,instance){
	RunningConfig.data.focusedEditor = {
		client:Client,
		instance:instance
	}
}
export default Editor
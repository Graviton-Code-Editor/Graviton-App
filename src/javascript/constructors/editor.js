import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'
import CursorPositionStatusBarItem from '../defaults/status.bar.items/cursor.position'
import Notification from './notification'
import requirePath from '../utils/require'
const path = requirePath("path")

function sortByRanking(language){
	const selectedEditor = RunningConfig.data.editorsRank.filter(function(Client){
		const { unknown=false } = Client.do('getLangFromExt',language)
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
		directory,
		CtrlPlusScroll:(direction)=> {
			if(direction == 'up'){
				StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize)+1
			}else{
				if( StaticConfig.data.editorFontSize <=4) return
				StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize)-1
			}
			Client.do('setFontSize',{
				instance:instance,
				element:bodyElement,
				fontSize:StaticConfig.data.editorFontSize
			})
		}
	})
	RunningConfig.on('aFileHasBeenChanged',({filePath,newData})=>{
		if( filePath == directory && tabElement.parentElement ){
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
			if( RunningConfig.data.focusedTab != tabElement ) tabElement.props.state.emit('focusedMe')
			if( RunningConfig.data.focusedEditor.instance != instance )focusEditor(Client,instance)
			if( RunningConfig.data.focusedPanel != tabState.data.panel ) RunningConfig.data.focusedPanel = tabState.data.panel
			if(CursorPositionStatusBarItem.isHidden()){
				CursorPositionStatusBarItem.show()
			}
			updateCursorPosition(Client,instance)
		}
	})
	StaticConfig.keyChanged('appTheme',function(){
		Client.do('setTheme',{
			instance:instance,
			theme:ExtensionsRegistry.registry.data.list[StaticConfig.data.appTheme].textTheme
		})
	})
	StaticConfig.keyChanged('editorTabSize',function(value){
		Client.do('setTabSize',{
			instance:instance,
			tabSize:value
		})
	})
	StaticConfig.keyChanged('editorFontSize',function(value){
		Client.do('setFontSize',{
			instance:instance,
			element:bodyElement,
			fontSize:value
		})
	})

	if(CursorPositionStatusBarItem.isHidden()){
		CursorPositionStatusBarItem.show() //Display cursor position item in bottom bar
	}
	RunningConfig.keyChanged('focusedEditor',function(editor){
		if(editor){
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
	return {
		client:Client,
		instance
	}
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
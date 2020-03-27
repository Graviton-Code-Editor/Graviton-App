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
	let editorValueSaved = value
	const { instance } = Client.do('create',{
		element:bodyElement,
		language:Client.do('getLangFromExt',language),
		value,
		theme,
		directory,
		CtrlPlusScroll:(direction)=> {
			const ScrollUpShortcutEnabled = StaticConfig.data.appShortcuts.IncreaseEditorFontSize.combos.includes('Ctrl+ScrollUp')
			const ScrollDownShortcutEnabled = StaticConfig.data.appShortcuts.DecreaseEditorFontSize.combos.includes('Ctrl+ScrollDown')
			
			if( direction == 'up' && ScrollUpShortcutEnabled ){
				StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize)+2
			}else if( ScrollDownShortcutEnabled ){
				if( StaticConfig.data.editorFontSize <=4) return
				StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize)-2
			}
			if( ScrollUpShortcutEnabled || ScrollDownShortcutEnabled)
				Client.do('setFontSize',{
					instance:instance,
					element:bodyElement,
					fontSize:StaticConfig.data.editorFontSize
				})
		}
	})
	Client.do('doFocus',{instance})
	const fileWatcher = RunningConfig.on('aFileHasBeenChanged',({filePath,newData})=>{
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
		action:(currentValue)=>{
			if( currentValue == editorValueSaved ){
				tabElement.props.state.emit('markAsSaved')
			}else{
				tabElement.props.state.emit('unsavedMe')
			}
			
		}
	})
	Client.do('onActive',{
		instance:instance,
		action:(instance)=>{
			if( tabElement.parentElement ) {
				if( RunningConfig.data.focusedEditor == null || RunningConfig.data.focusedEditor.instance != instance )focusEditor(Client,instance)
				if( RunningConfig.data.focusedPanel != tabState.data.panel ) RunningConfig.data.focusedPanel = tabState.data.panel
				if( RunningConfig.data.focusedTab != tabElement ) RunningConfig.data.focusedTab = tabElement
				if(CursorPositionStatusBarItem.isHidden()){
					CursorPositionStatusBarItem.show()
				}
				updateCursorPosition(Client,instance)
			}
		}
	})
	const appThemeWatcher = StaticConfig.keyChanged('appTheme',function(){
		Client.do('setTheme',{
			instance:instance,
			theme:ExtensionsRegistry.registry.data.list[StaticConfig.data.appTheme].textTheme
		})
	})
	const editorTabSizeWatcher = StaticConfig.keyChanged('editorTabSize',function(value){
		Client.do('setTabSize',{
			instance:instance,
			tabSize:value
		})
	})
	const editorFontSizeWatcher = StaticConfig.keyChanged('editorFontSize',function(value){
		Client.do('setFontSize',{
			instance:instance,
			element:bodyElement,
			fontSize:value
		})
	})
	const focusedEditorWatcher = RunningConfig.keyChanged('focusedEditor',function(editor){
		if(editor){
			CursorPositionStatusBarItem.show()
		}else{
			CursorPositionStatusBarItem.hide()
		}
	})
	const editorWrapLinesWatcher = StaticConfig.keyChanged('editorWrapLines',function(value){
		if( value ){
			Client.do('setLinesWrapping',{instance,status:true})
		}else{
			Client.do('setLinesWrapping',{instance,status:false})
		}
	})
	const tabFocusedWatcher = tabState.on('focusedMe',()=>{
		focusEditor(Client,instance)
		updateCursorPosition(Client,instance)
		Client.do('doRefresh',{instance})
	})
	const tabSavedWatcher = tabState.on('savedMe',()=>{
		editorValueSaved = Client.do('getValue',instance)
	})
	if(CursorPositionStatusBarItem.isHidden()){
		CursorPositionStatusBarItem.show() //Display cursor position item in bottom bar
	}
	updateCursorPosition(Client,instance)
	focusEditor(Client,instance)
	const tabDestroyedWatcher = tabElement.props.state.on('destroyed',()=>{
		fileWatcher.cancel()
		appThemeWatcher.cancel()
		editorTabSizeWatcher.cancel()
		editorFontSizeWatcher.cancel()
		tabFocusedWatcher.cancel()
		focusedEditorWatcher.cancel()
		tabDestroyedWatcher.cancel()
		tabSavedWatcher.cancel()
	})
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
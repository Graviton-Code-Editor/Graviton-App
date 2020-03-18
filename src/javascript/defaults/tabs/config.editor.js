import Tab from '../../constructors/tab'
import Editor from '../../constructors/editor'
import ExtensionsRegistry from 'ExtensionsRegistry'
import StaticConfig from 'StaticConfig'

function updateStaticConfigByKey(client,instance){
	const newConfig = JSON.parse(client.do('getValue',instance))
	Object.keys(StaticConfig.data).map((key)=>{
		StaticConfig.data[key] = newConfig[key]
	})
}

function configEditor(){
	const { bodyElement, tabElement, tabState, isCancelled } = new Tab({
		title:'Configuration'
	})
	if( isCancelled ) return; //Cancels the tab opening
	const {client,instance} = new Editor({
		language:'json',
		value:JSON.stringify(StaticConfig.data,null,3),
		theme:ExtensionsRegistry.registry.data.list[StaticConfig.data.appTheme].textTheme,
		bodyElement,
		tabElement,
		tabState
	})
	StaticConfig.keyChanged('editorFontSize',()=>{
		if( tabElement ){
			const newConfig = JSON.parse(client.do('getValue',instance))
			if( newConfig.editorFontSize != StaticConfig.data.editorFontSize ){
				const initialCursor = client.do('getCursorPosition',{instance})
				newConfig.editorFontSize = StaticConfig.data.editorFontSize
				client.do('doChangeValue',{instance, value:JSON.stringify(newConfig,null,2)})
				client.do('doIndent',{instance}) 
				client.do('setCursorPosition',{instance,...initialCursor})
			}
		}

	})
	client.do('doIndent',{instance}) //Force an initial indentation
	client.do('doFocus',{instance}) //Force an initial indentation
	tabState.emit('savedMe') //Save the tab
		
	tabElement.props.state.on('savedMe',()=>{
		updateStaticConfigByKey(client,instance)
	})
}
export default configEditor
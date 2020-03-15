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
	
	tabElement.props.state.on('savedMe',()=>{
		updateStaticConfigByKey(client,instance)
	})
}
export default configEditor
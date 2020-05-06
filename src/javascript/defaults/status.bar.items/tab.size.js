import StatusBarItem from '../../constructors/status.bar.item'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'

const getMessage = tabSize => `Tab size: ${tabSize}`

const TabSizeStatusBarItem = new StatusBarItem({
	label: getMessage(StaticConfig.data.editorTabSize),
	position: 'right',
})

StaticConfig.keyChanged('editorTabSize', () => {
	TabSizeStatusBarItem.setLabel(getMessage(StaticConfig.data.editorTabSize))
})

RunningConfig.on('appLoaded', () => {
	TabSizeStatusBarItem.show()
})

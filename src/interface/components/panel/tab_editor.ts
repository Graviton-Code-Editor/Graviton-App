import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		min-height:100%;
		max-height:100%;
		display:flex;
		flex-direction: row;
	}
	& .CodeMirror {
		min-height:100%;
		flex:1;
	}
	& .CodeMirror-scroll{
		overflow-x:hidden;
	}

`

function TabEditor() {
	return element`
		<div class="${styleWrapper}"/>
	`
}

export default TabEditor

import { element, style } from '@mkenzo_8/puffin'

const styleWrapper = style`
	&{
		min-height:100%;
		max-height:100%;
		display:flex;
	}
	& .CodeMirror {
		min-height:100%;
		flex:1;
	}
	& .CodeMirror-scroll{
		overflow-x:hidden;
	}
`

function TabEditor(){
	return element`
		<div class="${styleWrapper}"/>
	`	
}

export default TabEditor
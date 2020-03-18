import StatusBarItem from '../../constructors/status.bar.item'

const CursorPositionStatusBarItem = new StatusBarItem({
	label:'Ln 0, Ch 0',
	position:'left',
	action:()=>{
		// Nothing on click
	}
})

CursorPositionStatusBarItem.hide() //Hide it by default and only show when there is an editor opened

export default CursorPositionStatusBarItem
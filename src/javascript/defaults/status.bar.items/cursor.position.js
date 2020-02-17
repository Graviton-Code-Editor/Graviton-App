import StatusBarItem from '../../constructors/status.bar.item'

const CursorPositionStatusBarItem = new StatusBarItem({
    label:'Ln 0, Ch 0',
    position:'left',
    action:()=>{
        //
    }
})

CursorPositionStatusBarItem.hide()

export default CursorPositionStatusBarItem
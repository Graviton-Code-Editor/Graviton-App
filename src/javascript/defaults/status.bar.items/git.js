import { element, style } from '@mkenzo_8/puffin'
import StatusBarItem from '../../constructors/status.bar.item'
import RunningConfig from 'RunningConfig'

const styleWrapper = style`
	& {
		color:var(--statusbarGitItemText);
	}
	&.active{
		color:var(--statusbarGitItemModifiedText) !important;
	}
`

function branchIndicator(){
	let data = {
		branch: ''
	}
	return element`
		<span mounted="${mounted}" class="${styleWrapper}">${()=>data.branch}</span>
	`
	function mounted(){
		RunningConfig.on('loadedGitRepo',({ branch, anyChanges,parentFolder })=>{
			data.branch = branch
			this.update()
			branchIndicatorItem.show()
			if( anyChanges ) {
				this.classList.add('active')
			}else{
				this.classList.remove('active')
			}
		})
		RunningConfig.on('gitStatusUpdated',({ branch, anyChanges, parentFolder })=>{
			data.branch = branch
			this.update()
			branchIndicatorItem.show()
			if( anyChanges ) {
				this.classList.add('active')
			}else{
				this.classList.remove('active')
			}
		})
	}
}

const branchIndicatorItem = new StatusBarItem({
	component: branchIndicator,
	position: 'right'
})


RunningConfig.on("appLoaded",()=>{
	branchIndicatorItem.hide()
})



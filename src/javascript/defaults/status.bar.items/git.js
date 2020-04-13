import { puffin } from '@mkenzo_8/puffin'
import StatusBarItem from '../../constructors/status.bar.item'
import RunningConfig from 'RunningConfig'

const styleWrapper = puffin.style.css`
	& {
		color:var(--statusbarGitItemText);
	}
	&.active{
		color:var(--statusbarGitItemModifiedText) !important;
	}
`

const branchIndicator = puffin.element(`
	<span class="${styleWrapper}">{{branch}}</span>
`,{
	props:[
		'branch'
	],
	events:{
		mounted(){
			RunningConfig.on('loadedGitRepo',({ branch, anyChanges,parentFolder })=>{
				this.props.branch = branch
				branchIndicatorItem.show()
				if( anyChanges ) {
					this.classList.add('active')
				}else{
					this.classList.remove('active')
				}
			})
			RunningConfig.on('gitStatusUpdated',({ branch, anyChanges, parentFolder })=>{
				this.props.branch = branch
				branchIndicatorItem.show()
				if( anyChanges ) {
					this.classList.add('active')
				}else{
					this.classList.remove('active')
				}
			})
		}
	}
})

const branchIndicatorItem = new StatusBarItem({
	component: branchIndicator,
	position: 'right'
})

branchIndicatorItem.hide()


import StatusBarItem from '../../constructors/status.bar.item'
import Plus from '../../components/icons/plus'
import Minus from '../../components/icons/minus'
import StaticConfig from 'StaticConfig'

new StatusBarItem({
	component:Plus,
	position:'right',
	action:()=>{
		StaticConfig.data.appZoom += 0.1
	}
})
new StatusBarItem({
	component:Minus,
	position:'right',
	action:()=>{
		StaticConfig.data.appZoom -= 0.1
	}
})
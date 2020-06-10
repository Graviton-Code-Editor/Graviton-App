import { element } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import Item from '../components/explorer/item'

function Explorer({ items }) {
	return element`
		<div>
			${items.map(item => {
				return Item(item)
			})}
		</div>
	`
}

export default Explorer

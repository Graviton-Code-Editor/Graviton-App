import { element } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import Item from '../components/explorer/item'
import { ExplorerOptions } from '../types/explorer'

function Explorer({ items }: ExplorerOptions) {
	return element`
		<div>
			${items.map(item => {
				return new Item(item)
			})}
		</div>
	`
}

export default Explorer

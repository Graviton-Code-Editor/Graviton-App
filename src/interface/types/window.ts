import { PuffinEventInstance } from './puffin.state'
import { PuffinComponent } from './puffin.component'

interface WindowOptions {
	title?: string
	component: () => object
	minWidth?: string
	minHeight?: string
	height?: string
	width?: string
	id?: string
}

interface WindowInstance {
	launch: () => void
	close: () => void
	on: (eventName: string, eventData: any) => PuffinEventInstance
}

export { WindowOptions, WindowInstance }

import PuffinElement from './puffin.element'
import { PuffinComponent } from './puffin.component'

interface NotificationButton {
	label: string
	action?: () => void
}

export interface NotificationOptions {
	component?: () => PuffinComponent
	title: string
	content?: string
	buttons?: NotificationButton[]
	lifeTime?: number | typeof Infinity
	author?: string
}

export interface NotificationDetails {
	title: string
	content?: string
	element: PuffinElement
	instance: NotificationInstance
}

export interface NotificationInstance {
	remove: () => void
}

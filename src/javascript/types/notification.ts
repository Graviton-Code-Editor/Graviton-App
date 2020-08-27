import PuffinElement from './puffin.element'

interface NotificationButton {
	label: string
	action?: () => void
}

export interface NotificationOptions {
	title: string
	content?: string
	buttons?: NotificationButton[]
}

export interface NotificationDetails {
	title: string
	content?: string
	element: PuffinElement
}

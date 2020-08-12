interface NotificationButton {
	label: string
	action?: () => void
}

export interface NotificationOptions {
	title: string
	content?: string
	buttons?: NotificationButton[]
}

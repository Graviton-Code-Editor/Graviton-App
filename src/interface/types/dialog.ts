import { PuffinEventInstance } from './puffin.state'
import { PuffinComponent } from './puffin.component'

export interface DialogButton {
	label: string
	important?: boolean
	action?: object
}

export interface DialogOptions {
	title?: string
	content?: string
	buttons: DialogButton[]
	component?: PuffinComponent
	height?: string
	width?: string
	id?: string
}

export interface DialogInstance {
	on: (eventName: String, eventAction: (any) => void) => PuffinEventInstance
	launch: () => void
	close: () => void
}

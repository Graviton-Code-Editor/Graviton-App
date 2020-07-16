interface DialogButton {
	label: string
	important?: boolean
	action: object
}

interface DialogOptions {
	title: string
	content?: string
	buttons: DialogButton[]
	component?: any
	height?: string
	width?: string
	id?: string
}

export { DialogButton, DialogOptions }

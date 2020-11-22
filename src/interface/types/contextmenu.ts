export interface ContextMenuButton {
	label?: string
	action?: () => void
	id?: number
}

export interface ContextMenuOptions {
	parent?: HTMLElement | null
	list: Array<ContextMenuButton>
	event?: MouseEvent
	x?: number
	y?: number
}

import { StatusResult } from 'simple-git'

interface ExplorerItemMounted {
	setIcons?: () => void
	setItems?: () => void
	setDecorator?: () => void
}

interface ExplorerItemOptions {
	label?: String
	items?: this[]
	mounted?: (ExplorerItemMounted) => void
	icon?: String
	iconComp?: any
	action?: () => void
	contextAction?: (any) => void
	decorator?: any
	component?: () => void
}

interface ExplorerOptions {
	items: ExplorerItemOptions[]
}

//Files Explorer Item
interface ExplorerItem extends HTMLElement {
	gitChanges: StatusResult
}

export { ExplorerItem, ExplorerOptions, ExplorerItemOptions }

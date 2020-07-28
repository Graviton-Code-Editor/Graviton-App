import { StatusResult } from 'simple-git'

interface ExplorerItemOptions {
	label: String
	items: this[]
	mounted?: () => void
	icon?: String
	iconComp?: any
	action?: () => void
	contextAction?: () => void
}

interface ExplorerOptions {
	items: ExplorerItemOptions[]
}

//Files Explorer Item
interface ExplorerItem extends HTMLElement {
	gitChanges: StatusResult
}

export { ExplorerItem, ExplorerOptions, ExplorerItemOptions }

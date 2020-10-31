import { StatusResult } from 'simple-git'
import { PuffinComponent } from './puffin.component'

interface ExplorerItemHooks {
	setIcon?: (iconPath: string) => void
	setItems?: (items: ExplorerItemOptions[], openItems?: boolean) => void
	setDecorator?: (decorator: ExplorerItemDecorator) => void
	setLabel?: (label: string) => void
}

interface ExplorerItemDecorator {
	label?: String
	background?: String
	color?: String
	fontSize?: String
}

interface ExplorerItemOptions {
	label?: String
	items?: this[]
	mounted?: (hooks: ExplorerItemHooks) => void
	icon?: String
	iconComp?: () => PuffinComponent
	action?: (e: MouseEvent, hooks: ExplorerItemHooks) => void
	contextAction?: (e: MouseEvent, hooks: ExplorerItemHooks) => void
	decorator?: ExplorerItemDecorator
	component?: () => PuffinComponent
}

interface ExplorerOptions {
	items: ExplorerItemOptions[]
}

//Files Explorer Item
interface ExplorerItem extends HTMLElement {
	gitChanges: StatusResult
}

export { ExplorerItem, ExplorerOptions, ExplorerItemOptions, ExplorerItemDecorator }

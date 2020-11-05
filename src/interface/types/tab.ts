import PuffinElement from './puffin.element'

/*
 * Tab's constructor options
 */
export interface TabOptions {
	title: string
	component?: any
	isEditor?: boolean
	directory?: string
	panel?: any
	id?: string
	projectPath?: number
	explorerProvider: any
}

/*
 * Tab-related events's arguments emitted in RunningConfig
 */
export interface TabEventArgs {
	tabElement?: PuffinElement
	directory?: string
	client?: any
	instance?: any
	parentFolder?: string
	projectPath?: string
	isEditor?: boolean
	justCreated?: boolean
}

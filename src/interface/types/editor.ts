import { EditorClient } from './editorclient'
import PuffinElement from './puffin.element'
import { PuffinState } from './puffin.state'

export interface EditorOptions {
	client: EditorClient
	instance: any
	tabElement: PuffinElement
	bodyElement: PuffinElement
	tabState: PuffinState
	filePath: string
	language: string
	savedFileContent: string
	options?: any
}

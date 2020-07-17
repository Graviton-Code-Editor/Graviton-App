import { StatusResult } from 'simple-git'

interface PuffinElement extends HTMLElement {
	update: any
	state: any
	gitChanges?: StatusResult
}

export default PuffinElement

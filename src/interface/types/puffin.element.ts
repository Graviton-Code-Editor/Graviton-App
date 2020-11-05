import { StatusResult } from 'simple-git'

interface PuffinElement extends HTMLElement {
	update?: any
	state?: any
	gitChanges?: StatusResult
	src?: any
}

export default PuffinElement

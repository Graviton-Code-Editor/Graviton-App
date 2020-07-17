import { StatusResult } from 'simple-git'

interface ExplorerItem extends HTMLElement {
	gitChanges: StatusResult
}

export { ExplorerItem }

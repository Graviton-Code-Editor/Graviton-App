import { StatusResult } from 'simple-git'

export interface LoadedGitRepo {
	gitChanges: StatusResult
	branch: string
	parentFolder: string
	anyChanges: boolean
	explorerProvider: any
}

export interface gitRepoStatusUpdated {
	gitChanges: StatusResult
	branch: string
	parentFolder: string
	anyChanges: boolean
}

/*
 * File-related events emmited in RunningConfig
 */
export interface FileEventsArgs {
	parentFolder?: string
	filePath?: string
}

/*
 * Folder-related events emmited in RunningConfig
 */
export interface FolderEventsArgs {
	parentFolder?: string
	filePath?: string
}

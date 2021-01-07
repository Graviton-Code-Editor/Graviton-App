/*
 * File-related events emmited in RunningConfig
 */
export interface FileEventsArgs {
	parentFolder?: string
	filePath?: string
	newData?: string
}

/*
 * Folder-related events emmited in RunningConfig
 */
export interface FolderEventsArgs {
	parentFolder?: string
	filePath?: string
}

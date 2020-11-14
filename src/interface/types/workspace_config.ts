interface WorkspaceFolder {
	name: String
	path: String
}

interface WorkspaceSettings {
	name: String
	folders: WorkspaceFolder[]
	workspace?: {
		noFolders: String // Save or not local folder's paths
	}
	settings?: {
		// Any user config
	}
}

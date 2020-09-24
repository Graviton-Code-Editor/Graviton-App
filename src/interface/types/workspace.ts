interface AddFolderInWorkspace{
	folderPath: string,
	replaceOldExplorer: boolean,
	workspacePath: string
}

interface AddFolderInWorkspaceFromDialog{
	replaceOldExplorer: boolean
}

interface SetWorkspace{
	workspacePath: string
}

interface RemoveWorkspace{
	workspacePath: string
}

export {
	AddFolderInWorkspace,
	AddFolderInWorkspaceFromDialog,
	SetWorkspace,
	RemoveWorkspace
}
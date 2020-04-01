const { remote } = window.require("electron")
import normalizeDir from  '../directory.normalizer'

function selectFolderDialog(){
	return new Promise((resolve, reject) => {
		const { dialog , getCurrentWindow} = remote;
		dialog
			.showOpenDialog(getCurrentWindow(), {
			properties: ["openDirectory"]
		})
			.then(result => {
				if (result.canceled) return;
				resolve(normalizeDir(result.filePaths[0]))
			})
			.catch(err => {
				reject(err)
			});
	})
}

export default selectFolderDialog

const { remote } = window.require("electron")
import normalizeDir from  '../directory.normalizer'

/** 
 * Opens a native dialog
  * to select files
 * @constructor
 * @returns promise
 */
function selectFileDialog(){
	return new Promise(( resolve, reject ) => {
		const { dialog , getCurrentWindow } = remote;
		dialog.showOpenDialog( getCurrentWindow() , {
				properties: ['openFile']
			}).then( result => {
				if ( result.canceled ) return;
				resolve(
					normalizeDir(
						result.filePaths[0]
					)
				)
			}).catch( err => {
				reject(err)
			});
	})
}

export default selectFileDialog

import RunningConfig from 'RunningConfig'

export function getFileIcon(fileName: string, fileExt: string) {
	const filetype = fileName.split('.').slice(1).join('.')
	if (fileExt === ('png' || 'jpg' || 'ico')) {
		return RunningConfig.data.iconpack.image || RunningConfig.data.iconpack['unknown.file']
	}
	if (RunningConfig.data.iconpack[`${filetype}.type`]) {
		return RunningConfig.data.iconpack[`${filetype}.type`]
	}
	if (RunningConfig.data.iconpack[`file.${fileName}`]) {
		return RunningConfig.data.iconpack[`file.${fileName}`]
	}
	if (RunningConfig.data.iconpack[`${fileExt}.lang`]) {
		return RunningConfig.data.iconpack[`${fileExt}.lang`]
	} else {
		return RunningConfig.data.iconpack['unknown.file']
	}
}

export function getFileIconType(fileName: string, fileExt: string) {
	const filetype = fileName.split('.').slice(1).join('.')
	if (fileExt === ('png' || 'jpg' || 'ico')) {
		return 'image'
	}
	if (RunningConfig.data.iconpack[`${filetype}.type`]) {
		return `${filetype}.type`
	}
	if (RunningConfig.data.iconpack[`file.${fileName}`]) {
		return `file.${fileName}`
	}
	if (RunningConfig.data.iconpack[`${fileExt}.lang`]) {
		return `${fileExt}.lang`
	} else {
		return 'unknown.file'
	}
}

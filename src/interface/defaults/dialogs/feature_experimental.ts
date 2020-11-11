import Dialog from '../../constructors/dialog'

export default function ExperimentalDialog() {
	return new Dialog({
		title: 'dialogs.experimentalFeature.title',
		content: 'dialogs.experimentalFeature.content',
		buttons: [
			{
				label: 'misc.Understood',
			},
		],
	})
}

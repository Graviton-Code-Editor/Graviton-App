import Core from 'Core'
const {
	electron: { shell },
} = Core

export default function About() {
	return {
		about: [
			{
				type: 'title',
				label: 'windows.Settings.About.About',
			},
			{
				type: 'text',
				label: 'windows.Settings.About.GravitonDescription',
			},
			{
				type: 'button',
				label: 'Documentation',
				onClick() {
					shell.openExternal('https://graviton.netlify.app')
				},
			},
		],
	}
}

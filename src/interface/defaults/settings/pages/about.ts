import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import { Text, Button } from '@mkenzo_8/puffin-drac'
import Core from 'Core'
import GravitonLargeLogo from '../../../../../assets/large_logo.svg'
import packageJSON from '../../../../../package.json'
const { openExternal } = Core
import ReloadIcon from '../../../components/icons/reload'
import checkForUpdates from '../../../utils/check.updates'
import Notification from 'Constructors/notification'

const styleWrapper = style`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	text-align: center;
	& .icon {
		height: 12px;
		cursor: pointer;
	}
`

export default function About() {
	function openWebsite() {
		openExternal('https://graviton.netlify.app/')
	}

	function checkForAnyUpdates() {
		checkForUpdates(() => {
			new Notification({
				title: 'No updates found',
			})
		})
	}

	return element({
		components: {
			Button,
			Text,
			ReloadIcon,
		},
	})`
		<div class="${styleWrapper} section" href="about">
			<div>
				<img width="175px" draggable="false" src="${GravitonLargeLogo}"/> 
				<Text>
					Graviton v${packageJSON.version} 
					<ReloadIcon class="icon" title="Check for updates" :click="${checkForAnyUpdates}"/> 
				</Text>
				<Button :click="${openWebsite}" lang-string="menus.Help.Website"/>
			</div>
		</div>
	`
}

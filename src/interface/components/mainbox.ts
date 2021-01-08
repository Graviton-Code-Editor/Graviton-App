import { element, render } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import Terminal from './terminal'
import PuffinElement from 'Types/puffin.element'

const MainBoxStyle = style`
	position: relative;
	min-height: 100px;
	max-height: calc(100% - 2px);
	bottom: 0;
	flex: 1;
	border-top: 1px solid var(--panelBorder);
`

function handleTerminal(element: PuffinElement, state: boolean) {
	const resizerElement = <PuffinElement>element.previousElementSibling
	if (state) {
		element.style.display = 'block'
		resizerElement.style.display = 'block'
		document.getElementById('panels_stack').style.height = '70%'
		if (RunningConfig.data.openedTerminals.length === 0 && !RunningConfig.data.isBrowser) {
			RunningConfig.emit('createTerminalSession', {
				shell: StaticConfig.data.terminalDefaultShell,
			})
		}
	} else {
		element.style.display = 'none'
		resizerElement.style.display = 'none'
	}
}

export default function MainBox() {
	function mounted() {
		RunningConfig.once('allPluginsLoaded', () => {
			handleTerminal(this, StaticConfig.data.appShowTerminal)
		})

		StaticConfig.keyChanged('appShowTerminal', (state: boolean) => {
			handleTerminal(this, state)
		})
	}

	function resized() {
		//Send the resize event to the Terminal State
		RunningConfig.emit('mainBoxHasBeenResized')
	}

	return element({
		components: {
			Terminal,
		},
	})`
		<div :resized="${resized}" mounted="${mounted}" class="${MainBoxStyle}">
			<Terminal/>
		</div>
	`
}
